CREATE TABLE `feasy-t3-drizzle_post` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`createdById` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feasy-t3-drizzle_post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feasy-t3-drizzle_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `feasy-t3-drizzle_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `feasy-t3-drizzle_toggle` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	CONSTRAINT `feasy-t3-drizzle_toggle_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feasy-t3-drizzle_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	CONSTRAINT `feasy-t3-drizzle_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feasy-t3-drizzle_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `feasy-t3-drizzle_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `feasy-t3-drizzle_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `feasy-t3-drizzle_post` (`name`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `feasy-t3-drizzle_session` (`userId`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `feasy-t3-drizzle_toggle` (`name`);