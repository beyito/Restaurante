import sequelize from './config/db/config.js'

export const db = async () => {
  try {
    await sequelize.authenticate()
    console.log('base de datos en linea')
  } catch (error) {
    console.error('Error al levantar el servido', error)
    throw error
  }
}
