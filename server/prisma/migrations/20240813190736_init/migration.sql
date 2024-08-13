-- CreateTable
CREATE TABLE `Area` (
    `area_id` INTEGER NOT NULL AUTO_INCREMENT,
    `megateam_id` INTEGER NOT NULL,
    `area_name` VARCHAR(255) NOT NULL,
    `area_location` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `megateam_id`(`megateam_id`),
    PRIMARY KEY (`area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Megateam` (
    `megateam_id` INTEGER NOT NULL AUTO_INCREMENT,
    `megateam_name` VARCHAR(255) NOT NULL,
    `megateam_description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`megateam_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Point` (
    `point_id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` INTEGER NOT NULL,
    `origin_qrcode_id` INTEGER NULL,
    `redeemer_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `origin_qrcode_id`(`origin_qrcode_id`),
    INDEX `redeemer_id`(`redeemer_id`),
    PRIMARY KEY (`point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QRCode` (
    `qrcode_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `category` ENUM('workshop', 'sponsor', 'challenge', 'preset') NOT NULL DEFAULT 'workshop',
    `payload` VARCHAR(255) NOT NULL,
    `points_value` INTEGER NOT NULL,
    `max_uses` INTEGER NULL,
    `state` BOOLEAN NOT NULL,
    `start_time` DATETIME(0) NOT NULL,
    `expiry_time` DATETIME(0) NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `challenge_rank` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `challenge_rank`(`challenge_rank`),
    INDEX `creator_id`(`creator_id`),
    PRIMARY KEY (`qrcode_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `team_id` INTEGER NOT NULL AUTO_INCREMENT,
    `join_code` INTEGER NOT NULL,
    `discord_channel_id` VARCHAR(255) NULL,
    `team_name` VARCHAR(255) NOT NULL,
    `area_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `join_code`(`join_code`),
    UNIQUE INDEX `team_name`(`team_name`),
    INDEX `area_id`(`area_id`),
    PRIMARY KEY (`team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `preferred_name` VARCHAR(255) NOT NULL,
    `role` ENUM('hacker', 'sponsor', 'volunteer', 'admin') NOT NULL DEFAULT 'hacker',
    `initially_logged_in_at` DATETIME(0) NULL,
    `last_logged_in_at` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `team_id`(`team_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Areas_ibfk_1` FOREIGN KEY (`megateam_id`) REFERENCES `Megateam`(`megateam_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Points_ibfk_1` FOREIGN KEY (`origin_qrcode_id`) REFERENCES `QRCode`(`qrcode_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Points_ibfk_2` FOREIGN KEY (`redeemer_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `QRCodes_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Teams_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `Area`(`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `Team`(`team_id`) ON DELETE SET NULL ON UPDATE CASCADE;
