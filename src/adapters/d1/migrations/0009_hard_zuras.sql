CREATE TABLE `packaging_options` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`photo_key` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_medias` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`image_key` text,
	`video_id` text,
	`video_custom_thumbnail_key` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_packaging_options` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`packaging_option_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`packaging_option_id`) REFERENCES `packaging_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_specifications` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`spec_photo_key` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` integer NOT NULL,
	`variant_name` text NOT NULL,
	`variant_photo_key` text NOT NULL,
	`variant_sizes` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`en_name` text NOT NULL,
	`ar_name` text NOT NULL,
	`en_description` text NOT NULL,
	`ar_description` text NOT NULL,
	`moq` integer NOT NULL,
	`production_capacity` text NOT NULL,
	`payment_terms` text NOT NULL,
	`shipment_terms` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
