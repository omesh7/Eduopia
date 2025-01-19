import { type NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

import saveQuizz from "./saveToDb";
import { getLoader } from "./helper";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("document");

  if (!document) {
    throw new Error("No document provided");
  }

  try {
    const loader = getLoader(document as Blob);

    const docs = await loader.load();

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    const prompt =
      "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    const openAIApiKey = process.env.OPENAI_API_KEY;

    if (!openAIApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: openAIApiKey,
      modelName: "gpt-4o-mini",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from the output",
      parameters: {
        type: "object",
        properties: {
          quizz: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    questionText: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          answerText: { type: "string" },
                          isCorrect: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: `${prompt}\n${texts.join("\n")}`,
        },
      ],
    });

    const result: any = await runnable.invoke([message]);
    console.log(result);

    const { quizzId } = await saveQuizz(result.quizz);

    return NextResponse.json({ quizzId }, { status: 200 });
  } catch (e: any) {
    //print error properly
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
