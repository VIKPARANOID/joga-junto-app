CREATE TABLE `athleteRankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`athleteId` int NOT NULL,
	`overallScore` int,
	`speedScore` int,
	`dribblingScore` int,
	`accuracyScore` int,
	`totalVideos` int NOT NULL DEFAULT 0,
	`avgIntensity` int,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `athleteRankings_id` PRIMARY KEY(`id`),
	CONSTRAINT `athleteRankings_athleteId_unique` UNIQUE(`athleteId`)
);
--> statement-breakpoint
CREATE TABLE `athletes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dateOfBirth` varchar(10),
	`heightCm` int,
	`weightKg` int,
	`position` varchar(50),
	`preferredFoot` enum('left','right','both'),
	`clubName` varchar(255),
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `athletes_id` PRIMARY KEY(`id`),
	CONSTRAINT `athletes_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `clubFollows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clubId` int NOT NULL,
	`athleteId` int NOT NULL,
	`followedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clubFollows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clubName` varchar(255) NOT NULL,
	`city` varchar(255),
	`state` varchar(2),
	`description` text,
	`logoUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clubs_id` PRIMARY KEY(`id`),
	CONSTRAINT `clubs_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `kpis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`athleteId` int NOT NULL,
	`avgSpeedKmh` int,
	`maxSpeedKmh` int,
	`ballTouches` int,
	`passesAttempted` int,
	`passesCompleted` int,
	`passAccuracyPercent` int,
	`sprintsCount` int,
	`avgAcceleration` int,
	`distanceCoveredM` int,
	`intensityScore` int,
	`skeletonLandmarks` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kpis_id` PRIMARY KEY(`id`),
	CONSTRAINT `kpis_videoId_unique` UNIQUE(`videoId`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`athleteId` int NOT NULL,
	`fileUrl` varchar(255) NOT NULL,
	`fileSizeMb` int,
	`durationSeconds` int,
	`uploadDate` timestamp NOT NULL DEFAULT (now()),
	`processingStatus` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`processingError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
