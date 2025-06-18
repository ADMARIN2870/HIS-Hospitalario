// generar_hashes.js
const bcrypt = require('bcrypt');

const contrasenas = [
  { username: 'admin', pass: 'admin123' },
  { username: 'medico1', pass: 'medico123' },
  { username: 'enfermero1', pass: 'enfermero123' },
  { username: 'recepcion2', pass: 'recepcion123' }
];

contrasenas.forEach(({ username, pass }) => {
  bcrypt.hash(pass, 10, (err, hash) => {
    if (err) throw err;
    console.log(`UPDATE usuarios SET password = '${hash}' WHERE username = '${username}';`);
  });
});
