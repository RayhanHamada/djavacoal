-- Migration: Add gallery_photos table for storing photo metadata
-- Actual photos are stored in Cloudflare R2

CREATE TABLE `gallery_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_photos_name_unique` ON `gallery_photos` (`name`);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_photos_key_unique` ON `gallery_photos` (`key`);
