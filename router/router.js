// roles of this page , it's router api
const log = require('../log/Logging').logger
const crudService = require('../service/crud-service')
const restModulesService = require('../service/rest-modules-service')


const restModulesServiceObj = new restModulesService()
const crudServiceObj = new crudService()

const bodyParser = restModulesServiceObj.bodyParser
const routerStudent = restModulesServiceObj.express.Router()
const routerLocation = restModulesServiceObj.express.Router()

routerStudent.use(bodyParser.json())
routerStudent.use(bodyParser.urlencoded({extended: true}))

routerLocation.use(bodyParser.json())
routerLocation.use(bodyParser.urlencoded({extended: true}))

const dateObject = new Date(),
    date = (`0${dateObject.getDate()}`).slice(-2),
    month = (`0${dateObject.getMonth() + 1}`).slice(-2),
    year = dateObject.getFullYear(),
    hours = dateObject.getHours(),
    minutes = dateObject.getMinutes(),
    seconds = dateObject.getSeconds();


routerStudent.post('/create', async (req, res) => {
    try {
        const {student_fullname, student_weight, student_height, student_grade} = req.body
        const currentdatetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
        const locations = req.body.locations
        /*
            this is result locations it stores on below
                {
                    province: 'Bangkok',
                    district: 'Bang Na',
                    zipcode: 10150,
                    phone: '0623212221'
                }
        */
        await crudServiceObj.createTwoTables(student_fullname, student_weight, student_height, student_grade, currentdatetime, locations).then((result) => {
            return res.status(201).json({
                status: "created",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerStudent.get('/reads', async (req, res) => {
    try {
        await crudServiceObj.readsTwoTables().then((result) => {
            return res.status(202).json({
                status: "accepted",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerStudent.get('/read/(:student_id)', async (req, res) => {
    try {
        const student_id = req.params["student_id"]
        await crudServiceObj.readTwoTablesById(student_id).then((result) => {
            return res.status(202).json({
                status: "accepted",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerStudent.put('/update/(:student_id)', async (req, res) => {
    try {
        const student_id = req.params["student_id"]
        const {student_fullname, student_weight, student_height, student_grade} = req.body
        const currentdatetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
        await crudServiceObj.updateStudent(student_fullname, student_weight, student_height, student_grade, currentdatetime, student_id).then(() => {
            return res.status(200).json({
                status: "ok",
                message: "updated success"
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerStudent.delete('/delete/(:student_id)', async (req, res) => {
    try {
        const student_id = req.params["student_id"]
        await crudServiceObj.deleteStudent(student_id).then(() => {
            return res.status(200).json({
                status: "ok",
                message: "deleted success"
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})


routerLocation.post('/(:student_id)/create', async (req, res) => {
    try {
        const key_student_id = req.params["student_id"]
        const {province, district, zipcode, phone} = req.body
        await crudServiceObj.createLocationByIdStudent(province, district, zipcode, phone, key_student_id).then((result) => {
            return res.status(201).json({
                status: "created",
                message: "created success",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerLocation.get('/reads', async (req, res) => {
    try {
        await crudServiceObj.readsLocation().then((result) => {
            return res.status(202).json({
                status: "accepted",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerLocation.get('/read/(:phone)', async (req, res) => {
    try {
        const phone = req.params["phone"]
        await crudServiceObj.readLocation(phone).then((result) => {
            return res.status(202).json({
                status: "accepted",
                data: result
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerLocation.delete('/deletes/(:student_id)', async (req, res) => {
    try {
        const key_student_id = req.params["student_id"]
        await crudServiceObj.deletesLocation(key_student_id).then(() => {
            return res.status(200).json({
                status: "ok",
                message: "deleted success"
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerLocation.delete('/delete/(:phone)', async (req, res) => {
    try {
        const phone = req.params["phone"]
        await crudServiceObj.deleteLocation(phone).then(() => {
            return res.status(200).json({
                status: "ok",
                message: "deleted success"
            })
        }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})
routerLocation.put('/(:student_id)/update', async (req, res) => {
    try {
        const key_student_id = req.params["student_id"]
        const {province, district, zipcode, phone} = req.body
        await crudServiceObj.updateLocation(province, district, zipcode, phone, key_student_id).then( () => {
                return res.status(202).json({
                    status: "accepted",
                    message: "updated success"
                })
            }).catch((errors) => {
            throw errors
        })

    } catch (errors) {
        log.debug(`course : ${errors.message}`)
        throw errors
    }
})

module.exports = {
    routerStudent,
    routerLocation
}