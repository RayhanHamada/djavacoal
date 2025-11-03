PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_variants` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`en_variant_name` text NOT NULL,
	`ar_variant_name` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`variant_photo_key` text NOT NULL,
	`variant_sizes` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_variants`("created_at", "updated_at", "id", "product_id", "en_variant_name", "ar_variant_name", "tags", "variant_photo_key", "variant_sizes", "order_index") SELECT "created_at", "updated_at", "id", "product_id", "en_variant_name", "ar_variant_name", '[]', "variant_photo_key", "variant_sizes", "order_index" FROM `product_variants`;--> statement-breakpoint
DROP TABLE `product_variants`;--> statement-breakpoint
ALTER TABLE `__new_product_variants` RENAME TO `product_variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;