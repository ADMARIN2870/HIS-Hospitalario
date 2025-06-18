router.get('/galeria', async (req, res) => {
  const [pacientes] = await db.query('SELECT * FROM pacientes');
  res.render('galeria', { session: req.session, pacientes });
});
