-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 11, 2024 at 05:49 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `connecto`
--
CREATE DATABASE IF NOT EXISTS `connecto` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `connecto`;

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE `links` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `link_title` varchar(255) NOT NULL,
  `link_url` text NOT NULL,
  `link_img` text,
  `link_order` int(11) DEFAULT NULL,
  `link_hide` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `signin_log`
--

CREATE TABLE `signin_log` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `verify` int(6) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `add_date` datetime NOT NULL,
  `expired` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` bigint(20) NOT NULL,
  `user` int(11) NOT NULL,
  `token` varchar(32) NOT NULL,
  `add_date` datetime NOT NULL,
  `expired` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `page_bg` text,
  `page_settings` text,
  `user_image` text,
  `active` int(1) NOT NULL DEFAULT '1',
  `add_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `phone`, `page_bg`, `page_settings`, `user_image`, `active`, `add_date`) VALUES
(1, 'test', 'test', '12345678900', NULL, '{\"linkBorder\":\"#000000\",\"linkBG\":\"#fbef4f\",\"linkText\":\"#000000\",\"linkBorderHover\":\"#f1ec53\",\"linkBGHover\":\"#000000\",\"linkTextHover\":\"#f4f352\",\"bg\":\"#fdfdf9\",\"userTitleColor\":\"#150e07\",\"userTitleBG\":\"#fbef4f\"}', NULL, 1, '2024-09-11 14:04:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `signin_log`
--
ALTER TABLE `signin_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `signin_log`
--
ALTER TABLE `signin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
