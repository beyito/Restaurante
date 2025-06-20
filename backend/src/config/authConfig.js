export const {
  PALABRA_SECRETA = 'clave_Secreta_para_el_restaurante_de_la_universidad',
  expiresIn = '2h',

  cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
    maxAge: 1000 * 60 * 60 * 2,
    path: '/'
  }
} = process.env
