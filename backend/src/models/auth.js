import bcrypt from 'bcrypt';
import sequelize from '../config/db/config.js';
import { definicionUsuario } from '../services/user.js';

export class ModeloAuth {
  constructor(tokenService) {
    this.tokenService = tokenService;
    this.Usuario = sequelize.define('Usuario', definicionUsuario, {
      timestamps: false,
      freezeTableName: true
    });
  }

  async login({ input }) {
    try {
      const { nombreUsuario, password } = input;
      
      const usuario = await this.Usuario.findOne({
        where: { nombreUsuario },
        attributes: ['id', 'nombreUsuario', 'correo', 'password', 'idRol']
      });

      if (!usuario) return { error: 'Credenciales inválidas' };

      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) return { error: 'Credenciales inválidas' };

      const token = this.tokenService.crearToken({
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.idRol
      });

      return {
        user: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          correo: usuario.correo,
          rol: usuario.idRol
        },
        token
      };

    } catch (error) {
      console.error('Error en ModeloAuth.login:', error);
      throw new Error('Error en autenticación');
    }
  }

 async perfil ({ input }) {
    const id = input.id
    const user = await this.Usuario.findByPk(id)
    if (!user) return { error: 'Error: Usuario  no existente' }
    return {
      user: {
        id: user.id,
        email: user.correo,
        userName: user.nombreUsuario,
        telefono: user.telefono,
        nombre: user.nombre,
        rol: user.idRol
      }
    }
  }
}
