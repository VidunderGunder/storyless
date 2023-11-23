ALTER TABLE `feasy-t3-drizzle_toggle` ADD `createdById` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `feasy-t3-drizzle_toggle` ADD `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `feasy-t3-drizzle_toggle` ADD `updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `feasy-t3-drizzle_toggle` (`createdById`);