const log = require('../log/Logging').logger
const restModulesService = require('../service/rest-modules-service'), router = require('../router/router')
const restModulesServiceObj = new restModulesService()

const application = restModulesServiceObj.express()
application.use('/api-student', router.routerStudent)
application.use('/api-location', router.routerLocation)
application.listen(3000, (errors) => {
    if (!errors) {
        log.debug('You are in port 3000')
    } else {
        log.debug(errors.message)
        throw errors
    }
})