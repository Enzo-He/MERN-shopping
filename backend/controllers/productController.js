const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    let query = {};
    let queryCondition = false

    let priceQueryCondition = {};
    // 如果query price存在，就pass小于等于XXX
    if (req.query.price) {
      queryCondition = true;
      // Mongodb比较查询： $lt < ； $lte <= ; $gt > ; $gte >=
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }

    let ratingQueryCondition = {};
    if (req.query.rating) {
      queryCondition = true;
      // $in 范围内 $nin $ne != not equal
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }

    let categoryQueryCondition = {}
    const categoryName = req.params.categoryName || ""
    //100章，从all下拉栏选择categories并search
    if (categoryName) {
      queryCondition = true
      // 用, 去replace所有的/
      let a = categoryName.replaceAll(",", "/")
      // for searching，需要 regular expression
      var regEx = new RegExp("^" + a)
      categoryQueryCondition = { category: regEx }
    }
    // 在filter里选择category然后search
    if (req.query.category) {
      queryCondition = true
      // let 一个 array
      let a = req.query.category.split(",").map((item) => {
        if (item) return new RegExp("^" + item)
      })
      categoryQueryCondition = {
        category: { $in: a }
      }
    }
    let attrsQueryCondition = [];
    if (req.query.attrs) {
      // attrs=RAM-1TB-2TB-4TB,color-blue-red
      // [ 'RAM-1TB-4TB', 'color-blue', '' ] 这里需要 turn this string into such larray
      // RAM 是key，1TB 4TB是values
      attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
        if (item) {
          let a = item.split("-");
          let values = [...a];
          values.shift(); // removes first item
          let a1 = {
            // a[0] 是key，RAM or Color
            attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
          };
          acc.push(a1);
          // console.dir(acc, { depth: null })
          return acc;
        } else return acc;
      }, []);
      //   console.dir(attrsQueryCondition, { depth: null });
      queryCondition = true;
    }


    //pagination
    // 如果pageNum不exist，就assign 1 to page Number
    const pageNum = Number(req.query.pageNum) || 1;

    // sort by name, price etc.
    let sort = {}
    // sortOption request query sort or empty string 
    const sortOption = req.query.sort || ""
    if (sortOption) {
      // 在Ftend的sortoptioncomponent里，设置了XXX_1，来进行排序，所以此处调用并更改， overwrite it
      let sortOpt = sortOption.split("_")
      sort = { [sortOpt[0]]: Number(sortOpt[1]) }
    }

    const searchQuery = req.params.searchQuery || ""
    let searchQueryCondition = {}
    let select = {}
    if (searchQuery) {
      queryCondition = true
      // 在productModel里面靠下面，把name和description 设了text，所以此处用$text会faster
      searchQueryCondition = { $text: { $search: searchQuery } }
      // score代表与 检索关键字 的匹配值，并设置按照score的高低排列
      select = {
        score: { $meta: "textScore" }
      }
      sort = { score: { $meta: "textScore" } }
    }

    if (queryCondition) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoryQueryCondition,
          searchQueryCondition,
          ...attrsQueryCondition
        ],
      };
    }


    // name:1 一指的是 ascending order。 -1指descending order
    // 后面的limit（1）是：only one product fetched from the database. and this limit will be needed for pagination.
    // recordsPerPager 在config里有设置数字，就是每页显示几个product
    // 下面的skip（2）是指，first 2 records were skipped,然后算一下每个page显示的东西
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select(select)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);

    //  Math.ceil (x) 返回不小于x的最接近的整数
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error)
  }
};


const getProductById = async (req, res, next) => {
  try {
    // populate("reviews") 就把reviews展开了，并不仅仅显示reviews的ID
    const product = await Product.findById(req.params.id).populate("reviews").orFail()
    res.json(product)
  } catch (err) {
    next(err)
  }
}

const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $sort: { category: 1, sales: -1 } },
      { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
      { $replaceWith: "$doc_with_max_sales" },
      { $match: { sales: { $gt: 0 } } },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
      { $limit: 3 }
    ])
    res.json(products)
  } catch (err) {
    next(err)
  }
}

const adminGetProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ category: 1 })
      .select("name price category");
    return res.json(products)
  } catch (err) {
    next(err);
  }
};

const adminDeleteProduct = async (req, res, next) => {
  try {
      const product = await Product.findById(req.params.id).orFail()
      await product.remove()
      res.json({ message: "product removed" })
  } catch(err) {
      next(err)
  }
}

const adminCreateProduct = async(req, res, next) => {
  try {
      const product = new Product()
      const { name, description, count, price, category,attributesTable  } = req.body
      product.name = name
      product.description = description
      product.count = count
      product.price = price
      product.category = category
      if( attributesTable.length > 0 ) {
          attributesTable.map((item) => {
              product.attrs.push(item)
          })
      }
      await product.save()

      res.json({
          message: "product created",
          productId: product._id
      })
  } catch(err) {
      next(err)
  }
}

const adminUpdateProduct = async (req, res, next) => {
  try {
     const product = await Product.findById(req.params.id).orFail()
     const { name, description, count, price, category, attributesTable } = req.body
     // || or 如果name from request body is empty， then product name the same value
     product.name = name || product.name
     product.description = description || product.description 
     product.count = count || product.count
     product.price = price || product.price
     product.category = category || product.category
     if( attributesTable.length > 0 ) {
         product.attrs = []
         attributesTable.map((item) => {
             product.attrs.push(item)
         })
     } else {
         product.attrs = []
     }
     await product.save()
     res.json({
        message: "product updated" 
     })
  } catch(err) {
      next(err)
  }
}

const adminUpload = async (req, res, next) => {
  try {
    // 如果nothing in req.files ；  ！！非空判断
      if(!req.files || !! req.files.images === false) {
          return res.status(400).send("No files were uploaded.")
      }
      if (Array.isArray(req.files.images)) {
          res.send("You sent " + req.files.images.length + " images")
      } else {
          res.send("You sent only one image")
      }
  } catch(err) {
      next(err)
  }
}

module.exports = { getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload };



