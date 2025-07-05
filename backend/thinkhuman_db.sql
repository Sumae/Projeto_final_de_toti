-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: thinkhuman_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.7-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beneficiariohelptypes`
--

DROP TABLE IF EXISTS `beneficiariohelptypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiariohelptypes` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `beneficiario_id` int(11) NOT NULL,
  `help_type_id` int(11) NOT NULL,
  PRIMARY KEY (`beneficiario_id`,`help_type_id`),
  KEY `help_type_id` (`help_type_id`),
  CONSTRAINT `beneficiariohelptypes_ibfk_1` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `beneficiariohelptypes_ibfk_2` FOREIGN KEY (`help_type_id`) REFERENCES `help_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiariohelptypes`
--

LOCK TABLES `beneficiariohelptypes` WRITE;
/*!40000 ALTER TABLE `beneficiariohelptypes` DISABLE KEYS */;
INSERT INTO `beneficiariohelptypes` VALUES ('2025-06-29 04:19:11','2025-06-29 04:19:11',1,8),('2025-06-29 20:19:15','2025-06-29 20:19:15',2,9);
/*!40000 ALTER TABLE `beneficiariohelptypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beneficiarios`
--

DROP TABLE IF EXISTS `beneficiarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `idade` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `situacao_social` varchar(255) NOT NULL,
  `registered_by_user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `registered_by_user_id` (`registered_by_user_id`),
  CONSTRAINT `beneficiarios_ibfk_1` FOREIGN KEY (`registered_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiarios`
--

LOCK TABLES `beneficiarios` WRITE;
/*!40000 ALTER TABLE `beneficiarios` DISABLE KEYS */;
INSERT INTO `beneficiarios` VALUES (1,'Safi Bobo',18,'safi@gmail.com','22985410805','Vulnerabilidade Média',NULL,'2025-06-29 04:19:11','2025-06-29 04:19:11'),(2,'Iama Embalo',15,'iama@gmail.com','85985410999','Vulnerabilidade Média',NULL,'2025-06-29 20:19:15','2025-06-29 20:19:15');
/*!40000 ALTER TABLE `beneficiarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help_types`
--

DROP TABLE IF EXISTS `help_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `help_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help_types`
--

LOCK TABLES `help_types` WRITE;
/*!40000 ALTER TABLE `help_types` DISABLE KEYS */;
INSERT INTO `help_types` VALUES (1,'Educação','2025-06-29 03:49:44','2025-06-29 03:49:44'),(2,'Saúde','2025-06-29 03:49:44','2025-06-29 03:49:44'),(3,'Moradia','2025-06-29 03:49:44','2025-06-29 03:49:44'),(4,'Alimentação','2025-06-29 03:49:44','2025-06-29 03:49:44'),(5,'Outro','2025-06-29 03:49:44','2025-06-29 03:49:44'),(6,'Cesta básica','2025-06-29 03:49:44','2025-06-29 03:49:44'),(7,'Acompanhamento psicológico','2025-06-29 03:49:44','2025-06-29 03:49:44'),(8,'Treinamento profissionalizante','2025-06-29 03:49:44','2025-06-29 03:49:44'),(9,'Suporte educacional','2025-06-29 03:49:44','2025-06-29 03:49:44');
/*!40000 ALTER TABLE `help_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sumaetenem@outlook.com','$2a$10$ymuWJVlYrtGDe9foPBVKWuvEUY6fkXBydk7uYFSK2q6I0WoXgtuHG','Baba safi',20,'2025-06-29 03:58:07','2025-06-29 03:58:07'),(2,'sumaeamaduembalo@gmail.com','$2a$10$XOvPvXnu2aw2tklBlbHUt.5QnhpdD2QfiBPV600UX0lkWukDNLZwG','Sumae Embalo',30,'2025-06-30 18:37:29','2025-06-30 18:37:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 22:06:24
