CREATE TABLE `portfolio_media` (
  `key` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `content_type` text NOT NULL,
  `size` integer NOT NULL,
  `bytes` blob NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `portfolio_media_created_idx` ON `portfolio_media` (`created_at`);
