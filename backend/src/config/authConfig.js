export const {
  PALABRA_SECRETA = 'clave_Secreta_para_el_restaurante_de_la_universidad',
  expiresIn = '1h',
  cookieOptions = {
    httpOnly: true, // Más seguro que false (protege contra XSS)
    secure: true, // Siempre true en producción (HTTPS obligatorio)
    sameSite: 'strict', // Más restrictivo que 'lax' para seguridad
    maxAge: 1000 * 60 * 60 * 24 * 7, // Ejemplo: 1 semana (ajusta según necesites)
    path: '/', // Disponible en todas las rutas
    signed: true // Recomendado para cookies importan
  }
} = process.env
