CREATE TABLE `portfolio_content` (`id` text PRIMARY KEY NOT NULL, `data` text NOT NULL, `updated_at` integer NOT NULL, `version` integer DEFAULT 1 NOT NULL);
--> statement-breakpoint
CREATE TABLE `admin_login_attempts` (`id` text PRIMARY KEY NOT NULL, `ip_hash` text NOT NULL, `created_at` integer NOT NULL);
--> statement-breakpoint
CREATE INDEX `admin_login_attempt_idx` ON `admin_login_attempts` (`ip_hash`,`created_at`);
--> statement-breakpoint
CREATE TABLE `admin_audit` (`id` text PRIMARY KEY NOT NULL, `action` text NOT NULL, `detail` text NOT NULL, `created_at` integer NOT NULL);
--> statement-breakpoint
CREATE INDEX `admin_audit_time_idx` ON `admin_audit` (`created_at`);
