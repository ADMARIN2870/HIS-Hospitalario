// auth.js

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function hasRole(...roles) {
  return (req, res, next) => {
    if (req.session.user) {
      const puesto = req.session.user.puesto?.toLowerCase().trim();
      console.log('Rol del usuario actual:', puesto); // Debug (podés eliminar esto después)

      if (roles.includes(puesto)) {
        return next();
      }
    }

    res.status(403).send('Acceso denegado');
  };
}


module.exports = { isLoggedIn, hasRole };
