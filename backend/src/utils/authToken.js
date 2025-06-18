import jwt from 'jsonwebtoken';

export class Token {
  constructor(secretKey, options = {}) {
    if (!secretKey) throw new Error('Secreto JWT no proporcionado');
    this.secretKey = secretKey;
    this.options = {
      expiresIn: '2h',
      algorithm: 'HS256',
      ...options
    };
  }

  crearToken(payload) {
    try {
      if (!payload?.id) throw new Error('Payload inválido');
      return jwt.sign(payload, this.secretKey, this.options);
    } catch (error) {
      console.error('Error al crear token:', error);
      throw new Error('Error generando token');
    }
  }

  verificarToken(token) {
    try {
      if (!token) throw new Error('Token no proporcionado');
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error('Error al verificar token:', error.message);
      throw error; // Propaga el error para manejo específico
    }
  }
}
