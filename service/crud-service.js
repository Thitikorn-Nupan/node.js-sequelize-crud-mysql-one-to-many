const Student = require('../models/student')
const Location = require('../models/location')

Student.hasMany(Location, {foreignKey: 'key_student_id'})
Location.belongsTo(Student, {foreignKey: 'key_student_id', as: 'students'})

class CrudService {

    // student crud
    createTwoTables = async (student_fullname, student_weight, student_height, student_grade, currentdatetime, locations) => {
        return await Student.create({
            student_fullname,
            student_weight,
            student_height,
            student_grade,
            currentdatetime,
            locations
        }, {include: Location})
        /**
            Very smart!
            Executing (default): INSERT INTO `students` (`student_id`,`student_fullname`,`student_weight`,`student_height`,`student_grade`,`currentdatetime`) VALUES (DEFAULT,?,?,?,?,?);
            Executing (default): INSERT INTO `locations` (`province`,`district`,`zipcode`,`phone`,`key_student_id`) VALUES (?,?,?,?,?);
        */
    }
    readsTwoTables = async () => {
        return await Student.findAll({include: Location})
        /**
            Executing (default):
            SELECT `students`.`student_id`, `students`.`student_fullname`, `students`.`student_weight`, `students`.`student_height`, `students`.`student_grade`, `students`.`currentdatetime`,
                    `locations`.`province` AS `locations.province`, `locations`.`district` AS `locations.district`, `locations`.`zipcode` AS `locations.zipcode`, `locations`.`phone` AS `locations.phone`, `locations`.`key_student_id` AS `locations.key_student_id`
                    FROM `students` AS `students` LEFT OUTER JOIN `locations` AS `locations` ON `students`.`student_id` = `locations`.`key_student_id`;
        */
    }

    readTwoTablesById = async (student_id) => {
        return await Student.findByPk(student_id, {include: Location})
        /**
            Executing (default):
            SELECT `students`.`student_id`, `students`.`student_fullname`, `students`.`student_weight`, `students`.`student_height`, `students`.`student_grade`, `students`.`currentdatetime`,
                    `locations`.`province` AS `locations.province`, `locations`.`district` AS `locations.district`, `locations`.`zipcode` AS `locations.zipcode`, `locations`.`phone` AS `locations.phone`, `locations`.`key_student_id` AS `locations.key_student_id`
                    FROM `students` AS `students` LEFT OUTER JOIN `locations` AS `locations` ON `students`.`student_id` = `locations`.`key_student_id` WHERE `students`.`student_id` = '29';
        */
    }

    updateStudent = async (student_fullname, student_weight, student_height, student_grade, currentdatetime, student_id) => {
        await Student.update({
            student_fullname,
            student_weight,
            student_height,
            student_grade,
            currentdatetime
        }, {where: {student_id: student_id}})
        /**
            Executing (default):
                UPDATE `students` SET `student_fullname`=?,`student_weight`=?,`student_height`=?,`student_grade`=?,`currentdatetime`=? WHERE `student_id` = ?
        */
    }

    deleteStudent = async (student_id) => {
        await this.readTwoTablesById(student_id).then((student) => student.destroy())
    }





    // locations
    createLocationByIdStudent = async (province, district, zipcode, phone, student_id) => {
        await Student.findByPk(student_id).then((student) => {
            if (student != null) {
                const key_student_id = student_id
                Location.create({province, district, zipcode, phone, key_student_id})
            } else {
                throw new Error('Not found student!')
            }
        })
    }

    readsLocation = async () => {
        return await Location.findAll()
    }

    readLocation = async (phone) => {
        return await Location.findByPk(phone)
    }

    deletesLocation = async (student_id) => {
        await Student.findByPk(student_id).then((studentFound) => {
            if (studentFound != null) {
                let key_student_id = student_id
                Location.destroy({where: {key_student_id: key_student_id}})
            } else {
                throw new Error('Not found student!')
            }
        })
    }

    deleteLocation = async (phone) => {
        return await Location.findByPk(phone).then((location) => {
            if (location != null) {
                location.destroy()
            } else {
                throw new Error('Not found phone!')
            }
        })
    }

    updateLocation = async (province, district, zipcode, phone, student_id) => {
        return await Student.findByPk(student_id).then((student) => {
            if (student != null) {
                Location.update({province, district, zipcode, phone}, {where: {key_student_id: student_id}})
            } else {
                throw new Error('Not found student!')
            }
        })
    }

}

module.exports = CrudService