
'use server'
import db from "@/db/drizzle";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserQuizzes(userId: string) {
	const userQuizzes = await db.query.quizzes.findMany({
		where: eq(quizzes.userId, userId),
		with: {
			questions: true,
			submissions: true,
		},
	});
	return userQuizzes;
}
