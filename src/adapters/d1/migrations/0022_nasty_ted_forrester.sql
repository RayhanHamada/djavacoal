-- Step 1: Add slug column as nullable initially
ALTER TABLE `products` ADD `slug` text;--> statement-breakpoint
-- Step 2: Populate slug for existing products using English name (lowercase, dash-separated)
UPDATE `products` SET `slug` = LOWER(REPLACE(`en_name`, ' ', '-')) WHERE `slug` IS NULL;--> statement-breakpoint
-- Step 3: Create unique index on slug
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);