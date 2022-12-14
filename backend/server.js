const express = require("express");
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const app = express();
/* localhost:5000 */
const port = 5000;

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())

const apiRoutes = require("./routes/apiRoutes");

// 下面就是个middleware
app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});

// 下面这个是个测试，用来测试向数据库中添加，product-collection，及其数据
/* app.get("/", async (req, res, next) => {
    const Product = require("./models/ProductModel");
    try {
        const product = new Product();
        product.name = "New product name";
        const productSaved = await product.save();
        console.log(productSaved === product);
        const products = await Product.find();
        console.log(products.length);
        res.send("Product created" + product._id);
    } catch (er) {
        next(er);
    }
});
 */

// mongobd connection
const connectDB = require("./config/db");
const Product = require("./models/ProductModel");
connectDB();

app.use("/api", apiRoutes);

//自定义的middleware，来handle errors
app.use((error, req, res, next) => {
  /* 就是用env.NODE_ENV保护数据，如果黑客进来了，没有权限，也看不到error的消息 */
  if (process.env.NODE_ENV === "development") {
    //这个middleware仅仅showing the error in the console
    console.error(error);
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      // message and stack 给我们展示了error的path to the file
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    })
  }
});

// 我们不需要一个一个的写api的routes
/* app.get('/api/products', (req, res) => {
    res.send("Handling product routes.")
}) */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
