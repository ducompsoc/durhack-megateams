-- DropForeignKey
ALTER TABLE `Area` DROP FOREIGN KEY `Areas_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `FK_Area_Megateam` FOREIGN KEY (`megateam_id`) REFERENCES `Megateam`(`megateam_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Area` RENAME INDEX `megateam_id` TO `IDX_Area_megateam_id`;
