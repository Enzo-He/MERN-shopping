const express = require("express")
const app = express()
const productRoutes = require("./productRoutes")
const categoryRoutes = require("./categoryRoutes")
const userRoutes = require("./userRoutes")
const orderRoutes = require("./orderRoutes")

// this is going to be handled by product routes, that we declared above the cleared and imported above
//用来整合上方，declared的以及imported
// 如果访问进来的url，是/products，则被下面的handle
app.use("/products", productRoutes)
app.use("/categories", categoryRoutes)
app.use("/users", userRoutes)
app.use("/orders", orderRoutes)

module.exports = app
