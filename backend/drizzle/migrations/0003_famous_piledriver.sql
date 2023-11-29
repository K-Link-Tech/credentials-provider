DO $$ BEGIN
 CREATE TYPE "scopes" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "scope" "scopes" NOT NULL;