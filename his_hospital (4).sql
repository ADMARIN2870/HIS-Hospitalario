-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-06-2025 a las 09:39:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_hospital`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id_cama` int(11) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `estado` enum('libre','ocupada','en_limpieza') NOT NULL DEFAULT 'libre',
  `sexo_paciente` enum('M','F') DEFAULT NULL,
  `ultima_limpieza` datetime DEFAULT NULL,
  `numero` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id_cama`, `id_habitacion`, `estado`, `sexo_paciente`, `ultima_limpieza`, `numero`) VALUES
(1, 1, 'libre', 'M', '2025-06-07 10:00:00', 1),
(2, 1, 'ocupada', 'M', '2025-06-07 09:00:00', 2),
(3, 2, 'libre', 'M', '2025-06-06 17:00:00', 3),
(4, 1, 'libre', 'M', '2025-06-07 08:00:00', 4),
(5, 1, 'ocupada', 'M', '2025-06-06 10:00:00', 5),
(6, 2, 'libre', 'M', '2025-06-05 16:30:00', 6),
(13, 3, 'en_limpieza', 'M', '2025-06-08 10:00:00', 7),
(14, 4, 'libre', 'F', '2025-06-08 09:00:00', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controlmedico`
--

CREATE TABLE `controlmedico` (
  `id_evaluacion` int(11) NOT NULL,
  `id_internacion` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `evolucion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `controlmedico`
--

INSERT INTO `controlmedico` (`id_evaluacion`, `id_internacion`, `id_medico`, `fecha`, `diagnostico`, `tratamiento`, `evolucion`) VALUES
(6, 1, 5, '2025-06-09', 'Síndrome febril inespecífico. Sin signos de foco infeccioso evidente.', 'Paracetamol 1g c/8h, control de temperatura, hidratación oral.', 'Paciente afebril en últimas 12 hs, sin aparición de nuevos síntomas.'),
(7, 2, 3, '2025-06-10', 'Paciente en control general. Valores dentro de parámetros normales.', 'Indicaciones dietarias, ejercicio físico y control clínico en 6 meses.', 'Paciente sin síntomas, signos vitales normales, ECG sin alteraciones.'),
(8, 3, 1, '2025-06-16', 'Faringitis aguda con placas, compatible con anginas bacterianas.', 'Amoxicilina 875mg + ácido clavulánico c/8h por 7 días, reposo.', 'Buena respuesta al tratamiento, dolor disminuyó, sin fiebre.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermeros`
--

CREATE TABLE `enfermeros` (
  `id_enfermero` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `turno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `enfermeros`
--

INSERT INTO `enfermeros` (`id_enfermero`, `nombre`, `apellido`, `turno`) VALUES
(1, 'Mariana', 'Sosa', 'Mañana'),
(2, 'Roberto', 'Martínez', 'Tarde'),
(3, 'Julia', 'Quiroga', 'Noche'),
(4, 'Federico', 'Alonso', 'Mañana'),
(5, 'Camila', 'Herrera', 'Tarde');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`) VALUES
(1, 'Cardiología'),
(2, 'Pediatría'),
(3, 'Traumatología'),
(4, 'Clínica Médica'),
(5, 'Neurología'),
(6, 'Dermatología'),
(7, 'Ginecología'),
(8, 'Oncología'),
(9, 'Urología'),
(10, 'Oftalmología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_enfermeria`
--

CREATE TABLE `evaluaciones_enfermeria` (
  `id_evaluacion` int(11) NOT NULL,
  `id_internacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `presion_arterial` varchar(10) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,2) DEFAULT NULL,
  `sintomas` text DEFAULT NULL,
  `Indicaciones` text DEFAULT NULL,
  `signos_vitales` text NOT NULL,
  `observaciones` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evaluaciones_enfermeria`
--

INSERT INTO `evaluaciones_enfermeria` (`id_evaluacion`, `id_internacion`, `id_usuario`, `fecha`, `presion_arterial`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `temperatura`, `sintomas`, `Indicaciones`, `signos_vitales`, `observaciones`) VALUES
(1, 1, 3, '2025-06-08 23:19:22', '130/85', 80, 18, 37.10, 'Dolor de cabeza', 'Controlar PA cada 4h', 'SI', 'Controlar PA cada 4h'),
(2, 2, 2, '2025-06-08 23:35:00', '120/80', 72, 17, 36.80, 'Fatiga', 'Descanso y monitoreo', 'SI', 'Descanso y monitoreo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `ala` varchar(50) NOT NULL,
  `capacidad` int(11) NOT NULL
) ;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id_habitacion`, `numero`, `ala`, `capacidad`) VALUES
(1, '101', 'Ala Norte', 2),
(2, '102', 'Ala Sur', 1),
(3, '103', 'Ala Norte', 1),
(4, '202', 'Ala Sur', 2);

--
-- Disparadores `habitaciones`
--
DELIMITER $$
CREATE TRIGGER `chk_capacidad_habitaciones` BEFORE INSERT ON `habitaciones` FOR EACH ROW BEGIN
    IF NEW.capacidad NOT IN (1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La capacidad debe ser 1 o 2';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internaciones`
--

CREATE TABLE `internaciones` (
  `id_internacion` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_cama` int(11) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `motivo` text NOT NULL,
  `estado` enum('activa','cancelada','finalizada') NOT NULL DEFAULT 'activa',
  `id_medico` int(11) DEFAULT NULL,
  `id_enfermero` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internaciones`
--

INSERT INTO `internaciones` (`id_internacion`, `id_paciente`, `id_cama`, `fecha_ingreso`, `fecha_alta`, `motivo`, `estado`, `id_medico`, `id_enfermero`) VALUES
(1, 1, 1, '2025-06-08 23:14:55', NULL, 'Observación por fiebre', 'activa', 5, 3),
(2, 3, 6, '2025-06-08 23:30:00', NULL, 'Chequeo general', 'activa', 3, 4),
(3, 1, 2, '2025-06-15 03:58:38', NULL, 'Anginas', 'activa', 1, 3),
(4, 1, 13, '2025-06-17 00:00:00', NULL, '', 'activa', 4, 5),
(5, 2, 14, '2025-06-17 00:00:00', NULL, '', 'activa', 3, 4),
(6, 4, 3, '2025-06-17 00:00:00', NULL, '', 'activa', 1, 3),
(7, 1, 4, '2025-06-17 00:00:00', NULL, '', 'activa', 3, 2),
(8, 1, 5, '2025-06-17 00:00:00', NULL, '', 'activa', 2, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `id_especialidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `nombre`, `apellido`, `matricula`, `id_especialidad`) VALUES
(1, 'Carlos', 'Pérez', 'MP12345', NULL),
(2, 'Laura', 'Fernández', 'MP23456', NULL),
(3, 'Martín', 'Gómez', 'MP34567', NULL),
(4, 'Silvia', 'López', 'MP45678', NULL),
(5, 'Andrés', 'Ruiz', 'MP56789', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(10) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `Mutual` varchar(50) DEFAULT NULL,
  `historial_medico` text DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `nombre`, `apellido`, `dni`, `fecha_nacimiento`, `sexo`, `direccion`, `telefono`, `email`, `Mutual`, `historial_medico`) VALUES
(1, 'Juan', 'Pérez', '30123456', '1990-05-10', 'M', 'Santa Fe 123', '2664000000', 'juanp@gmail.com.ar', 'OSDE', 'Anginas'),
(2, 'María', 'López', '30123457', '1985-11-25', 'F', 'Av. Siempreviva 456', '2664111111', 'marial@mail.com', 'PAMI', NULL),
(3, 'Lucas', 'Gómez', '30300111', '1980-04-12', 'M', 'Mitre 123', '2664000001', 'lucasg@mail.com', 'OSDE', NULL),
(4, 'Carla', 'Fernández', '30999222', '1992-08-23', 'F', 'Belgrano 456', '2664000002', 'carlaf@mail.com', 'Swiss Medical', NULL),
(5, 'Pedro', 'Sánchez', '30567890', '1988-07-15', 'M', 'Av. Rivadavia 789', '2664222222', 'pedros@mail.com', 'PAMI', 'Diabetes tipo 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_enfermeros`
--

CREATE TABLE `turnos_enfermeros` (
  `id_turno` int(11) NOT NULL,
  `id_enfermero` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos_enfermeros`
--

INSERT INTO `turnos_enfermeros` (`id_turno`, `id_enfermero`, `fecha`, `hora_inicio`, `hora_fin`, `descripcion`) VALUES
(1, 1, '2025-06-25', '08:00:00', '14:00:00', 'Turno mañana - Sala A'),
(2, 2, '2025-06-25', '14:00:00', '20:00:00', 'Turno tarde - Sala B'),
(3, 3, '2025-06-26', '08:00:00', '14:00:00', 'Turno mañana - Guardia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Puesto` enum('admin','recepcion','enfermeria','medico') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `username`, `password`, `Puesto`) VALUES
(1, 'admin', 'admin123', 'admin'),
(2, 'medico1', 'medico123', 'medico'),
(3, 'enfermero1', 'enfermero123', 'enfermeria'),
(7, 'recepcion2', 'recepcion123', 'recepcion');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id_cama`),
  ADD KEY `fk_camas_habitaciones` (`id_habitacion`),
  ADD KEY `idx_estado_cama` (`estado`),
  ADD KEY `idx_sexo_paciente` (`sexo_paciente`);

--
-- Indices de la tabla `controlmedico`
--
ALTER TABLE `controlmedico`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `id_internacion` (`id_internacion`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Indices de la tabla `enfermeros`
--
ALTER TABLE `enfermeros`
  ADD PRIMARY KEY (`id_enfermero`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `id_internacion` (`id_internacion`),
  ADD KEY `fk_usuario_enfermeria` (`id_usuario`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`);

--
-- Indices de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD PRIMARY KEY (`id_internacion`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_cama` (`id_cama`),
  ADD KEY `idx_estado_internacion` (`estado`),
  ADD KEY `fk_internaciones_medico` (`id_medico`),
  ADD KEY `fk_internaciones_enfermero` (`id_enfermero`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD KEY `fk_medico_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `idx_email` (`email`),
  ADD KEY `idx_sexo` (`sexo`);

--
-- Indices de la tabla `turnos_enfermeros`
--
ALTER TABLE `turnos_enfermeros`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_enfermero` (`id_enfermero`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id_cama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `controlmedico`
--
ALTER TABLE `controlmedico`
  MODIFY `id_evaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `enfermeros`
--
ALTER TABLE `enfermeros`
  MODIFY `id_enfermero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  MODIFY `id_evaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  MODIFY `id_internacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turnos_enfermeros`
--
ALTER TABLE `turnos_enfermeros`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`),
  ADD CONSTRAINT `fk_camas_habitaciones` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`);

--
-- Filtros para la tabla `controlmedico`
--
ALTER TABLE `controlmedico`
  ADD CONSTRAINT `controlmedico_ibfk_1` FOREIGN KEY (`id_internacion`) REFERENCES `internaciones` (`id_internacion`),
  ADD CONSTRAINT `controlmedico_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`);

--
-- Filtros para la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD CONSTRAINT `evaluaciones_enfermeria_ibfk_1` FOREIGN KEY (`id_internacion`) REFERENCES `internaciones` (`id_internacion`),
  ADD CONSTRAINT `fk_usuario_enfermeria` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD CONSTRAINT `fk_internaciones_enfermero` FOREIGN KEY (`id_enfermero`) REFERENCES `enfermeros` (`id_enfermero`),
  ADD CONSTRAINT `fk_internaciones_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `internaciones_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `internaciones_ibfk_2` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medico_especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`);

--
-- Filtros para la tabla `turnos_enfermeros`
--
ALTER TABLE `turnos_enfermeros`
  ADD CONSTRAINT `turnos_enfermeros_ibfk_1` FOREIGN KEY (`id_enfermero`) REFERENCES `enfermeros` (`id_enfermero`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
