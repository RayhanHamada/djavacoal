CREATE TABLE `team_members` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`photo_key` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL
);
