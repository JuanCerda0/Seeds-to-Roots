
const oracledb = require("oracledb");

async function getConnection() {

    return await oracledb.getConnection({

        // Datos de conexion a la base de datos

        user: "HUERTO",
        password: "123456",
        connectString: "localhost:1521/XEPDB1"

    });


}

module.exports = { getConnection };


