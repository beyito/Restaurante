import { cookieOptions } from '../config/authConfig.js';
import { ValidacionDatosUsuario } from '../utils/validacionDatosUsuario.js';

export class ControladorAuth {
  constructor({ modeloAuth }) {
    this.modeloAuth = modeloAuth;
  }

  login = async (req, res) => {
    try {
      const resultado = ValidacionDatosUsuario.loginUser(req.body);
      if (!resultado.success) {
        return res.status(400).json({ error: resultado.error });
      }

      const { user, token, error } = await this.modeloAuth.login({ 
        input: resultado.data 
      });

      if (error) return res.status(401).json({ error });

      return res
        .status(200)
        .cookie('access_token', token, cookieOptions)
        .json({ user });

    } catch (error) {
      console.error('Error en ControladorAuth.login:', error);
      return res.status(500).json({ error: 'Error en servidor' });
    }
  };

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

  logout = (req, res) => {
    res.clearCookie('access_token', cookieOptions);
    return res.status(200).json({ message: 'Sesión cerrada' });
  };
}
