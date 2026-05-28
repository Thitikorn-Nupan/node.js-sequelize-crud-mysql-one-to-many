const path = require('path')
class Logging {
    get winston() {
        const {createLogger, format, transports} = require('winston')
        return {createLogger, format, transports}
    }
    get logger() {
        return this.winston.createLogger({
            level: 'silly',
            format: this.winston.format.combine(
                this.winston.format.label({label: path.basename(process.mainModule.filename)}),
                this.winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                this.winston.format.printf(info => `${info.timestamp} ${info.level} [${info.label}] : ${info.message}`)
            ),
            transports: [
                new this.winston.transports.Console
            ]
        })
    }
}
module.exports = new Logging()