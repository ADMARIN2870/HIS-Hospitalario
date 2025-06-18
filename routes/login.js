const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Formulario login
router.get('/', (req, res) => {
  res.render('login');
});

// Proceso login (sin bcrypt)
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);

  if (rows.length === 0) {
    return res.send('Usuario no encontrado');
  }

  const user = rows[0];

  if (password !== user.password) {
    return res.send('Contraseña incorrecta');
  }

  req.session.user = {
    id_usuario: user.id_usuario,
    username: user.username,
    puesto: user.Puesto
  };

  res.redirect('/pacientes'); 
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
