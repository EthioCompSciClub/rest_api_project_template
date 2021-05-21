const createError = require('http-errors')
const mongoose = require('mongoose')
const Product = require('../Models/Product.model')

module.exports = {
    getAllProducts: async (req, res, next)=>{
        try {
            const result = await Product.find(
                {}, 
                {
                    __v:0,
                    _id: 1
                }
            )
            res.send(result)
        } catch (error) {
            console.log(error.message)
            next(createError(404, error.message)) //i added this error message myself
        }
    }, 

    findProductById: async(req, res, next)=>{
        const id = req.params.id
        try {
            // const product = await Product.findById(id)
            const product = await Product.findOne({_id:id}, {_id:0, __v:0})
            if(!product){
                throw createError(404, "Product does not exist")
            }
            res.send(product)
        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.CastError){
                next(createError(404, "Invalid Product id"))
                return
            }
            next(error)
        }
    },

    createNewProduct: async (req, res, next)=>{
            
        try{
            const product = new Product(req.body)
            const result = await product.save()
            res.send(result)
        }catch(error){
            console.log(error.message)
            if(error.name == 'ValidationError'){
                next(createError(422, error.message))
                return
            }
            next(error)
        }
    
    },

    updateAProduct: async(req, res, next)=>{    
        try {
            const id = req.params.id
            const updates = req.body
            const options = {new:true} // return the new updated value, not the old document
    
            const result = await Product.findByIdAndUpdate(id, updates, options)
            if(!result){
                throw createError(404, "Product does not exist")
            }
            res.send(result)
        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.CastError){
                return next(createError(404, "Invalid Product ID"))
            }
        }
    }, 

    deleteAProduct: async (req, res, next)=>{
        const id = req.params.id
        try {
            const result = await Product.findByIdAndDelete(id)
            // const result = Product.findOneAndDelete({_id:id})
            if(!result){
                throw createError(404, "Product does not exist")
            }
            res.send(result)
        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.CastError){
                next(createError(404, "Invalid Product id"))
                return
            }
            next(error)
        }
    }
}