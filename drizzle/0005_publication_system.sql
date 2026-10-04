CREATE TABLE `publications` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `type` text NOT NULL,
  `status` text NOT NULL,
  `category` text NOT NULL,
  `featured` integer DEFAULT 0 NOT NULL,
  `publish_at` integer,
  `data` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `publications_status_publish_idx` ON `publications` (`status`,`publish_at`);
--> statement-breakpoint
CREATE INDEX `publications_type_updated_idx` ON `publications` (`type`,`updated_at`);
--> statement-breakpoint
CREATE TABLE `automation_runs` (
  `id` text PRIMARY KEY NOT NULL,
  `workflow` text NOT NULL,
  `status` text NOT NULL,
  `generated_count` integer DEFAULT 0 NOT NULL,
  `detail` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `automation_runs_created_idx` ON `automation_runs` (`created_at`);
--> statement-breakpoint
CREATE TABLE `publication_tombstones` (
  `id` text PRIMARY KEY NOT NULL,
  `deleted_at` integer NOT NULL
);
