import { relations } from "drizzle-orm/relations";
import { quizzes, questions, answers, users } from "./schema";

export const questionsRelations = relations(questions, ({one, many}) => ({
	quiz: one(quizzes, {
		fields: [questions.quizzId],
		references: [quizzes.id]
	}),
	answers: many(answers),
}));

export const quizzesRelations = relations(quizzes, ({one, many}) => ({
	questions: many(questions),
	user: one(users, {
		fields: [quizzes.userId],
		references: [users.id]
	}),
}));

export const answersRelations = relations(answers, ({one}) => ({
	question: one(questions, {
		fields: [answers.questionId],
		references: [questions.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	quizzes: many(quizzes),
}));