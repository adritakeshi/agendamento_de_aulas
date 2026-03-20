// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verificar token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Gerar token JWT
const gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET || 'sua_chave_secreta',
    { expiresIn: '24h' }
  );
};

module.exports = {
  verificarToken,
  gerarToken
};
