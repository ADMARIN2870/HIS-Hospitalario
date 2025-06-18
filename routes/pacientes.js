const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');

// Listar pacientes
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const [pacientes] = await db.query('SELECT * FROM pacientes');
    res.render('pacientes/index', { pacientes });
  } catch (err) {
    console.error('Error al listar pacientes:', err);
    res.status(500).send('Error al obtener los pacientes');
  }
});

// Formulario nuevo
router.get('/nuevo', isLoggedIn, (req, res) => {
  res.render('pacientes/form', {
    paciente: {
      nombre: '',
      apellido: '',
      dni: '',
      fecha_nacimiento: '',
      sexo: '',
      direccion: '',
      telefono: '',
      email: '',
      Mutual: '',
      historial_medico: ''
    },
    editar: false
  });
});

// Guardar nuevo paciente
router.post('/nuevo', isLoggedIn, async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      sexo,
      direccion,
      telefono,
      email,
      Mutual,
      historial_medico
    } = req.body;

    await db.query(`
      INSERT INTO pacientes 
      (nombre, apellido, dni, fecha_nacimiento, sexo, direccion, telefono, email, Mutual, historial_medico)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, dni, fecha_nacimiento, sexo, direccion, telefono, email, Mutual, historial_medico]
    );

    res.redirect('/pacientes');
  } catch (err) {
    console.error('Error al guardar paciente:', err);
    res.status(500).send('Error al guardar paciente');
  }
});

// Formulario editar
router.get('/editar/:id', isLoggedIn, async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM pacientes WHERE id_paciente = ?', [req.params.id]);

    if (result.length === 0) return res.status(404).send('Paciente no encontrado');

    const paciente = result[0];

    if (paciente.fecha_nacimiento) {
      paciente.fecha_nacimiento = new Date(paciente.fecha_nacimiento).toISOString().split('T')[0];
    }

    res.render('pacientes/form', { paciente, editar: true });
  } catch (err) {
    console.error('Error al cargar paciente:', err);
    res.status(500).send('Error al cargar paciente');
  }
});

// Guardar cambios
router.post('/editar/:id', isLoggedIn, async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      sexo,
      direccion,
      telefono,
      email,
      Mutual,
      historial_medico
    } = req.body;

    await db.query(`
      UPDATE pacientes 
      SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, sexo=?, direccion=?, telefono=?, email=?, Mutual=?, historial_medico=?
      WHERE id_paciente=?`,
      [nombre, apellido, dni, fecha_nacimiento, sexo, direccion, telefono, email, Mutual, historial_medico, req.params.id]
    );

    res.redirect('/pacientes');
  } catch (err) {
    console.error('Error al actualizar paciente:', err);
    res.status(500).send('Error al actualizar paciente');
  }
});

// Eliminar múltiples pacientes
router.post('/eliminar-multiple', isLoggedIn, async (req, res) => {
  try {
    const seleccionados = req.body.seleccionados;

    if (Array.isArray(seleccionados)) {
      await db.query('DELETE FROM pacientes WHERE id_paciente IN (?)', [seleccionados]);
    } else if (seleccionados) {
      await db.query('DELETE FROM pacientes WHERE id_paciente = ?', [seleccionados]);
    }

    res.redirect('/pacientes');
  } catch (err) {
    console.error('Error al eliminar pacientes:', err);
    res.status(500).send('Error al eliminar pacientes');
  }
});

module.exports = router;
