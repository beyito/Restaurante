import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('Restaurante', 'saBenjamin', 'CObuchan8', {
  host: 'restauranteserver.database.windows.net',
  port: 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  }
})

export default sequelize
