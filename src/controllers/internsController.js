const mongoose = require('mongoose')
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internsModel')

const isValidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null)
     return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//---------------------------------------------------------------------------------------------------------------

const internCreate = async function (req, res) {

    try {
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request,do provide college details' })
        }
        let { name, mobile, email , CollegeName} = req.body
        // console.log(req.body)

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: `name is needed` })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is needed` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid one` })
            return
        }

        const isEmailAlreadyUsed = await internModel.findOne({ email });
         console.log(isEmailAlreadyUsed)

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address already registered` })
            return
        }
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: `Mobile is needed` })
            return
        }
        if (!(String(mobile).length === 10)) {
            res.status(400).send({ status: false, message: `given mobile:${mobile} is not valid 10 Digit number` })
            return
        }
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
            return res.status(400).send({
                status: false, message: `${mobile} is not a valid mobile number, Please provide a valid mobile number `,
            });
        }

        const isMobileAlreadyUsed = await internModel.findOne({ mobile });
         console.log(isMobileAlreadyUsed)
        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, message: `${mobile} this Mobile is already registered` })
            return
        }

         if (!isValid(CollegeName)) {
             res.status(400).send({ status: false, message: `CollegeName is required` })
             return
         }

        let collegeDetail = await collegeModel.findOne({ name: CollegeName, isDeleted: false });
        console.log(collegeDetail)
        if (!collegeDetail) return res.status(400).send({ status: false, msg: "No such college found" })
        let { _id } = collegeDetail;
         console.log(collegeDetail)
         console.log(_id )

        if (!isValid(_id)) {
            res.status(400).send({ status: false, message: 'College id is required' })
            return
        }

        if (!isValidObjectId(_id)) {
            res.status(400).send({ status: false, message: `${_id} is not a valid College Id` })
            return
        }

        req.body = _id
         console.log(_id)
        let savedIntern = await internModel.create(req.body)
        console.log(savedIntern)
        res.status(201).send({ status: true, data: savedIntern })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err })
    }
}

const getInterns = async function (req, res) {
    try {
        if (!isValid(req.query.CollegeName)) {
            res.status(400).send({ status: false, message: 'collegeName is not proper' })
            return
        }
        let collegeDetails = await collegeModel.findOne({ name: req.query.CollegeName, isDeleted: false })
        // console.log(collegeDetail)
        if (!collegeDetails) {
            res.status(400).send({ status: false, msg: "No college found " })
            return
        }

        let {  name, fullName, logoLink } = collegeDetails
        // console.log(collegeDetail)
        let allInterns = await internModel.find({ collegeId: _id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
         console.log(allInterns)
        if (allInterns.length === 0) return res.status(400).send({ status: false, msg: "no intern applied in this college" })

        let College = { name, fullName, logoLink, intrest: allInterns }
        // console.log(College)
        let doc = { data: College };
        // console.log(ans)

        if (doc) {
            res.status(200).send(doc)
        } else {
            res.status(400).send({ status: false, msg: "none has applied for this college" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}
module.exports = { internCreate, getInterns }