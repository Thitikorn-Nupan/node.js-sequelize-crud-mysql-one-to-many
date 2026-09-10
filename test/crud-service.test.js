/**
 //  got error is i use jest as name SyntaxError: Identifier 'jest' has already been declared
 // The error occurs because Jest injects a local wrapper variable named jest into your CommonJS module scope
 How to Fix It
 Rename your variable: Change any local declaration or import named jest to something else (e.g., const { jest: myJest } = require('@jest/globals')).
 Disable injected globals: Configure Jest to turn off global injections via injectGlobals: false in your Jest Documentation configuration if you prefer importing explicit globals.
 */
const {beforeEach, describe, expect, jest: commonJst, test} = require('@jest/globals');


// jest.fn() creates a mock function that records calls and can return test data.
const mockStudent = {
    hasMany: commonJst.fn(), // Student.hasMany(Location, {foreignKey: 'key_student_id'})
    findAll: commonJst.fn(),
    findByPk: commonJst.fn(),
    create: commonJst.fn(),
    update: commonJst.fn(),
    destroy: commonJst.fn()
}
const mockLocation = {
    belongsTo: commonJst.fn(), // Location.belongsTo(Student, {foreignKey: 'key_student_id', as: 'students'})
    findAll: commonJst.fn(),
    findByPk: commonJst.fn(),
    create: commonJst.fn(),
    update: commonJst.fn(),
    destroy: commonJst.fn()
}

commonJst.mock('../models/student', () => mockStudent)
commonJst.mock('../models/location', () => mockLocation)

const CrudService = require('../service/crud-service')
const crudService = new CrudService()

// students service logic
describe('jest unit test for crud-service.js -> students logic', () => {
    beforeEach(() => {
        commonJst.clearAllMocks()
    })

    test('reads students include locations', async () => {
        const students = [
            {
                student_id: 1,
                student_fullname: "John Doe",
                student_weight: 65.5,
                student_height: 177.05,
                student_grade: 10,
                currentdatetime: new Date(),
                locations: [
                    {
                        province: "Bangkok",
                        district: "Bang Bon",
                        zipcode: "10150",
                        phone: "0812345679",
                        key_student_id: 1
                    },
                    {
                        province: "Bangkok",
                        district: "Bang Na",
                        zipcode: "10260",
                        phone: "0812345678",
                        key_student_id: 1
                    }
                ]
            },
            {
                student_id: 2,
                student_fullname: "John Son",
                student_weight: 65.5,
                student_height: 175.0,
                student_grade: 10,
                currentdatetime: new Date(),
                locations: [
                    {
                        province: "Bangkok",
                        district: "Bang Bon",
                        zipcode: "10150",
                        phone: "0812345679",
                        key_student_id: 2
                    }
                ]
            }
        ]

        mockStudent.findAll.mockResolvedValue(students)

        await expect(crudService.readsTwoTables()).resolves.toBe(students)
        expect(mockStudent.findAll).toHaveBeenCalledWith({
            include:  mockLocation
        })
    })

    test('read student include locations', async () => {
        const student = {
            student_id: 2,
            student_fullname: "John Son",
            student_weight: 65.5,
            student_height: 175.0,
            student_grade: 10,
            currentdatetime: new Date(),
            locations: [
                {
                    province: "Bangkok",
                    district: "Bang Bon",
                    zipcode: "10150",
                    phone: "0812345679",
                    key_student_id: 2
                }
            ]
        }

        mockStudent.findByPk.mockResolvedValue(student)

        await expect(crudService.readTwoTablesById(2)).resolves.toBe(student)
        expect(mockStudent.findByPk).toHaveBeenCalledWith(
            2,
            {include:  mockLocation}
        ) // mock Student.findAll({include: Location})
    })

    test('creates a student with locations', async () => {
        const currentdatetime = new Date()
        const locations = [
            {
                province: "Bangkok",
                district: "Bang Bon",
                zipcode: "10150",
                phone: "0812345679"
            }
        ]
        const createdStudent = {
            student_id: 1,
            student_fullname: "John Doe",
            student_weight: 65.5,
            student_height: 177.05,
            student_grade: 10,
            currentdatetime,
            locations
        }

        mockStudent.create.mockResolvedValue(createdStudent)

        await expect(
            crudService.createTwoTables(
                "John Doe",
                65.5,
                177.05,
                10,
                currentdatetime,
                locations
            )
        ).resolves.toBe(createdStudent)
        expect(mockStudent.create).toHaveBeenCalledWith(
            {
                student_fullname: "John Doe",
                student_weight: 65.5,
                student_height: 177.05,
                student_grade: 10,
                currentdatetime,
                locations
            },
            {include: mockLocation}
        )
    })

    test('updates a student by id', async () => {
        const currentdatetime = new Date()
        mockStudent.update.mockResolvedValue([1])

        await expect(
            crudService.updateStudent(
                "John Updated",
                70.5,
                180.05,
                11,
                currentdatetime,
                1
            )
        ).resolves.toBeUndefined()
        expect(mockStudent.update).toHaveBeenCalledWith(
            {
                student_fullname: "John Updated",
                student_weight: 70.5,
                student_height: 180.05,
                student_grade: 11,
                currentdatetime
            },
            {where: {student_id: 1}}
        )
    })

    test('deletes a student after reading it by id', async () => {
        const student = {
            student_id: 1,
            destroy: commonJst.fn().mockResolvedValue(undefined)
        }

        mockStudent.findByPk.mockResolvedValue(student)

        await expect(crudService.deleteStudent(1)).resolves.toBeUndefined()
        expect(mockStudent.findByPk).toHaveBeenCalledWith(
            1,
            {include: mockLocation}
        )
        expect(student.destroy).toHaveBeenCalledTimes(1)
    })
})


// locations service logic
describe('jest unit test for crud-service.js -> locations logic', () => {
    beforeEach(() => {
        commonJst.clearAllMocks()
    })

    test('creates a location for an existing student', async () => {
        const student = {student_id: 1}

        mockStudent.findByPk.mockResolvedValue(student)
        mockLocation.create.mockResolvedValue({
            province: "Bangkok",
            district: "Bang Bon",
            zipcode: "10150",
            phone: "0812345679",
            key_student_id: 1
        })

        await expect(
            crudService.createLocationByIdStudent(
                "Bangkok",
                "Bang Bon",
                "10150",
                "0812345679",
                1
            )
        ).resolves.toBeUndefined()

        expect(mockStudent.findByPk).toHaveBeenCalledWith(1)
        expect(mockLocation.create).toHaveBeenCalledWith({
            province: "Bangkok",
            district: "Bang Bon",
            zipcode: "10150",
            phone: "0812345679",
            key_student_id: 1
        })
    })

    test('does not create a location when the student does not exist', async () => {
        mockStudent.findByPk.mockResolvedValue(null)

        await expect(
            crudService.createLocationByIdStudent(
                "Bangkok",
                "Bang Bon",
                "10150",
                "0812345679",
                1
            )
        ).rejects.toThrow('Not found student!')

        expect(mockLocation.create).not.toHaveBeenCalled()
    })

    test('reads all locations', async () => {
        const locations = [
            {
                province: "Bangkok",
                district: "Bang Bon",
                zipcode: "10150",
                phone: "0812345679",
                key_student_id: 1
            }
        ]

        mockLocation.findAll.mockResolvedValue(locations)

        await expect(crudService.readsLocation()).resolves.toBe(locations)
        expect(mockLocation.findAll).toHaveBeenCalledWith()
    })

    test('reads a location by phone', async () => {
        const location = {
            province: "Bangkok",
            district: "Bang Bon",
            zipcode: "10150",
            phone: "0812345679",
            key_student_id: 1
        }

        mockLocation.findByPk.mockResolvedValue(location)

        await expect(crudService.readLocation("0812345679")).resolves.toBe(location)
        expect(mockLocation.findByPk).toHaveBeenCalledWith("0812345679")
    })

    test('deletes all locations for an existing student', async () => {
        mockStudent.findByPk.mockResolvedValue({student_id: 2})
        mockLocation.destroy.mockResolvedValue([1])

        await expect(crudService.deletesLocation(2)).resolves.toBeUndefined()
        expect(mockStudent.findByPk).toHaveBeenCalledWith(2)
        expect(mockLocation.destroy).toHaveBeenCalledWith({
            where: {key_student_id: 2}
        })
    })

    test('does not delete locations when the student does not exist', async () => {
        mockStudent.findByPk.mockResolvedValue(null)

        await expect(crudService.deletesLocation(1)).rejects.toThrow('Not found student!')
        expect(mockLocation.destroy).not.toHaveBeenCalled()
    })

    test('deletes a location by phone when it exists', async () => {
        const location = {
            phone: "0812345679",
            destroy: commonJst.fn().mockResolvedValue(undefined)
        }
        mockLocation.findByPk.mockResolvedValue(location)

        await expect(crudService.deleteLocation("0812345679")).resolves.toBeUndefined()
        expect(mockLocation.findByPk).toHaveBeenCalledWith("0812345679")
        expect(location.destroy).toHaveBeenCalledTimes(1)
    })

    test('does not delete a location when the phone does not exist', async () => {
        mockLocation.findByPk.mockResolvedValue(null)

        await expect(crudService.deleteLocation("0812345679")).rejects.toThrow('Not found phone!')
    })

    test('updates locations for an existing student', async () => {
        mockStudent.findByPk.mockResolvedValue({student_id: 1})
        mockLocation.update.mockResolvedValue([1])

        await expect(
            crudService.updateLocation(
                "Nonthaburi",
                "Mueang",
                "11000",
                "0812345678",
                1
            )
        ).resolves.toBeUndefined()
        expect(mockStudent.findByPk).toHaveBeenCalledWith(1)
        expect(mockLocation.update).toHaveBeenCalledWith(
            {
                province: "Nonthaburi",
                district: "Mueang",
                zipcode: "11000",
                phone: "0812345678"
            },
            {where: {key_student_id: 1}}
        )
    })

    test('does not update locations when the student does not exist', async () => {
        mockStudent.findByPk.mockResolvedValue(null)

        await expect(
            crudService.updateLocation(
                "Nonthaburi",
                "Mueang",
                "11000",
                "0812345678",
                1
            )
        ).rejects.toThrow('Not found student!')
        expect(mockLocation.update).not.toHaveBeenCalled()
    })

})