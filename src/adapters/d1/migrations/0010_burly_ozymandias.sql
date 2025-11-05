ALTER TABLE `packaging_options` RENAME COLUMN "type" TO "en_name";--> statement-breakpoint
ALTER TABLE `product_variants` RENAME COLUMN "variant_name" TO "en_variant_name";--> statement-breakpoint
ALTER TABLE `packaging_options` ADD `ar_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `packaging_options` ADD `en_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `packaging_options` ADD `ar_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `packaging_options` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `product_variants` ADD `ar_variant_name` text NOT NULL;