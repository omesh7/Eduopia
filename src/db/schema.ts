import {
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	integer,
	varchar,
	pgEnum,
	serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define the quiz type enum
export const quizzTypeEnum = pgEnum("quizz_type", ["SELECT", "ASSIST"]);
export const planTypeEnum = pgEnum("plan_type", ["FREE", "PREMIUM"]);


export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: text("email").notNull(),
	name: varchar("name", { length: 255 }),
	image: text("image"),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	plan: planTypeEnum("plan").default("FREE").notNull(),
});

// export const quizzes = pgTable("quizzes", {
// 	id: uuid("id").defaultRandom().primaryKey().notNull(),
// 	name: text("name"),
// 	description: text("description"),
// 	userId: uuid("user_id").references(() => users.id),
// });

// export const questions = pgTable("questions", {
// 	id: uuid("id").defaultRandom().primaryKey().notNull(),
// 	questionText: text("question_text"),
// 	quizzId: uuid("quizz_id"),
// });

// export const questionAnswers = pgTable("answers", {
// 	id: uuid("id").defaultRandom().primaryKey().notNull(),
// 	questionId: uuid("question_id"),
// 	answerText: text("answer_text"),
// 	isCorrect: boolean("is_correct"),
// });

// export const quizzSubmissions = pgTable("quizz_submissions", {
// 	id: uuid("id").defaultRandom().primaryKey().notNull(),
// 	quizzId: uuid("quizz_id"),
// 	score: integer("score"),
// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// //------------------------------RELATIONS----------------------------

// export const quizzesRelations = relations(quizzes, ({ many }) => ({
// 	questions: many(questions),
// 	submissions: many(quizzSubmissions),
// }));

// export const questionsRelations = relations(questions, ({ one, many }) => ({
// 	quizz: one(quizzes, {
// 		fields: [questions.quizzId],
// 		references: [quizzes.id],
// 	}),
// 	answers: many(questionAnswers),
// }));

// export const questionAnswersRelations = relations(
// 	questionAnswers,
// 	({ one }) => ({
// 		question: one(questions, {
// 			fields: [questionAnswers.questionId],
// 			references: [questions.id],
// 		}),
// 	}),
// );

// export const quizzSubmissionsRelations = relations(
// 	quizzSubmissions,
// 	({ one }) => ({
// 		quizz: one(quizzes, {
// 			fields: [quizzSubmissions.quizzId],
// 			references: [quizzes.id],
// 		}),
// 	}),
// );

export const quizzes = pgTable("quizzes", {
	id: serial("id").primaryKey(),
	name: text("name"),
	description: text("description"),
	userId: uuid("user_id").references(() => users.id),
});

export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
	questions: many(questions),
	submissions: many(quizzSubmissions),
}));

export const questions = pgTable("questions", {
	id: serial("id").primaryKey(),
	questionText: text("question_text"),
	quizzId: integer("quizz_id"),
	type: quizzTypeEnum("quiz_type").default("SELECT").notNull(),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
	quizz: one(quizzes, {
		fields: [questions.quizzId],
		references: [quizzes.id],
	}),
	answers: many(questionAnswers),
}));

export const questionAnswers = pgTable("answers", {
	id: serial("id").primaryKey(),
	questionId: integer("question_id"),
	answerText: text("answer_text"),
	isCorrect: boolean("is_correct"),
});

export const questionAnswersRelations = relations(
	questionAnswers,
	({ one }) => ({
		question: one(questions, {
			fields: [questionAnswers.questionId],
			references: [questions.id],
		}),
	}),
);

export const quizzSubmissions = pgTable("quizz_submissions", {
	id: serial("id").primaryKey(),
	quizzId: integer("quizz_id"),
	score: integer("score"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizzSubmissionsRelations = relations(
	quizzSubmissions,
	({ one }) => ({
		quizz: one(quizzes, {
			fields: [quizzSubmissions.quizzId],
			references: [quizzes.id],
		}),
	}),
);
