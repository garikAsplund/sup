CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`gmail_id` text NOT NULL,
	`user_id` text,
	`bucket` text DEFAULT 'inbox',
	`subject` text,
	`sender` text,
	`is_read` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`created_at` integer
);
