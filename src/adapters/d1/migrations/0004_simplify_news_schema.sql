DROP TABLE `news_contents`;--> statement-breakpoint
DROP TABLE `news_metadatas`;--> statement-breakpoint
DROP TABLE `news_titles`;--> statement-breakpoint
ALTER TABLE `news` ADD `metadata_title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `metadata_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `metadata_tag_list` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `news` ADD `ar_title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `ar_content_key` text NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `en_title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `en_content_key` text NOT NULL;