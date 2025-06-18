const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { isLoggedIn } = require('../seguridad/auth');


router.get('/', async (req, res) => {
  const [internaciones] = await db.query(`
    SELECT 
      i.id_internacion,
      i.fecha_ingreso,
      i.fecha_alta AS fecha_egreso,
      i.estado,
      p.nombre AS paciente_nombre,
      p.apellido AS paciente_apellido,
      c.id_cama AS cama_numero,
      h.numero AS habitacion_numero,
      h.ala AS habitacion_ala,
      m.nombre AS medico_nombre,
      m.apellido AS medico_apellido,
      e.nombre AS enfermero_nombre,
      e.apellido AS enfermero_apellido
    FROM internaciones i
    JOIN pacientes p ON i.id_paciente = p.id_paciente
    JOIN camas c ON i.id_cama = c.id_cama
    JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    LEFT JOIN medicos m ON i.id_medico = m.id_medico
    LEFT JOIN enfermeros e ON i.id_enfermero = e.id_enfermero
  `);
  res.render('internaciones/index', { internaciones });
});


router.get('/nueva', async (req, res) => {
  const [pacientes] = await db.query('SELECT * FROM pacientes');
  const [camas] = await db.query(`
  SELECT c.id_cama, c.numero, h.numero AS habitacion_numero, h.ala
  FROM camas c
  JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
  WHERE c.estado = 'libre'
`);

 
  const [habitaciones] = await db.query('SELECT * FROM habitaciones');
  const [medicos] = await db.query('SELECT * FROM medicos');
  const [enfermeros] = await db.query('SELECT * FROM enfermeros');

  res.render('internaciones/form', {
  internacion: {},
  pacientes,
  camas,
  habitaciones,
  medicos,
  enfermeros,
  error: null
});
});

router.post('/nueva', async (req, res) => {
  const { id_paciente, id_cama, id_habitacion, fecha_ingreso, id_medico, id_enfermero } = req.body;

  try {
    const [[paciente]] = await db.query('SELECT sexo FROM pacientes WHERE id_paciente = ?', [id_paciente]);
    const [[habitacion]] = await db.query(`
      SELECT h.id_habitacion, h.capacidad
      FROM camas c
      JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
      WHERE c.id_cama = ?
    `, [id_cama]);

    if (habitacion.capacidad === 2) {
      const [ocupadas] = await db.query(`
        SELECT p.sexo
        FROM internaciones i
        JOIN pacientes p ON i.id_paciente = p.id_paciente
        JOIN camas c ON i.id_cama = c.id_cama
        WHERE c.id_habitacion = ? AND i.estado = 'activa'
      `, [habitacion.id_habitacion]);

      const haySexoDistinto = ocupadas.some(p => p.sexo !== paciente.sexo);

      if (haySexoDistinto) {
        const [pacientes] = await db.query('SELECT * FROM pacientes');
        const [camas] = await db.query(`
          SELECT c.id_cama, c.numero, h.numero AS habitacion_numero, h.ala
          FROM camas c
          JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
          WHERE c.id_cama NOT IN (
            SELECT id_cama FROM internaciones WHERE estado = 'activa'
          )
        `);
        const [habitaciones] = await db.query('SELECT * FROM habitaciones');
        const [medicos] = await db.query('SELECT * FROM medicos');
        const [enfermeros] = await db.query('SELECT * FROM enfermeros');

        return res.render('internaciones/form', {
          internacion: req.body,
          pacientes,
          camas,
          habitaciones,
          medicos,
          enfermeros,
          error: 'No se puede asignar esta cama. En la habitación ya hay un paciente de sexo diferente.'
        });
      }
    }

    await db.query(`
      INSERT INTO internaciones (id_paciente, id_cama, fecha_ingreso, id_medico, id_enfermero, id_habitacion)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_paciente, id_cama, fecha_ingreso, id_medico, id_enfermero, id_habitacion]);

    res.redirect('/internaciones');
  } catch (error) {
    console.error('Error al guardar la internación:', error);
    res.status(500).send('Error interno al guardar internación.');
  }
});


router.post('/finalizar/:id', async (req, res) => {
  const fecha = new Date().toISOString().split('T')[0];
  await db.query(
    'UPDATE internaciones SET estado = "finalizada", fecha_alta = ? WHERE id_internacion = ?',
    [fecha, req.params.id]
  );
  res.redirect('/internaciones');
});


router.post('/cancelar/:id', async (req, res) => {
  await db.query('UPDATE internaciones SET estado = "cancelada" WHERE id_internacion = ?', [req.params.id]);
  res.redirect('/internaciones');
});


router.get('/buscar', isLoggedIn, async (req, res) => {
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  res.render('internaciones/buscar', { pacientes, resultados: [] });
});

router.post('/buscar', isLoggedIn, async (req, res) => {
  const { id_paciente } = req.body;
  const [pacientes] = await db.query('SELECT id_paciente, nombre, apellido FROM pacientes');
  const [resultados] = await db.query(`
    SELECT i.*, c.numero AS cama_numero, h.numero AS habitacion_numero, h.ala AS habitacion_ala,
           m.nombre AS medico_nombre, m.apellido AS medico_apellido,
           e.nombre AS enfermero_nombre, e.apellido AS enfermero_apellido
    FROM internaciones i
    JOIN camas c ON i.id_cama = c.id_cama
    JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    LEFT JOIN medicos m ON i.id_medico = m.id_medico
    LEFT JOIN enfermeros e ON i.id_enfermero = e.id_enfermero
    WHERE i.id_paciente = ?
  `, [id_paciente]);

  res.render('internaciones/buscar', { pacientes, resultados });
});

module.exports = router;
