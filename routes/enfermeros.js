const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');

// Listar enfermeros
router.get('/', isLoggedIn, async (req, res) => {
  const [enfermeros] = await db.query('SELECT * FROM enfermeros');
  res.render('enfermeros/index', { enfermeros });
});

// Formulario nuevo
router.get('/nuevo', isLoggedIn, (req, res) => {
  res.render('enfermeros/form', { enfermero: {}, editar: false });
});

// Guardar nuevo
router.post('/nuevo', isLoggedIn, async (req, res) => {
  const { nombre, apellido, turno } = req.body;
  await db.query('INSERT INTO enfermeros (nombre, apellido, turno) VALUES (?, ?, ?)', [nombre, apellido, turno]);
  res.redirect('/enfermeros');
});

// Formulario editar
router.get('/editar/:id', isLoggedIn, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM enfermeros WHERE id_enfermero = ?', [req.params.id]);
  res.render('enfermeros/form', { enfermero: rows[0], editar: true });
});

// Guardar edición
router.post('/editar/:id', isLoggedIn, async (req, res) => {
  const { nombre, apellido, turno } = req.body;
  await db.query('UPDATE enfermeros SET nombre=?, apellido=?, turno=? WHERE id_enfermero=?',
    [nombre, apellido, turno, req.params.id]);
  res.redirect('/enfermeros');
});

// Eliminar
router.post('/eliminar/:id', isLoggedIn, async (req, res) => {
  await db.query('DELETE FROM enfermeros WHERE id_enfermero = ?', [req.params.id]);
  res.redirect('/enfermeros');
});


router.get('/turnos', isLoggedIn, async (req, res) => {
  const [turnos] = await db.query(`
    SELECT t.*, e.nombre, e.apellido
    FROM turnos_enfermeros t
    JOIN enfermeros e ON t.id_enfermero = e.id_enfermero
    ORDER BY t.fecha DESC
  `);
  res.render('enfermeros/turnos', { turnos });
});

module.exports = router;
