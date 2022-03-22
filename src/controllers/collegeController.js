const collegeModel = require('../models/collegeModel');

const isValidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) 
    return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
//----------------------------------------------------------------------------------------------------------

const collegeCreate = async function (req, res) {
    try {
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request,do provide college details' })
        }
        let { name, fullName, logoLink } = req.body
       // console.log(req.body)

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: `name is needed` })
            return
        }

        let Collegedata = await collegeModel.findOne({ name, isDeleted: false })
        console.log(Collegedata)
        if (Collegedata) return res.status(400).send({ status: false, msg: `${name} already present` })

        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: `fullName is needed` })
            return
        }
        let Collegefullname = await collegeModel.findOne({ fullName, isDeleted: false })
       // console.log(Collegefullname)
        if (Collegefullname) return res.status(400).send({ status: false, msg: `${fullName} already present` })

        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: `logoLink is required` })
            return
        }

        let CollegeLogo = await collegeModel.findOne({ logoLink, isDeleted: false })
        //console.log(CollegeLogo)
        if (CollegeLogo) return res.status(400).send({ status: false, msg: `${logoLink} already present` })

        if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))) {

            res.status(400).send({ status: false, message: `logoLink is invalid url` })
            return
        }

        let createdCollege = await collegeModel.create(req.body)
        res.status(201).send({ status: true, msg: "College creation Successfull", data: createdCollege })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err });
    }
}

module.exports = { collegeCreate }