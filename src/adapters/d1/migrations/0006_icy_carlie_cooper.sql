PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`id_token` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "user_id", "account_id", "provider_id", "access_token", "refresh_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "id_token", "password", "created_at", "updated_at") SELECT "id", "user_id", "account_id", "provider_id", "access_token", "refresh_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "id_token", "password", "created_at", "updated_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_gallery_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_gallery_photos`("id", "name", "key", "size", "mime_type", "created_at", "updated_at") SELECT "id", "name", "key", "size", "mime_type", "created_at", "updated_at" FROM `gallery_photos`;--> statement-breakpoint
DROP TABLE `gallery_photos`;--> statement-breakpoint
ALTER TABLE `__new_gallery_photos` RENAME TO `gallery_photos`;--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_photos_name_unique` ON `gallery_photos` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_photos_key_unique` ON `gallery_photos` (`key`);--> statement-breakpoint
CREATE TABLE `__new_news` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`image_key` text,
	`metadata_title` text NOT NULL,
	`metadata_description` text NOT NULL,
	`metadata_tag_list` text DEFAULT '[]',
	`ar_title` text NOT NULL,
	`ar_content_key` text NOT NULL,
	`en_title` text NOT NULL,
	`en_content_key` text NOT NULL,
	`is_published` integer DEFAULT false,
	`published_at` integer,
	`published_by` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_news`("id", "slug", "image_key", "metadata_title", "metadata_description", "metadata_tag_list", "ar_title", "ar_content_key", "en_title", "en_content_key", "is_published", "published_at", "published_by", "created_by", "updated_by", "created_at", "updated_at") SELECT "id", "slug", "image_key", "metadata_title", "metadata_description", "metadata_tag_list", "ar_title", "ar_content_key", "en_title", "en_content_key", "is_published", "published_at", "published_by", "created_by", "updated_by", "created_at", "updated_at" FROM `news`;--> statement-breakpoint
DROP TABLE `news`;--> statement-breakpoint
ALTER TABLE `__new_news` RENAME TO `news`;--> statement-breakpoint
CREATE UNIQUE INDEX `news_slug_unique` ON `news` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`impersonated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "token", "expires_at", "ip_address", "user_agent", "impersonated_by", "created_at", "updated_at") SELECT "id", "user_id", "token", "expires_at", "ip_address", "user_agent", "impersonated_by", "created_at", "updated_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "slug", "created_at", "updated_at") SELECT "id", "name", "slug", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false,
	`image` text,
	`role` text DEFAULT 'admin',
	`banned` integer DEFAULT false,
	`ban_reason` text,
	`ban_expires` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "email_verified", "image", "role", "banned", "ban_reason", "ban_expires", "created_at", "updated_at") SELECT "id", "name", "email", "email_verified", "image", "role", "banned", "ban_reason", "ban_expires", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_verifications`("id", "identifier", "value", "expires_at", "created_at", "updated_at") SELECT "id", "identifier", "value", "expires_at", "created_at", "updated_at" FROM `verifications`;--> statement-breakpoint
DROP TABLE `verifications`;--> statement-breakpoint
ALTER TABLE `__new_verifications` RENAME TO `verifications`;