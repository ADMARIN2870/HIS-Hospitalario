const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');


router.get('/', isLoggedIn, async (req, res) => {
  const [habitaciones] = await db.query('SELECT * FROM habitaciones');
  res.render('habitaciones/index', { habitaciones });
});


router.get('/nueva', isLoggedIn, (req, res) => {
  res.render('habitaciones/form', { habitacion: {}, editar: false });
});


router.post('/nueva', isLoggedIn, async (req, res) => {
  const { numero, ala, capacidad } = req.body;
  await db.query('INSERT INTO habitaciones (numero, ala, capacidad) VALUES (?, ?, ?)', [numero, ala, capacidad]);
  res.redirect('/habitaciones');
});


router.get('/editar/:id', isLoggedIn, async (req, res) => {
  const [result] = await db.query('SELECT * FROM habitaciones WHERE id_habitacion = ?', [req.params.id]);
  res.render('habitaciones/form', { habitacion: result[0], editar: true });
});


router.post('/editar/:id', isLoggedIn, async (req, res) => {
  const { numero, ala, capacidad } = req.body;
  await db.query('UPDATE habitaciones SET numero=?, ala=?, capacidad=? WHERE id_habitacion=?',
    [numero, ala, capacidad, req.params.id]);
  res.redirect('/habitaciones');
});


router.post('/eliminar/:id', isLoggedIn, async (req, res) => {
  await db.query('DELETE FROM habitaciones WHERE id_habitacion = ?', [req.params.id]);
  res.redirect('/habitaciones');
});


router.get('/capacidad', isLoggedIn, async (req, res) => {
  const [resultados] = await db.query(`
    SELECT h.ala, COUNT(c.id_cama) AS total_camas, SUM(h.capacidad) AS capacidad_total
    FROM habitaciones h
    LEFT JOIN camas c ON h.id_habitacion = c.id_habitacion
    GROUP BY h.ala
    ORDER BY h.ala
  `);

  res.render('habitaciones/capacidad', { resultados });
});


module.exports = router;
