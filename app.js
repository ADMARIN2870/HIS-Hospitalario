const express = require('express');
const path = require('path');
const session = require('express-session');
const open = require('open'); 
const app = express();

app.use(session({
  secret: 'secreto-del-sistema-his', 
  saveUninitialized: false
}));


const galeriaRouter = require('./routes/galeria');
app.use('/galeria', galeriaRouter);


const PORT = 3000;

// Conexión a la base de datos
const db = require('./models/db');




app.use(express.static('public'));

// Motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'his_super_secreto',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});



// Rutas
const loginRoutes = require('./routes/login');
const pacientesRoutes = require('./routes/pacientes');
const camasRoutes = require('./routes/camas');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');
const evaluacionesRoutes = require('./routes/evaluaciones');
const usuariosRoutes = require('./routes/usuarios');
const enfermerosRoutes = require('./routes/enfermeros');
const medicosRoutes = require('./routes/medicos');
const controlmedicoRoutes = require('./routes/controlmedico');


app.use('/controlmedico', controlmedicoRoutes);
app.use('/login', loginRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/camas', camasRoutes);
app.use('/habitaciones', habitacionesRoutes);
app.use('/internaciones', internacionesRoutes);
app.use('/evaluaciones', evaluacionesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/enfermeros', enfermerosRoutes);
app.use('/medicos', medicosRoutes);


// Página principal
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/pacientes');
  } else {
    res.redirect('/login');
  }
});

// Error 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor HIS iniciado en http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`, { app: { name: 'msedge' } }); // abre en Edge
});

