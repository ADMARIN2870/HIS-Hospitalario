const express = require('express');
const router = express.Router();

// Ruta protegida: Galería de bienvenida
router.get('/', (req, res) => {
  // Verificamos que haya sesión iniciada
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  // Renderizamos la vista galeria.pug con los datos del usuario
  res.render('galeria', {
    user: req.session.user
  });
});

module.exports = router;
