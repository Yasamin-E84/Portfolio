CREATE TABLE `analytics_sessions` (
  `session_id` text PRIMARY KEY NOT NULL,
  `visitor_hash` text NOT NULL,
  `country` text NOT NULL,
  `region` text NOT NULL,
  `city` text NOT NULL,
  `first_seen` integer NOT NULL,
  `last_seen` integer NOT NULL,
  `page_views` integer DEFAULT 0 NOT NULL,
  `event_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_sessions_last_seen_idx` ON `analytics_sessions` (`last_seen`);
--> statement-breakpoint
CREATE INDEX `analytics_sessions_visitor_idx` ON `analytics_sessions` (`visitor_hash`,`last_seen`);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
  `id` text PRIMARY KEY NOT NULL,
  `session_id` text NOT NULL,
  `event_type` text NOT NULL,
  `path` text NOT NULL,
  `target` text NOT NULL,
  `locale` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_events_session_idx` ON `analytics_events` (`session_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `analytics_events_time_idx` ON `analytics_events` (`created_at`);
