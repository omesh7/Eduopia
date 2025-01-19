import { pgTable, foreignKey, uuid, text, boolean, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const planTypeEnum = pgEnum("plan_type_enum", ['free', 'premium'])



export const questions = pgTable("questions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	questionText: text("question_text"),
	quizzId: uuid("quizz_id"),
},
(table) => {
	return {
		questionsQuizzIdFkey: foreignKey({
			columns: [table.quizzId],
			foreignColumns: [quizzes.id],
			name: "questions_quizz_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const answers = pgTable("answers", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	questionId: uuid("question_id"),
	answerText: text("answer_text"),
	isCorrect: boolean("is_correct"),
},
(table) => {
	return {
		answersQuestionIdFkey: foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "answers_question_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const quizzes = pgTable("quizzes", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name"),
	description: text("description"),
	userId: uuid("user_id"),
},
(table) => {
	return {
		quizzesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "quizzes_user_id_users_id_fk"
		}),
	}
});

export const users = pgTable("users", {
	id: uuid("id").default(sql`auth.uid()`).primaryKey().notNull(),
	email: text("email").notNull(),
	name: varchar("name", { length: 255 }),
	image: text("image"),
	planType: planTypeEnum("plan_type").default('free').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isVerified: boolean("is_verified").default(false),
});