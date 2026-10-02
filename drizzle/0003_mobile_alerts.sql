CREATE TABLE `admin_mobile_tokens` (
  `id` text PRIMARY KEY NOT NULL,
  `token_hash` text NOT NULL UNIQUE,
  `device_name` text NOT NULL,
  `created_at` integer NOT NULL,
  `last_seen` integer NOT NULL,
  `expires_at` integer NOT NULL,
  `revoked_at` integer
);
--> statement-breakpoint
CREATE INDEX `admin_mobile_tokens_expiry_idx` ON `admin_mobile_tokens` (`expires_at`,`revoked_at`);
