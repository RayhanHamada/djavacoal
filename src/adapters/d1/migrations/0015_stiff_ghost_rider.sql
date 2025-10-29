CREATE TABLE `page_metadatas` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`metadata_title` text NOT NULL,
	`metadata_description` text NOT NULL,
	`metadata_keywords` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_metadatas_path_unique` ON `page_metadatas` (`path`);