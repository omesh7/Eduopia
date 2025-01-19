'use server'
import db from "@/db/drizzle";
import {
	quizzes,
	questions as dbQuestions,
	questionAnswers,
	users,
} from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import type { InferInsertModel } from "drizzle-orm";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

interface SaveQuizzData extends Quizz {
	questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuizz(quizzData: SaveQuizzData) {
	const supabase = createClient();
	const { name, description, questions } = quizzData;
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.id, user.id)
	});

	if (!existingUser) {
		await db.insert(users).values({
			id: user.id,
			email: user.email!,
			name: user.user_metadata.full_name || null,
			image: user.user_metadata.avatar_url || null,
		});
	}

	const newQuizz = await db
		.insert(quizzes)
		.values({
			name: name,
			description: description,
			userId: user.id,
		})
		.returning({ insertedId: quizzes.id });
	const quizzId = newQuizz[0].insertedId;

	await db.transaction(async (tx) => {
		for (const question of questions) {
			const [{ questionId }] = await tx
				.insert(dbQuestions)
				.values({
					questionText: question.questionText,
					quizzId,
				})
				.returning({ questionId: dbQuestions.id });

			if (question.answers && question.answers.length > 0) {
				await tx.insert(questionAnswers).values(
					question.answers.map((answer) => ({
						answerText: answer.answerText,
						isCorrect: answer.isCorrect,
						questionId,
					})),
				);
			}
		}
	});

	return { quizzId };
}
