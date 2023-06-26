CREATE DATABASE durhack2023Megateams;

USE durhack2023Megateams;

CREATE TABLE `megateams` (
    `megateam_id` int NOT NULL AUTO_INCREMENT,
    `megateam_name` varchar(255) NOT NULL,
    `megateam_description` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`megateam_id`)
);

CREATE TABLE `areas` (
    `area_id` int NOT NULL AUTO_INCREMENT,
    `area_name` varchar(255) NOT NULL,
    `area_room` varchar(10) NOT NULL,
    `megateam_id` int NOT NULL,
    PRIMARY KEY (`area_id`),
    FOREIGN KEY (`megateam_id`) REFERENCES `megateams`(`megateam_id`)
);

CREATE TABLE `teams` (
    `team_id` int NOT NULL AUTO_INCREMENT,
    `team_name` varchar(255) NOT NULL,
    `area_id` int DEFAULT NULL,
    `team_join_code` varchar(5) DEFAULT NULL,
    PRIMARY KEY (`team_id`),
    FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`)
);

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `team_id` int DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `discord_id` varchar(255) DEFAULT NULL,
  `discord_name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `preferred_name` varchar(255) NOT NULL,
  `role` ENUM('hacker', 'sponsor', 'volunteer', 'admin') NOT NULL DEFAULT 'hacker',
  `verify_code` varchar(255) DEFAULT NULL,
  `verify_sent_at` datetime DEFAULT NULL,
  `initially_logged_in_at` datetime DEFAULT NULL,
  `last_logged_in_at` datetime DEFAULT NULL,
  `age` int DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL,
  `graduation_year` varchar(4) DEFAULT NULL,
  `ethnicity` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `h_UK_Marketing` tinyint(1) DEFAULT NULL,
  `h_UK_Consent` tinyint(1) DEFAULT NULL,
  `checked_in` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`)
);

CREATE TABLE `qrcodes` (
    `qrcode_id` int NOT NULL AUTO_INCREMENT,
    `qrcode_name` varchar(255) NOT NULL,
    `qrcode_description` varchar(255) DEFAULT '',
    `qrcode_payload` varchar(255) NOT NULL,
    `qrcode_points_value` int NOT NULL,
    `qrcode_use_limit` int NOT NULL,
    `state` tinyint(1) DEFAULT '1',
    `qrcode_start_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `qrcode_expiry_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `qrcode_creator_user_id` int NOT NULL,
    PRIMARY KEY (`qrcode_id`),
    FOREIGN KEY (`qrcode_creator_user_id`) REFERENCES `users`(`user_id`)
);

CREATE TABLE `points` (
    `point_id` int NOT NULL AUTO_INCREMENT,
    `points_added` int NOT NULL,
    `manual_entry_admin_user_id` int DEFAULT NULL,
    `qrcode_id` int DEFAULT NULL,
    `redeemer_user_id` int NOT NULL,
    PRIMARY KEY (`point_id`),
    FOREIGN KEY (`manual_entry_admin_user_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`redeemer_user_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`qrcode_id`) REFERENCES `qrcodes`(`qrcode_id`)
);
