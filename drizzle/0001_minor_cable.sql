CREATE TABLE `senders` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`user_id` text,
	`is_approved` integer DEFAULT false,
	`first_seen` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `emails` ADD `snippet` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `created_at` integer;