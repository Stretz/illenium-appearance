CREATE TABLE IF NOT EXISTS `appearance_stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL,
  `job` varchar(64) DEFAULT NULL,
  `gang` varchar(64) DEFAULT NULL,
  `use_poly` tinyint(1) NOT NULL DEFAULT '0',
  `show_blip` tinyint(1) DEFAULT NULL,
  `coords` longtext NOT NULL,
  `size` longtext DEFAULT NULL,
  `rotation` float DEFAULT '0',
  `points` longtext DEFAULT NULL,
  `target_model` varchar(128) DEFAULT NULL,
  `target_scenario` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
