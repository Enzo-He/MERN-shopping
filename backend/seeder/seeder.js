const connectDB = require("../config/db")
connectDB()

//把categories里面模拟的data，save进database
const categoryData = require("./categories")
const productData = require("./products");
const reviewData = require("./reviews")
const userData = require("./users")
const orderData = require("./orders")


//引用categoryModel的限制
const Category = require("../models/CategoryModel")
const Product = require("../models/ProductModel");
const Review = require("../models/ReviewModel")
const User = require("../models/UserModel")
const Order = require("../models/OrderModel")



const importData = async () => {
    try {
        // remove all existing indexes
        await Category.collection.dropIndexes()
        await Product.collection.dropIndexes();


        //delete所有的existing categories from category collection
        await Category.collection.deleteMany({})
        await Product.collection.deleteMany({});
        await Review.collection.deleteMany({})
        await User.collection.deleteMany({})
        await Order.collection.deleteMany({})

        //写入categoryData
        await Category.insertMany(categoryData)
        //下面几行的功能： Add Reviews Relationship To Products Collection
        //主要逻辑：从products arry里面调取review，然后返回新array
        //map products，然后在里面map reviews，就添加review进入products，最后返回新的products array,并写入数据库
        //这里并不是把实际的reviews添加入products，而是一些特定id
        const reviews = await Review.insertMany(reviewData)
        const sampleProducts = productData.map((product) =>{
            reviews.map((review) => {
                product.reviews.push(review._id)
            })
            return {...product}
        })
        await Product.insertMany(sampleProducts);
        await User.insertMany(userData)
        await Order.insertMany(orderData)

        console.log("Seeder data proceeded successfully")
        process.exit()
    } catch (error) {
        console.error("Error while proccessing seeder data", error)
        process.exit(1);
    }
}
importData()

// node seeder/seeder 运行seeder里的seeder.js 来添加dome data进database
 
