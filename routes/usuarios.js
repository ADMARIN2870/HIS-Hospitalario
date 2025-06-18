const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const { isLoggedIn, hasRole } = require('../seguridad/auth');


router.get('/', isLoggedIn, hasRole('admin'), async (req, res) => {
  const [usuarios] = await db.query('SELECT id_usuario, username, Puesto FROM usuarios');
  res.render('usuarios/index', {
    usuarios,
    user: req.session.user  
  });
});

router.get('/nuevo', isLoggedIn, hasRole('admin'), (req, res) => {
  res.render('usuarios/form', { usuario: {}, editar: false });
});


router.post('/nuevo', isLoggedIn, hasRole('admin'), async (req, res) => {
  const { username, password, Puesto } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO usuarios (username, password, Puesto) VALUES (?, ?, ?)', [username, hashed, Puesto]);
  res.redirect('/usuarios');
});

router.get('/editar/:id', isLoggedIn, hasRole('admin'), async (req, res) => {
  const [result] = await db.query('SELECT id_usuario, username, Puesto FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  res.render('usuarios/form', { usuario: result[0], editar: true });
});


router.post('/editar/:id', isLoggedIn, hasRole('admin'), async (req, res) => {
  const { username, Puesto } = req.body;
  await db.query('UPDATE usuarios SET username=?, Puesto=? WHERE id_usuario=?', [username, Puesto, req.params.id]);
  res.redirect('/usuarios');
});


router.post('/eliminar/:id', isLoggedIn, hasRole('admin'), async (req, res) => {
  await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  res.redirect('/usuarios');
});







module.exports = router;
