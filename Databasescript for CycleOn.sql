-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 11. Apr, 2019 18:15 PM
-- Tjener-versjon: 5.7.25-0ubuntu0.18.04.2
-- PHP Version: 7.2.15-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `g_idri1005_22`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Account`
--

CREATE TABLE `Account` (
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `user_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Account`
--

INSERT INTO `Account` (`username`, `password`, `user_id`) VALUES
('Andre006', '1234', 6),
('JanIvar008', '1234', 8),
('Jonas002', '1234', 2),
('Karl003', '1234', 3),
('Kate007', '1234', 7),
('Kirsti005', '1234', 5),
('Linda004', '1234', 4),
('Peter001', '1234', 1);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Address`
--

CREATE TABLE `Address` (
  `id` int(11) NOT NULL,
  `postalNum` char(4) NOT NULL,
  `place` varchar(30) NOT NULL,
  `streetAddress` varchar(40) DEFAULT NULL,
  `streetNum` char(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Address`
--

INSERT INTO `Address` (`id`, `postalNum`, `place`, `streetAddress`, `streetNum`) VALUES
(1, '2058', 'Voss', 'Karlsgaten', '23'),
(2, '2020', 'Fauske', 'Helikopterveien', '29'),
(3, '2003', 'Oslo', 'Munkegata', '45'),
(4, '2900', 'Lillestrøm', 'Karlsgaten', '7B'),
(5, '8480', 'Andenes', 'Storgata', '24'),
(6, '8490', 'Sortland', 'Blåveien', '38A'),
(7, '7069', 'Trondheim', 'Teglverkstunet', '6C'),
(8, '9025', 'Tromsø', 'Marsveien', '45'),
(9, '7033', 'Stjørdal', 'Kontorveien', '9B'),
(10, '2400', 'Jessheim', 'Joheimgaten', '29'),
(14, '7030', 'Trondheim', 'Petersvegen', '34'),
(16, '7000', 'Trondheim', 'Munkegata', '4'),
(17, '7000', 'Trondheim', 'Prinsensgate', '44'),
(20, '8030', 'Sandnes', 'Kong Haralsgate', '29'),
(21, '2000', 'Oslo', 'Biskopveien', '99B'),
(22, '9000', 'Ånes', 'Takkevegen', '21'),
(23, '8792', 'Nordtoten', 'Nordtotenveien', '34'),
(24, '6548', 'Brønnøy', 'Parkveien', '20'),
(25, '7039', 'Trondheim', 'Johansensvei', '2'),
(29, '7054', 'Trondheim', 'Persaunvegen ', '54'),
(30, '4847', 'London', 'Rappalappalapp road', '66'),
(31, '7069', 'Trondheim', 'Teglverkstunet', '6P'),
(32, '7069', 'Trondheim', 'Teglverkstunet', '6R'),
(33, '8480', 'Andenes', 'Merkeveien', '90'),
(34, '7074', 'Trondheim', 'Trondheimsveien', '22'),
(51, '4832', 'Toten', 'Østre-totensgate', '78'),
(52, '7849', 'Toten', 'ØstreTotensgate', '79'),
(53, '6789', 'vhjk', 'vhbjhk', '678');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Administration`
--

CREATE TABLE `Administration` (
  `worker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Administration`
--

INSERT INTO `Administration` (`worker_id`) VALUES
(3),
(8);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Area`
--

CREATE TABLE `Area` (
  `id` int(11) NOT NULL,
  `areaName` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Area`
--

INSERT INTO `Area` (`id`, `areaName`) VALUES
(1, 'Rallarvegen');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Bikes`
--

CREATE TABLE `Bikes` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL,
  `bikeStatus` varchar(40) DEFAULT NULL,
  `bikeNote` text,
  `currentLocation_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Bikes`
--

INSERT INTO `Bikes` (`id`, `location_id`, `type_id`, `bikeStatus`, `bikeNote`, `currentLocation_id`) VALUES
(1, 3, 1, 'Utleid', 'Ingen synlige problemer', 3),
(2, 1, 2, 'Utleid', '', 1),
(3, 2, 1, 'Utleid', '', 2),
(4, 1, 3, 'Trenger reperasjon', NULL, 1),
(5, 4, 4, 'OK', '', NULL),
(6, 4, 4, 'OK', NULL, NULL),
(7, 1, 4, 'OK', NULL, 1),
(8, 1, 2, 'OK', NULL, 1),
(9, 1, 1, 'Må flyttes', '', 1),
(10, 1, 4, 'OK', NULL, 1),
(11, 2, 4, 'OK', NULL, 2),
(12, 1, 4, 'OK', NULL, 1),
(13, 1, 3, 'OK', NULL, 1),
(14, 2, 3, 'OK', NULL, 2),
(15, 3, 3, 'OK', NULL, NULL),
(16, 3, 3, 'OK', NULL, NULL),
(17, 1, 2, 'Trenger service', NULL, 1),
(18, 3, 1, 'Trenger service', NULL, NULL),
(19, 1, 1, 'Til Reperasjon', 'ikke ok', 1),
(20, 3, 1, 'Trenger service', NULL, NULL),
(21, 4, 6, 'OK', NULL, NULL),
(22, 1, 7, 'Må flyttes', 'Har skrape på høyre side, ouch', 1),
(23, 1, 4, 'OK', '', 1),
(24, 5, 6, 'OK', NULL, NULL),
(25, 5, 6, 'Stjålet', '', NULL),
(26, 5, 6, 'OK', NULL, NULL),
(27, 1, 7, 'OK', NULL, 1),
(28, 1, 7, 'OK', NULL, 1),
(29, 1, 7, 'Må Flyttes', 'Må flyttes', 2),
(30, 1, 7, 'OK', NULL, 1),
(31, 1, 7, 'OK', NULL, 1),
(32, 1, 1, 'Må Flyttes', '', 3),
(33, 1, 1, 'OK', NULL, 1),
(35, 1, 1, 'OK', NULL, 1),
(36, 1, 1, 'OK', NULL, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `BikeType`
--

CREATE TABLE `BikeType` (
  `id` int(11) NOT NULL,
  `typeName` varchar(30) NOT NULL,
  `brand` varchar(30) DEFAULT NULL,
  `model` varchar(30) DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  `frameSize` int(3) DEFAULT NULL,
  `wheelSize` int(3) DEFAULT NULL,
  `gears` int(3) DEFAULT NULL,
  `gearSystem` tinytext,
  `brakeSystem` tinytext,
  `weight_kg` float DEFAULT NULL,
  `suitedFor` varchar(10) DEFAULT NULL,
  `price` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `BikeType`
--

INSERT INTO `BikeType` (`id`, `typeName`, `brand`, `model`, `year`, `frameSize`, `wheelSize`, `gears`, `gearSystem`, `brakeSystem`, `weight_kg`, `suitedFor`, `price`) VALUES
(1, 'Terreng', 'Scott', 'fx-1000', 2019, 18, 20, 21, 'Shimano', 'Breakers', 13.6, 'unisex', 500),
(2, 'Landevei', 'White', 'RR Pro Ane 19', 2019, 19, 28, 22, 'Shimano 105', 'Shimano 105', 9.5, 'Dame', 400),
(3, 'Barn', 'Merida', 'Popeye', 2018, 16, 15, 15, 'Shimano Jone', 'Breakers', 7.5, 'unisex', 300),
(4, 'Downhill', 'Cube', 'Hanzz 190 Race MTB', 2019, 18, 28, 10, 'Shimano Deore', 'Magura', 15.4, 'unisex', 600),
(6, 'Terreng', 'Xeed', 'XC 2 Active', 2019, 20, 27, 24, 'Shimano Acera', 'Tektro', 14.5, 'Men', 400),
(7, 'Barn', 'BLPrace', 'Alprace 202', 2017, 20, 20, 6, 'Shimano', 'v-Breaks', 12, 'Unisex', 300);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Customers`
--

CREATE TABLE `Customers` (
  `id` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` tinytext,
  `tlf` char(10) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Customers`
--

INSERT INTO `Customers` (`id`, `firstName`, `lastName`, `email`, `tlf`, `address_id`) VALUES
(1, 'Silje', 'Tanemsmo', 'siljta@stud.ntnu.no', '98067927', 7),
(2, 'Oliver', 'Nilssen', 'oliveren@stud.ntnu.no', '99945623', 29),
(3, 'Kari', 'Nordmann', 'kari@ntnu.no', '91415322', 2),
(4, 'Joakim', 'Tronseth', 'joakiht@stud.ntnu.no', '48476522', 5),
(5, 'David', 'Vos', 'davidvos@stud.ntnu.no', '41425569', 3),
(6, 'Alex', 'Jekic', 'ajec@stud.ntnu.no', '41133872', 6),
(7, 'Olav', 'Nordman', 'nordman@ntnu.no', '99002747', 8),
(8, 'Kirsti', 'Johansen', 'K.Johansen@gmail.com', '48372618', 9),
(9, 'Peter', 'Pan', 'evigung@aldriland.no', '90000000', 5),
(10, 'Harry', 'Potter', 'føniksordenen@galtvort.uk', '42882937', 9),
(17, 'Jasper', 'Olaisen', 'jasperolaisen@ntnu.no', '49392932', 14),
(18, 'Jentoft', 'Karlsen', 'jentost@ntnu.no', '99009900', 10),
(24, 'Marius', 'Nilssen', 'marius.nilssen@gmail.com', '98765432', 33),
(25, 'Hege', 'Tilset', 'hegetilset@hotmail.com', '81549300', 22),
(28, 'Anette', 'Solstad', 'anette@ntnu.no', '99887766', 23),
(29, 'Ingvild', 'Andersen', 'ingvande@stud.ntnu.no', '44556677', 34);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Equipment`
--

CREATE TABLE `Equipment` (
  `id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `objectStatus` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Equipment`
--

INSERT INTO `Equipment` (`id`, `location_id`, `type_id`, `objectStatus`) VALUES
(1, 1, 1, 'OK'),
(2, 1, 1, 'OK'),
(3, 1, 1, 'OK'),
(4, 1, 2, 'OK'),
(5, 2, 2, 'OK'),
(6, 2, 2, 'OK'),
(7, 2, 3, 'OK'),
(8, 1, 3, 'OK'),
(9, 1, 3, 'OK'),
(10, 2, 4, 'OK'),
(11, 3, 4, 'OK'),
(12, 1, 4, 'OK'),
(13, 1, 6, 'OK'),
(14, 4, 6, 'OK'),
(15, 4, 6, 'OK'),
(16, 2, 4, 'OK'),
(17, 1, 4, 'OK'),
(18, 2, 4, 'OK'),
(19, 1, 4, 'OK'),
(20, 1, 4, 'OK'),
(21, 1, 5, 'OK'),
(22, 1, 5, 'OK'),
(25, 1, 7, 'OK'),
(26, 2, 7, 'OK'),
(27, 2, 7, 'OK'),
(28, 2, 7, 'OK'),
(29, 2, 7, 'OK'),
(30, 2, 7, 'OK'),
(31, 2, 7, 'OK'),
(32, 2, 7, 'OK'),
(33, 2, 7, 'OK'),
(34, 2, 7, 'OK'),
(35, 1, 1, 'OK'),
(36, 2, 1, 'OK');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `EquipmentType`
--

CREATE TABLE `EquipmentType` (
  `id` int(11) NOT NULL,
  `typeName` varchar(40) DEFAULT NULL,
  `brand` varchar(40) DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  `comment` tinytext,
  `price` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `EquipmentType`
--

INSERT INTO `EquipmentType` (`id`, `typeName`, `brand`, `year`, `comment`, `price`) VALUES
(1, 'Hjelm', 'Scott', 2019, 'L', 50),
(2, 'Hjelm', 'Ecco', 2019, 'M', 50),
(3, 'Hjelm', 'Scott', 2019, 'S', 50),
(4, 'Sykkelveske', 'Merida', 2017, '5L', 60),
(5, 'Sykkelveske', 'Scott', 2017, '10L', 65),
(6, 'Barnesete', 'Scott', 2017, '1-3 år', 75),
(7, 'Sykkelveske', 'Merida', 2019, '10L', 70);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Locations`
--

CREATE TABLE `Locations` (
  `id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `postalNum` char(4) DEFAULT NULL,
  `place` varchar(30) DEFAULT NULL,
  `streetAddress` varchar(30) DEFAULT NULL,
  `streetNum` char(4) DEFAULT NULL,
  `area_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Locations`
--

INSERT INTO `Locations` (`id`, `name`, `postalNum`, `place`, `streetAddress`, `streetNum`, `area_id`) VALUES
(1, 'Haugastøl', '4043', 'Finse', 'haugavegen', '23', 1),
(2, 'Finse', '4044', 'Finse', 'finsevegen', '12', 1),
(3, 'Flåm', '4033', 'Flåm', 'flåmvegen', '56', 1),
(4, 'Voss', '4332', 'Voss', 'vossevegen', '2', 1),
(5, 'Myrdal', '3450', 'Myrdal', 'myrdalsvegen', '43', 1);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `OrderedBike`
--

CREATE TABLE `OrderedBike` (
  `order_id` int(11) NOT NULL,
  `bike_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `OrderedBike`
--

INSERT INTO `OrderedBike` (`order_id`, `bike_id`) VALUES
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(30, 5),
(6, 6),
(27, 6),
(26, 7),
(28, 10),
(29, 11),
(30, 21),
(26, 23),
(26, 27);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `OrderedEquipment`
--

CREATE TABLE `OrderedEquipment` (
  `equip_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `OrderedEquipment`
--

INSERT INTO `OrderedEquipment` (`equip_id`, `order_id`) VALUES
(1, 2),
(2, 3),
(3, 3),
(1, 4),
(1, 5);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Orders`
--

CREATE TABLE `Orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `dateOrdered` datetime NOT NULL,
  `fromDateTime` datetime NOT NULL,
  `toDateTime` datetime NOT NULL,
  `price` float DEFAULT NULL,
  `soldBy_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Orders`
--

INSERT INTO `Orders` (`id`, `customer_id`, `type_id`, `dateOrdered`, `fromDateTime`, `toDateTime`, `price`, `soldBy_id`) VALUES
(2, 2, 2, '2019-01-05 13:23:44', '2019-01-05 13:23:00', '2019-01-05 16:23:44', 100, 1),
(3, 3, 1, '2019-02-01 13:23:44', '2019-02-02 13:23:44', '2019-02-03 13:23:44', 500, 1),
(4, 4, 2, '2019-02-07 13:23:44', '2019-02-07 15:23:44', '2019-02-07 18:23:44', 150, 1),
(5, 5, 1, '2019-02-08 09:23:44', '2019-02-09 09:23:44', '2019-02-10 09:23:44', 500, 3),
(6, 6, 2, '2019-02-08 09:23:44', '2019-02-08 13:23:44', '2019-02-08 16:23:44', 50, 3),
(26, 10, 1, '2019-04-03 13:41:00', '2019-07-18 13:00:00', '2019-07-21 14:00:00', 4500, 1),
(27, 24, 1, '2019-04-03 13:42:00', '2019-04-03 13:00:00', '2019-04-05 14:00:00', 1500, 1),
(28, 4, 1, '2019-04-03 13:48:00', '2019-04-03 13:00:00', '2019-04-05 14:00:00', 1500, 3),
(29, 9, 1, '2019-04-03 13:49:00', '2019-04-03 13:00:00', '2019-04-05 14:00:00', 1500, 3),
(30, 1, 1, '2019-04-10 16:57:00', '2019-04-10 16:00:00', '2019-04-12 17:00:00', 2500, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `OrderType`
--

CREATE TABLE `OrderType` (
  `id` int(11) NOT NULL,
  `typeName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `OrderType`
--

INSERT INTO `OrderType` (`id`, `typeName`) VALUES
(1, 'Døgnutleie'),
(2, 'Timeutleie');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Restrictions`
--

CREATE TABLE `Restrictions` (
  `id` int(11) NOT NULL,
  `bikeType_id` int(11) NOT NULL,
  `equipmentType_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Restrictions`
--

INSERT INTO `Restrictions` (`id`, `bikeType_id`, `equipmentType_id`) VALUES
(49, 4, 6),
(50, 4, 4);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Sales`
--

CREATE TABLE `Sales` (
  `worker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Sales`
--

INSERT INTO `Sales` (`worker_id`) VALUES
(1),
(6),
(7);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `StorageWorkers`
--

CREATE TABLE `StorageWorkers` (
  `worker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `StorageWorkers`
--

INSERT INTO `StorageWorkers` (`worker_id`) VALUES
(2),
(4),
(5);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Workers`
--

CREATE TABLE `Workers` (
  `worker_id` int(11) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` tinytext,
  `tlf` char(8) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `Workers`
--

INSERT INTO `Workers` (`worker_id`, `firstName`, `lastName`, `email`, `tlf`, `address_id`) VALUES
(1, 'Peter', 'Hansen', 'salg@ntnu.no', '98067925', 7),
(2, 'Jonas', 'Strøm', 'lager@ntnu.no', '98067927', 8),
(3, 'Karl', 'Pettersen', 'admin@ntnu.no', '98067927', 9),
(4, 'Linda', 'Karlsen', 'linda@utleiesykle.no', '94302018', 17),
(5, 'Kirsti', 'Pettersen', 'kristiPPP@gmail.com', '49932019', 29),
(6, 'Andre', 'Nordman', 'adresen@nordlys.no', '40392929', 4),
(7, 'Kate', 'Sheals', 'katesheals@ntnu.no', '40392929', 21),
(8, 'Jan-Ivar', 'Tanemsmo', 'pappaTilSilje@gmail.com', '49030020', 24);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`username`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Address`
--
ALTER TABLE `Address`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Administration`
--
ALTER TABLE `Administration`
  ADD PRIMARY KEY (`worker_id`);

--
-- Indexes for table `Area`
--
ALTER TABLE `Area`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Bikes`
--
ALTER TABLE `Bikes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Bikes_fk1` (`location_id`),
  ADD KEY `Bikes_fk2` (`type_id`),
  ADD KEY `Bikes_fk3` (`currentLocation_id`);

--
-- Indexes for table `BikeType`
--
ALTER TABLE `BikeType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Customers_fk1` (`address_id`);

--
-- Indexes for table `Equipment`
--
ALTER TABLE `Equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Equipment_fk1` (`location_id`),
  ADD KEY `Equipment_fk2` (`type_id`);

--
-- Indexes for table `EquipmentType`
--
ALTER TABLE `EquipmentType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Locations_fk1` (`area_id`);

--
-- Indexes for table `OrderedBike`
--
ALTER TABLE `OrderedBike`
  ADD PRIMARY KEY (`order_id`,`bike_id`),
  ADD KEY `OrderedBike_fk2` (`bike_id`);

--
-- Indexes for table `OrderedEquipment`
--
ALTER TABLE `OrderedEquipment`
  ADD PRIMARY KEY (`equip_id`,`order_id`),
  ADD KEY `OrderedEquipment_fk2` (`order_id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Orders_fk1` (`customer_id`),
  ADD KEY `Orders_fk2` (`type_id`),
  ADD KEY `Orders_fk3` (`soldBy_id`);

--
-- Indexes for table `OrderType`
--
ALTER TABLE `OrderType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Restrictions`
--
ALTER TABLE `Restrictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_btid` (`bikeType_id`),
  ADD KEY `fk_etid` (`equipmentType_id`);

--
-- Indexes for table `Sales`
--
ALTER TABLE `Sales`
  ADD PRIMARY KEY (`worker_id`);

--
-- Indexes for table `StorageWorkers`
--
ALTER TABLE `StorageWorkers`
  ADD PRIMARY KEY (`worker_id`);

--
-- Indexes for table `Workers`
--
ALTER TABLE `Workers`
  ADD PRIMARY KEY (`worker_id`),
  ADD KEY `address_id` (`address_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Address`
--
ALTER TABLE `Address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `Area`
--
ALTER TABLE `Area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Bikes`
--
ALTER TABLE `Bikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `BikeType`
--
ALTER TABLE `BikeType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `Equipment`
--
ALTER TABLE `Equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `EquipmentType`
--
ALTER TABLE `EquipmentType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `OrderType`
--
ALTER TABLE `OrderType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Restrictions`
--
ALTER TABLE `Restrictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `Workers`
--
ALTER TABLE `Workers`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Begrensninger for dumpede tabeller
--

--
-- Begrensninger for tabell `Account`
--
ALTER TABLE `Account`
  ADD CONSTRAINT `Account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Workers` (`worker_id`);

--
-- Begrensninger for tabell `Administration`
--
ALTER TABLE `Administration`
  ADD CONSTRAINT `Administration_fk1` FOREIGN KEY (`worker_id`) REFERENCES `Workers` (`worker_id`);

--
-- Begrensninger for tabell `Bikes`
--
ALTER TABLE `Bikes`
  ADD CONSTRAINT `Bikes_fk1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`),
  ADD CONSTRAINT `Bikes_fk2` FOREIGN KEY (`type_id`) REFERENCES `BikeType` (`id`),
  ADD CONSTRAINT `Bikes_fk3` FOREIGN KEY (`currentLocation_id`) REFERENCES `Locations` (`id`);

--
-- Begrensninger for tabell `Customers`
--
ALTER TABLE `Customers`
  ADD CONSTRAINT `Customers_fk1` FOREIGN KEY (`address_id`) REFERENCES `Address` (`id`);

--
-- Begrensninger for tabell `Equipment`
--
ALTER TABLE `Equipment`
  ADD CONSTRAINT `Equipment_fk1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`),
  ADD CONSTRAINT `Equipment_fk2` FOREIGN KEY (`type_id`) REFERENCES `EquipmentType` (`id`);

--
-- Begrensninger for tabell `Locations`
--
ALTER TABLE `Locations`
  ADD CONSTRAINT `Locations_fk1` FOREIGN KEY (`area_id`) REFERENCES `Area` (`id`);

--
-- Begrensninger for tabell `OrderedBike`
--
ALTER TABLE `OrderedBike`
  ADD CONSTRAINT `OrderedBike_fk1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`),
  ADD CONSTRAINT `OrderedBike_fk2` FOREIGN KEY (`bike_id`) REFERENCES `Bikes` (`id`);

--
-- Begrensninger for tabell `OrderedEquipment`
--
ALTER TABLE `OrderedEquipment`
  ADD CONSTRAINT `OrderedEquipment_fk1` FOREIGN KEY (`equip_id`) REFERENCES `Equipment` (`id`),
  ADD CONSTRAINT `OrderedEquipment_fk2` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`);

--
-- Begrensninger for tabell `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_fk1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`),
  ADD CONSTRAINT `Orders_fk2` FOREIGN KEY (`type_id`) REFERENCES `OrderType` (`id`),
  ADD CONSTRAINT `Orders_fk3` FOREIGN KEY (`soldBy_id`) REFERENCES `Workers` (`worker_id`);

--
-- Begrensninger for tabell `Restrictions`
--
ALTER TABLE `Restrictions`
  ADD CONSTRAINT `Restrictions_ibfk_1` FOREIGN KEY (`bikeType_id`) REFERENCES `BikeType` (`id`),
  ADD CONSTRAINT `Restrictions_ibfk_2` FOREIGN KEY (`equipmentType_id`) REFERENCES `EquipmentType` (`id`);

--
-- Begrensninger for tabell `Sales`
--
ALTER TABLE `Sales`
  ADD CONSTRAINT `Sales_fk1` FOREIGN KEY (`worker_id`) REFERENCES `Workers` (`worker_id`);

--
-- Begrensninger for tabell `StorageWorkers`
--
ALTER TABLE `StorageWorkers`
  ADD CONSTRAINT `StorageWorkers_fk1` FOREIGN KEY (`worker_id`) REFERENCES `Workers` (`worker_id`);

--
-- Begrensninger for tabell `Workers`
--
ALTER TABLE `Workers`
  ADD CONSTRAINT `Workers_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `Address` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
