const express = require('express'); 
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');

// Listado general
router.get('/', isLoggedIn, async (req, res) => {
  const [evaluaciones] = await db.query(`
    SELECT cm.*, i.id_paciente, p.nombre, p.apellido, m.nombre AS medico
    FROM controlmedico cm
    JOIN internaciones i ON cm.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    JOIN medicos m ON cm.id_medico = m.id_medico
    ORDER BY cm.fecha DESC
  `);
  res.render('controlmedico/lista', { evaluaciones });
});

// Formulario de nueva evaluación
router.get('/nueva', isLoggedIn, async (req, res) => {
  const [internaciones] = await db.query(`
    SELECT i.id_internacion, p.nombre, p.apellido
    FROM internaciones i
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    WHERE i.estado = 'activa'
  `);
  const [medicos] = await db.query("SELECT * FROM medicos");
  res.render('controlmedico/form', { internaciones, medicos });
});

// Guardar evaluación médica
router.post('/nueva', isLoggedIn, async (req, res) => {
  const { id_internacion, id_medico, fecha, diagnostico, tratamiento, evolucion } = req.body;

  await db.query(`
    INSERT INTO controlmedico
    (id_internacion, id_medico, fecha, diagnostico, tratamiento, evolucion)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    id_internacion,
    id_medico,
    fecha,
    diagnostico,
    tratamiento,
    evolucion
  ]);

  res.redirect('/controlmedico');
});

// Evaluaciones por paciente
router.get('/paciente', isLoggedIn, async (req, res) => {
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  res.render('controlmedico/buscar_paciente', { pacientes, evaluaciones: null });
});

router.post('/paciente', isLoggedIn, async (req, res) => {
  const id_paciente = req.body.id_paciente;
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  const [evaluaciones] = await db.query(`
    SELECT cm.*, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, m.nombre AS medico
    FROM controlmedico cm
    JOIN internaciones i ON cm.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    JOIN medicos m ON cm.id_medico = m.id_medico
    WHERE p.id_paciente = ?
  `, [id_paciente]);
  res.render('controlmedico/buscar_paciente', { pacientes, evaluaciones });
});

// Evaluaciones por fecha
router.get('/fecha', isLoggedIn, (req, res) => {
  res.render('controlmedico/buscar_fecha', { evaluaciones: null });
});

router.post('/fecha', isLoggedIn, async (req, res) => {
  const fecha = req.body.fecha;
  const [evaluaciones] = await db.query(`
    SELECT cm.*, u.username, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, m.nombre AS medico
    FROM controlmedico cm
    JOIN usuarios u ON cm.id_medico = u.id_usuario
    JOIN internaciones i ON cm.id_internacion = i.id_internacion
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    JOIN medicos m ON cm.id_medico = m.id_medico
    WHERE DATE(cm.fecha) = ?
  `, [fecha]);
  res.render('controlmedico/buscar_fecha', { evaluaciones, fecha });
});

module.exports = router;
