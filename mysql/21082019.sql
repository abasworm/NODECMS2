-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table dms.c_menu
CREATE TABLE IF NOT EXISTS `c_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu` varchar(100) NOT NULL,
  `link` varchar(100) NOT NULL,
  `menu_group_id` int(11) NOT NULL,
  `desc` varchar(100) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table dms.c_menu: ~1 rows (approximately)
DELETE FROM `c_menu`;
/*!40000 ALTER TABLE `c_menu` DISABLE KEYS */;
INSERT INTO `c_menu` (`id`, `menu`, `link`, `menu_group_id`, `desc`, `created_date`, `modified_date`) VALUES
	(1, 'User', 'user', 2, 'User Management', '2019-08-21 09:58:44', '2019-08-21 10:00:40');
/*!40000 ALTER TABLE `c_menu` ENABLE KEYS */;

-- Dumping structure for table dms.c_menu_group
CREATE TABLE IF NOT EXISTS `c_menu_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(100) NOT NULL,
  `group_link` varchar(100) NOT NULL,
  `group_desc` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table dms.c_menu_group: ~2 rows (approximately)
DELETE FROM `c_menu_group`;
/*!40000 ALTER TABLE `c_menu_group` DISABLE KEYS */;
INSERT INTO `c_menu_group` (`id`, `group`, `group_link`, `group_desc`, `created_date`, `modified_date`) VALUES
	(1, 'Dashboard', '/', 'Dashboard Utama', '2019-08-21 09:55:48', '2019-08-21 10:00:31'),
	(2, 'Management CMS', '#', 'Management Web', '2019-08-21 10:00:06', '2019-08-21 10:00:06');
/*!40000 ALTER TABLE `c_menu_group` ENABLE KEYS */;

-- Dumping structure for table dms.c_user
CREATE TABLE IF NOT EXISTS `c_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `is_deleted` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table dms.c_user: ~0 rows (approximately)
DELETE FROM `c_user`;
/*!40000 ALTER TABLE `c_user` DISABLE KEYS */;
INSERT INTO `c_user` (`id`, `username`, `password`, `firstname`, `lastname`, `is_deleted`, `created_date`, `modified_date`) VALUES
	(1, 'abasworm', 'abasworm', 'Aris', 'Baskoro', 'N', '2019-08-20 13:33:25', '2019-08-20 13:33:27');
/*!40000 ALTER TABLE `c_user` ENABLE KEYS */;

-- Dumping structure for table dms.c_user_access
CREATE TABLE IF NOT EXISTS `c_user_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `id_user_group` int(11) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table dms.c_user_access: ~0 rows (approximately)
DELETE FROM `c_user_access`;
/*!40000 ALTER TABLE `c_user_access` DISABLE KEYS */;
INSERT INTO `c_user_access` (`id`, `username`, `id_user_group`, `created_date`, `modified_date`) VALUES
	(1, 'abasworm', 1, '2019-08-20 14:03:24', NULL);
/*!40000 ALTER TABLE `c_user_access` ENABLE KEYS */;

-- Dumping structure for table dms.c_user_group
CREATE TABLE IF NOT EXISTS `c_user_group` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_group`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table dms.c_user_group: ~2 rows (approximately)
DELETE FROM `c_user_group`;
/*!40000 ALTER TABLE `c_user_group` DISABLE KEYS */;
INSERT INTO `c_user_group` (`id_group`, `group_name`, `created_date`, `modified_date`) VALUES
	(1, 'Super Administrator', '2019-08-20 13:32:00', '2019-08-20 13:32:36'),
	(2, 'Administrator', '2019-08-20 13:32:20', NULL);
/*!40000 ALTER TABLE `c_user_group` ENABLE KEYS */;

-- Dumping structure for table dms.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table dms.sessions: ~0 rows (approximately)
DELETE FROM `sessions`;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

-- Dumping structure for view dms.v_user_detail
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_user_detail` (
	`username` VARCHAR(30) NOT NULL COLLATE 'latin1_swedish_ci',
	`firstname` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`lastname` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`group_name` VARCHAR(100) NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Dumping structure for view dms.v_user_detail
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_user_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_detail` AS SELECT 
	u.username,
	u.firstname,
	u.lastname,
	ug.group_name
FROM c_user AS u
LEFT JOIN c_user_access AS ua ON u.username = ua.username
LEFT JOIN c_user_group AS ug ON ug.id_group = ua.id_user_group ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
