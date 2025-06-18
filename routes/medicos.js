const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');

// Mostrar listado
router.get('/', isLoggedIn, async (req, res) => {
  const [medicos] = await db.query('SELECT * FROM medicos');
  res.render('medicos/index', { medicos });
});

// Formulario nuevo
router.get('/nuevo', isLoggedIn, async (req, res) => {
  const [especialidades] = await db.query("SELECT * FROM especialidades");
  res.render('medicos/form', { medico: {}, especialidades });
});


// Guardar nuevo
router.post('/nuevo', isLoggedIn, async (req, res) => {
  const { nombre, apellido, especialidad, matricula } = req.body;
  await db.query('INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?, ?, ?, ?)',
    [nombre, apellido, especialidad, matricula]);
  res.redirect('/medicos');
});

// Formulario editar
router.get('/editar/:id', isLoggedIn, async (req, res) => {
  const [medicos] = await db.query("SELECT * FROM medicos WHERE id_medico = ?", [req.params.id]);
  const [especialidades] = await db.query("SELECT * FROM especialidades");
  res.render('medicos/form', { medico: medicos[0], especialidades });
});


// Guardar edición
router.post('/editar/:id', isLoggedIn, async (req, res) => {
  const { nombre, apellido, especialidad, matricula } = req.body;
  await db.query(
    'UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula=? WHERE id_medico=?',
    [nombre, apellido, especialidad, matricula, req.params.id]
  );
  res.redirect('/medicos');
});

// Eliminar
router.post('/eliminar/:id', isLoggedIn, async (req, res) => {
  await db.query('DELETE FROM medicos WHERE id_medico = ?', [req.params.id]);
  res.redirect('/medicos');
});

router.get('/especialidades', isLoggedIn, async (req, res) => {
  const [especialidades] = await db.query('SELECT * FROM especialidades');
  res.render('medicos/form', { medico, especialidades, editar: true });
});


module.exports = router;
