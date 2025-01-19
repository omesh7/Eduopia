DO $$ BEGIN
 CREATE TYPE "public"."plan_type" AS ENUM('FREE', 'PREMIUM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "plan_type" DEFAULT 'FREE' NOT NULL;