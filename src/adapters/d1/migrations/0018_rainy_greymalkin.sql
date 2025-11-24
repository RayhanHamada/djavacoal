CREATE TABLE `faqs` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`en_question` text NOT NULL,
	`ar_question` text NOT NULL,
	`en_answer` text NOT NULL,
	`ar_answer` text NOT NULL,
	`order_index` integer NOT NULL
);
