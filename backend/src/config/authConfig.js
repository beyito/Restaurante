export const {
  PALABRA_SECRETA = 'clave_Secreta_para_el_restaurante_de_la_universidad',
  expiresIn = '1h',
  cookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    maxAge: 1000 * 60 * 60
  }
} = process.env
