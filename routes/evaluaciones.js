const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');


router.get('/', isLoggedIn, async (req, res) => {
  const [evaluaciones] = await db.query(`
    SELECT e.*, i.id_paciente, p.nombre, p.apellido
    FROM evaluaciones_enfermeria e
    JOIN internaciones i ON e.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    ORDER BY e.fecha DESC
  `);
  res.render('evaluaciones/lista', { evaluaciones });
});


router.get('/nueva', isLoggedIn, async (req, res) => {
  const [internaciones] = await db.query(`
    SELECT i.id_internacion, p.nombre, p.apellido
    FROM internaciones i
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    WHERE i.estado = 'activa'
  `);
  res.render('evaluaciones/form', {
    internacion: {},
    internaciones
  });
});


router.post('/nueva', isLoggedIn, async (req, res) => {
  const {
    id_internacion, fecha, presion_arterial, frecuencia_cardiaca,
    frecuencia_respiratoria, temperatura, sintomas, Indicaciones,
    signos_vitales, observaciones
  } = req.body;

  await db.query(`
    INSERT INTO evaluaciones_enfermeria
    (id_internacion, id_usuario, fecha, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, sintomas, Indicaciones, signos_vitales, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id_internacion,
    req.session.user.id_usuario,
    fecha,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    sintomas,
    Indicaciones,
    signos_vitales,
    observaciones
  ]);

  res.redirect('/evaluaciones');
});


router.get('/paciente', isLoggedIn, async (req, res) => {
  const [evaluaciones] = await db.query(`
    SELECT e.*, i.id_paciente, p.nombre, p.apellido
    FROM evaluaciones_enfermeria e
    JOIN internaciones i ON e.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    ORDER BY p.apellido ASC, e.fecha DESC
  `);
  res.render('evaluaciones/porPaciente', { evaluaciones });
});


router.get('/fecha', isLoggedIn, async (req, res) => {
  const [evaluaciones] = await db.query(`
    SELECT e.*, i.id_paciente, p.nombre, p.apellido
    FROM evaluaciones_enfermeria e
    JOIN internaciones i ON e.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    ORDER BY e.fecha DESC
  `);
  res.render('evaluaciones/porFecha', { evaluaciones });
});

router.get('/buscar/paciente', isLoggedIn, async (req, res) => {
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  res.render('evaluaciones/buscar_paciente', { pacientes, evaluaciones: null });
});

router.post('/buscar/paciente', isLoggedIn, async (req, res) => {
  const id_paciente = req.body.id_paciente;
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  const [evaluaciones] = await db.query(`
    SELECT e.*, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente
    FROM evaluaciones_enfermeria e
    JOIN internaciones i ON e.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    WHERE p.id_paciente = ?
  `, [id_paciente]);
  res.render('evaluaciones/buscar_paciente', { pacientes, evaluaciones });
});


router.get('/buscar/fecha', isLoggedIn, (req, res) => {
  res.render('evaluaciones/buscar_fecha', { evaluaciones: null });
});

router.post('/buscar/fecha', isLoggedIn, async (req, res) => {
  const fecha = req.body.fecha;
  const [evaluaciones] = await db.query(`
    SELECT e.*, u.username, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente
    FROM evaluaciones_enfermeria e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    JOIN internaciones i ON e.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    WHERE DATE(e.fecha) = ?
  `, [fecha]);
  res.render('evaluaciones/buscar_fecha', { evaluaciones, fecha });
});


module.exports = router;
