CREATE TABLE `analytics_daily` (
	`day` text NOT NULL,
	`path` text NOT NULL,
	`locale` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`minute_start` integer NOT NULL,
	`minute_views` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `path`, `locale`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`locale` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_created_idx` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `contact_rate_events` (
	`id` text PRIMARY KEY NOT NULL,
	`rate_key` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_rate_key_time_idx` ON `contact_rate_events` (`rate_key`,`created_at`);--> statement-breakpoint
CREATE INDEX `contact_rate_time_idx` ON `contact_rate_events` (`created_at`);