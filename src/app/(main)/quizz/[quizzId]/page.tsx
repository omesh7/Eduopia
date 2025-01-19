import { quizzes } from "@/db/schema";
import { eq } from 'drizzle-orm';

import db from "@/db/drizzle";
import QuizzQuestions from "../_components/QuizzQuestions";

const page = async ({ params }: {
  params: {
    quizzId: string
  }
}) => {
  const quizzId = params.quizzId;
  const quizz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, Number.parseInt(quizzId)),
    with: {
      questions: {
        with: {
          answers: true
        }
      }
    }
  })

  if (!quizzId || !quizz || quizz.questions.length === 0) {
    return <div>Quizz not found</div>
  };

  return (
    <QuizzQuestions 
      quizz={quizz} 
      initialPercentage={0} 
      initialHearts={5}
      userPlan="FREE"
    />
  )
}

export default page;