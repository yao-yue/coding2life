const penModel = require('../models/pen')

module.exports = {
    async showPenById(req,res, next) {
        // let {id} = req.query
        console.log(req.query)
        let result = await penModel.findPenById(2)
        res.send(result)
    },
    async showAllPen(req,res, next) {
        let result = await penModel.findAllPen()
        res.send(result)
    },
    async updatePen(req,res, next) {
        // pen {name,price,id}
        let result = await penModel.updatePen(pen)
        res.send(result)
    },
    async deletePen(req,res, next) {
        let result = await penModel.deletePen(id)
        res.send(result)
    },
    async addPen(req,res, next) {
        // pen{name,price}
        let pen = {
            name: '高级毛笔',
            price: '300.0'
        }
        let result = await penModel.addPenByObj(pen)
        res.send(result)
    },
}