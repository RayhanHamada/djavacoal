PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`en_name` text NOT NULL,
	`ar_name` text NOT NULL,
	`en_description` text NOT NULL,
	`ar_description` text NOT NULL,
	`moq` text NOT NULL,
	`production_capacity` text NOT NULL,
	`is_hidden` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_products`("created_by", "updated_by", "created_at", "updated_at", "id", "en_name", "ar_name", "en_description", "ar_description", "moq", "production_capacity", "is_hidden", "order_index") SELECT "created_by", "updated_by", "created_at", "updated_at", "id", "en_name", "ar_name", "en_description", "ar_description", "moq", "production_capacity", "is_hidden", "order_index" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `product_medias` ADD `order_index` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `product_specifications` ADD `order_index` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `product_variants` ADD `en_description` text;--> statement-breakpoint
ALTER TABLE `product_variants` ADD `ar_description` text;--> statement-breakpoint
ALTER TABLE `product_variants` ADD `order_index` integer DEFAULT 0 NOT NULL;