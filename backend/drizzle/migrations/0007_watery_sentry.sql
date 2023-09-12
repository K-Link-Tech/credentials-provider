DO $$ BEGIN
 CREATE TYPE "encryptionAlgo" AS ENUM('aes', 'rsa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"key" text NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" time with time zone DEFAULT now() NOT NULL,
	"updated_at" time with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "environments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "env_key_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"encryptionAlgo" "encryptionAlgo" NOT NULL,
	"environment_id" uuid NOT NULL,
	"created_at" time with time zone DEFAULT now() NOT NULL,
	"updated_at" time with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_at" time with time zone DEFAULT now() NOT NULL,
	"updated_at" time with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_name_unique" UNIQUE("name")
);
