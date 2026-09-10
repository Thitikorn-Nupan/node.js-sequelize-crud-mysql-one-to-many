const log = require('../log/Logging').logger
const {Sequelize} = require('sequelize');
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({path: path.resolve('env/.env'),debug : true})

class DatabaseConnect {
    #sequelize
    constructor() {
        this.#sequelizeInfo = {
            host :  process.env.MYSQLL_HOST ,
            username :  process.env.MYSQLL_USERNAME ,
            password :  process.env.MYSQLL_PASSWORD ,
            port :  process.env.MYSQLL_PORT ,
            database :  process.env.MYSQLL_DATABASE ,
            max:5 ,
            min:0 ,
            acquire:30000,
            idle:10000
        }
    }
    set #sequelizeInfo (info) {
        this.#sequelize = new Sequelize(
            info.database ,
            info.username ,
            info.password ,
            {
                dialect:'mysql' ,
                pool : {
                    max: info.max ,
                    min: info.min ,
                    acquire: info.acquire,
                    idle: info.idle
                }
            }
        )
    }
    get sequelize () {
        return this.#sequelize
    }
}
/**
new DatabaseConnect().sequelize.authenticate()
    .then(() => {
        log.debug('Connection has been established successfully.');
    })
    .catch(err => {
        log.debug('Unable to connect to the database:'+ err);
});
*/
module.exports = new DatabaseConnect().sequelize
