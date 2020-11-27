const Sequelize = require('sequelize')

const connection = new Sequelize('askresponse', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
