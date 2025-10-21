PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_news` (
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`image_key` text,
	`metadata_title` text NOT NULL,
	`metadata_description` text NOT NULL,
	`metadata_tag_list` text DEFAULT '[]' NOT NULL,
	`ar_title` text NOT NULL,
	`ar_content_key` text NOT NULL,
	`en_title` text NOT NULL,
	`en_content_key` text NOT NULL,
	`is_published` integer NOT NULL,
	`published_at` integer,
	`published_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_news`("created_by", "updated_by", "created_at", "updated_at", "id", "slug", "image_key", "metadata_title", "metadata_description", "metadata_tag_list", "ar_title", "ar_content_key", "en_title", "en_content_key", "is_published", "published_at", "published_by") SELECT "created_by", "updated_by", "created_at", "updated_at", "id", "slug", "image_key", "metadata_title", "metadata_description", "metadata_tag_list", "ar_title", "ar_content_key", "en_title", "en_content_key", "is_published", "published_at", "published_by" FROM `news`;--> statement-breakpoint
DROP TABLE `news`;--> statement-breakpoint
ALTER TABLE `__new_news` RENAME TO `news`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `news_slug_unique` ON `news` (`slug`);