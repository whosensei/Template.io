CREATE TABLE "email_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"template_id" uuid,
	"gmail_connection_id" uuid,
	"to" json NOT NULL,
	"cc" json DEFAULT '[]'::json,
	"bcc" json DEFAULT '[]'::json,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL,
	"message_id" text,
	"error_message" text,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gmail_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token" text,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_history" ADD CONSTRAINT "email_history_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_history" ADD CONSTRAINT "email_history_gmail_connection_id_gmail_connections_id_fk" FOREIGN KEY ("gmail_connection_id") REFERENCES "public"."gmail_connections"("id") ON DELETE no action ON UPDATE no action;