-- DropForeignKey
ALTER TABLE `Point` DROP FOREIGN KEY `Points_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Point` DROP FOREIGN KEY `Points_ibfk_2`;

-- DropForeignKey
ALTER TABLE `QRCode` DROP FOREIGN KEY `QRCodes_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Teams_ibfk_1`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `Users_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `FK_Point_QRCode` FOREIGN KEY (`origin_qrcode_id`) REFERENCES `QRCode`(`qrcode_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `FK_Point_User` FOREIGN KEY (`redeemer_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `FK_QRCode_User` FOREIGN KEY (`creator_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `FK_Team_Area` FOREIGN KEY (`area_id`) REFERENCES `Area`(`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `FK_User_Team` FOREIGN KEY (`team_id`) REFERENCES `Team`(`team_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Point` RENAME INDEX `origin_qrcode_id` TO `IDX_Point_origin_qrcode_id`;

-- RenameIndex
ALTER TABLE `Point` RENAME INDEX `redeemer_id` TO `IDX_Point_redeemer_id`;

-- RenameIndex
ALTER TABLE `QRCode` RENAME INDEX `challenge_rank` TO `UQ_QRCode_challenge_rank`;

-- RenameIndex
ALTER TABLE `QRCode` RENAME INDEX `creator_id` TO `IDX_QRCode_creator_id`;

-- RenameIndex
ALTER TABLE `Team` RENAME INDEX `area_id` TO `IDX_Team_area_id`;

-- RenameIndex
ALTER TABLE `Team` RENAME INDEX `join_code` TO `UQ_Team_join_code`;

-- RenameIndex
ALTER TABLE `Team` RENAME INDEX `team_name` TO `UQ_Team_team_name`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `email` TO `UQ_User_email`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `team_id` TO `IDX_User_team_id`;
