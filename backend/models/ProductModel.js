const mongoose = require("mongoose");
const Review = require("./ReviewModel");

const imageSchema = mongoose.Schema({
  path: { type: String, required: true },
});

// Product model仅仅for products，还需要 user 和 admin， review等等
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    reviewsNumber: {
      type: Number,
    },
    sales: {
      type: Number,
      default: 0,
    },
    // attrs: attributes, 这个网站里，有两个： color and ram
    attrs: [
      { key: { type: String }, value: { type: String } },
      // [{ key: "color", value: "red" }, { key: "size", value: "1 TB" }]
    ],
    images: [imageSchema],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Review,
      },
    ],
  },
  {
    // 自动加时间戳
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

//这里create一些新的indexes，可以让searching faster
/* 给定一个name and description。还有一个optional name
所以，当search something的时候，search engine will look in name fields and description field。
This is so called compound index.
This index will be used when we query for name and or description of the product.
This index will NOT be used when we only query description of the product. */
productSchema.index(
  // 会在productController里面，用$text 
  { name: "text", description: "text" },
  { name: "TextIndex" }
);
//如果要只用description搜索，我们需要设置新的index如下： ：1，one means a standard
// attrs:key 以及 attrs:value 我们在网页里有定义
productSchema.index({ "attrs.key": 1, "attrs.value": 1 });
// productSchema.index({name: -1});

/* 
Compound index example:

productSchema.index({ category: 1, name: 1 });

we can use such index if one query covers two fields, for example: find products from laptops category and sort by name,

other possibilities:

find products from laptops category

find products from laptops category and name is like "Dell"

ind products from laptops category and name is like "Dell" order by name desc

The above compound index will not be used for query on "name" field alone, for example "find products where name is like Dell". So we need a separate index for this.


Single field index example:

productSchema.index({ category: 1 });
productSchema.index({ name: 1 });
If we want to find only by category or name

*/

module.exports = Product;

// this model will be used for querying products collection to fetch something from products,
// fetch products from products collection, save product to the dtabase, delete and update.
