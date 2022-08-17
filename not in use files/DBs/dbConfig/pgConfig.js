const {Client} = require('pg')

const pgClient = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "linux6926",
    database: "whatsapp_server"
})

module.exports = pgClient