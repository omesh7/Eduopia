DO $$ BEGIN
 CREATE TYPE "public"."quizz_type" AS ENUM('SELECT', 'ASSIST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "quiz_type" "quizz_type" DEFAULT 'SELECT' NOT NULL;