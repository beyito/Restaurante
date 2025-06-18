import { cookieOptions } from '../config/authConfig.js';
import { ValidacionDatosUsuario } from '../utils/validacionDatosUsuario.js';

export class ControladorAuth {
  constructor({ modeloAuth }) {
    this.modeloAuth = modeloAuth;
  }

  login = async (req, res) => {
      const resultado = ValidacionDatosUsuario.loginUser(req.body)
      if (!resultado.success) return res.status(401).json({ error: resultado.error })
      const usuario = await this.ModeloAuth.login({ input: resultado })
      if (usuario.error) return res.status(400).json({ error: usuario.error })
           const token = jwt.sign(
      { id: usuario.id, rol: usuario.idRol },
      process.env.PALABRA_SECRETA,
      { expiresIn: '2h' }
    );

    console.log('Login exitoso para:', usuario.nombreUsuario);
      return res.cookie('access_token', usuario.nuevoToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.onrender.com',
      maxAge: 2 * 60 * 60 * 1000
    }).json(usuario.user)
    }

  perfil = async (req, res) => {
    try {
      const { user, error } = await this.modeloAuth.perfil({ 
        input: req.user 
      });
      if (error) return res.status(404).json({ error });
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error en ControladorAuth.perfil:', error);
      return res.status(500).json({ error: 'Error en servidor' });
    }
  };

  logout = async (req, res) => {
    res.clearCookie('access_token', cookieOptions);
    return res.status(200).json({ message: 'Sesión cerrada' });
  };
}
