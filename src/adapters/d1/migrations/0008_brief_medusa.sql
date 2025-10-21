-- Migration: Fix news publication status
-- Replace is_published boolean with status enum (draft, published, unpublished)

-- Step 1: Add new status column with default value
ALTER TABLE `news` ADD `status` text NOT NULL DEFAULT 'draft';--> statement-breakpoint

-- Step 2: Migrate existing data
-- If is_published is true (1), set status to 'published', otherwise 'draft'
UPDATE `news` SET `status` = CASE 
    WHEN `is_published` = 1 THEN 'published'
    ELSE 'draft'
END;--> statement-breakpoint

-- Step 3: Drop old is_published column
ALTER TABLE `news` DROP COLUMN `is_published`;