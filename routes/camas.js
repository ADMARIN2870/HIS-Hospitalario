const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn, hasRole } = require('../seguridad/auth');


router.get('/', isLoggedIn, async (req, res) => {
  const [camas] = await db.query(`
    SELECT c.*, h.numero AS num_habitacion, h.ala
    FROM camas c
    JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
  `);
  res.render('camas/index', { camas });
});


router.get('/nueva', isLoggedIn, async (req, res) => {
  const [habitaciones] = await db.query('SELECT * FROM habitaciones');
  res.render('camas/form', { cama: {}, habitaciones, editar: false });
});


router.post('/nueva', isLoggedIn, async (req, res) => {
  const { id_habitacion, estado, sexo_paciente, ultima_limpieza } = req.body;
  await db.query(`
    INSERT INTO camas (id_habitacion, estado, sexo_paciente, ultima_limpieza)
    VALUES (?, ?, ?, ?)
  `, [id_habitacion, estado, sexo_paciente, ultima_limpieza]);
  res.redirect('/camas');
});


router.get('/editar/:id', isLoggedIn, async (req, res) => {
  const [camaData] = await db.query('SELECT * FROM camas WHERE id_cama = ?', [req.params.id]);
  const [habitaciones] = await db.query('SELECT * FROM habitaciones');
  res.render('camas/form', { cama: camaData[0], habitaciones, editar: true });
});


router.post('/editar/:id', isLoggedIn, async (req, res) => {
  const { id_habitacion, estado, sexo_paciente, ultima_limpieza } = req.body;
  await db.query(`
    UPDATE camas SET id_habitacion=?, estado=?, sexo_paciente=?, ultima_limpieza=?
    WHERE id_cama=?
  `, [id_habitacion, estado, sexo_paciente, ultima_limpieza, req.params.id]);
  res.redirect('/camas');
});


router.post('/eliminar/:id', isLoggedIn, async (req, res) => {
  await db.query('DELETE FROM camas WHERE id_cama = ?', [req.params.id]);
  res.redirect('/camas');
});

router.get('/ocupadas', isLoggedIn, async (req, res) => {
  const [camas] = await db.query(`
    SELECT c.*, h.numero AS numero_habitacion, h.ala
    FROM camas c
    JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    WHERE c.estado = 'ocupada'
  `);
  res.render('camas/ocupadas', { camas });
});


router.get('/limpieza', isLoggedIn, async (req, res) => {
  const [camas] = await db.query(`
    SELECT c.*, h.numero AS numero_habitacion, h.ala
    FROM camas c
    JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    WHERE c.estado = 'en_limpieza'
  `);
  res.render('camas/limpieza', { camas });
});


module.exports = router;
