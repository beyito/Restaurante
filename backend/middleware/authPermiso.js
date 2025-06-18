export const autenticacion = (tokenService) => {
  return async (req, res, next) => {
    try {
      // 1. Obtener token de cookies o headers
      const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        console.warn('Intento de acceso sin token', { ip: req.ip, path: req.path });
        return res.status(401).json({ 
          error: 'Acceso no autorizado',
          code: 'NO_AUTH_TOKEN'
        });
      }

      // 2. Verificar token
      const decodificado = tokenService.verificarToken(token);
      req.user = decodificado;

      // 3. Log para debugging (solo desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log('Usuario autenticado:', {
          id: decodificado.id,
          rol: decodificado.rol,
          exp: new Date(decodificado.exp * 1000)
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticacion middleware:', error.message);
      
      // Manejo específico de errores JWT
      const errorMessage = error.name === 'TokenExpiredError' 
        ? 'Sesión expirada' 
        : 'Token inválido';

      return res.status(403).json({ 
        error: errorMessage,
        code: error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        requiresLogin: true
      });
    }
  };
};

export const autorizacion = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      // 1. Verificar si el usuario está autenticado primero
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' });
      }

      // 2. Verificar roles
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol)) {
        console.warn(`Intento de acceso no autorizado. User: ${req.user.id}, Rol: ${req.user.rol}, Ruta: ${req.path}`);
        return res.status(403).json({ 
          error: 'Permisos insuficientes',
          requiredRoles: rolesPermitidos,
          userRole: req.user.rol
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorizacion middleware:', error);
      res.status(500).json({ error: 'Error interno al verificar permisos' });
    }
  };
};


export const clearToken = (req, res) => {
  res.clearCookie('access_token').json({ message: 'cerrada con exito' })
}
