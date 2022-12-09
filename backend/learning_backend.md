# 启动backend  
1. npm init 回车，直到 entry point:(index.js)，在其后输入 server.js
2. 随后一直回车，直到结束。 会有package.json文件出现在backend的文件夹中
3. npm install express --save
<!-- dev means only for development environment -->
4. npm i nodemon --save-dev
    - npm uninstall nodemon
<!-- 开始listening on port 3000 -->
5. npx nodemon server.js
    - [copy past hello word example](https://expressjs.com/en/starter/hello-world.html)  
    - copy past "hello word example" into server.js  
6. create mongodb cluser, ----------> database access
    - nework access, Add IP Address, 这里我们用allow access from anywhere.
    - （点左边最上的database ---> browse collections）略过，这里不建立collections，后续的application里搞。
    - 点Connect --> connect your application  --> cpoy connection string
    - 再backend folder里建立一个新的文件： .env   在里面输入 MONGO_URI=xxxxx, 上面copy的string，并替换掉password，在？前添加想要的batabase的名字
7. npm install dotenv@^16.0.0 
    - 这个pack是用来，this package is used to read variables from env file in other parts of our code.
8. npm install mongoose@^6.2.1  
    - 建立一个config文件夹，里面建立 db.js 文件, 在db.js里写连接
9. Mockaroo 可以用这个网站，建立一个模拟数据库  
10. node seeder/seeder 运行seeder里的seeder.js 来添加dome data进database
11. npm install bcryptjs@^2.4.3  
    - 这个是用来加密密码的
12. 安装postman，去下载安装。这是个api调试软件
13. npm i express-fileupload@^1.3.1 
    - 因为express不能handle fault image uploading files，需要加装一个包支持
    - 安装之后，在server里写入新的包
    - POSTMAN -> body -> form-data -> key:images 右边选择files，不要选text -> upload images

# 一些解释
## 中英互译  
- square braces 中括号  
## req, res, next
```js
app.use((error, req, res, next) => {
    console.error(error);
    next(error)
})
```
- req :  request的缩写， 请求的数据。  
    Request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性。  
    我们常用req.body.xx来表示POST的xx属性。  
- res:   response的缩写， 响应的数据。  
    Response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。  
    我们常常用res.send() 传送HTTP响应 , res.render()渲染结果页面。  
- next 则是前往下一个中间件，执行相同路径的下一个方法。  
<br>

## exit(1)
```js
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connection SUCCESS")
    } catch (error) {
        console.error("MongoDB connection FAIL")
        process.exit(1);
        // 0 exit code means success, but 1 means that something went wrong and module exports connect
    }
}
```

## 一些status codes
    1xx informational response – the request was received, continuing process

    2xx successful – the request was successfully received, understood, and accepted

    3xx redirection – further action needs to be taken in order to complete the request

    4xx client error – the request contains bad syntax or cannot be fulfilled

    5xx server error – the server failed to fulfil an apparently valid request
    
[List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)  

## mongodb中比较级查询条件：（$lt $lte $gt $gte）（大于、小于）、查找条件  
- $lt    <   (less  than )

- $lte    <=  (less than  or equal to )

- $gt   >    （greater  than ）

- $gte   >=    (greater  than or   equal to)
[mongodb中比较级查询条件](https://blog.csdn.net/xiongzaiabc/article/details/81186998)  



