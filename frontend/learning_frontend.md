# 中英互译

indentation 缩进

1. 在 frontend folder 创建 create react app
   - npm install react@17.0.2 react-dom@17.0.2 --save
   - npx create-react-app frontend
   - npm install react-bootstrap@^2.2.1
   - npm install bootstrap@^5.1.3
   - npm install react-router-bootstrap@^0.26.0
   - npm install bootstrap-icons@^1.8.0
   <!-- star rating直接在npmjs上搜索react simple star rating -->
   - npm install react-simple-star-rating@^4.0.5
   - npm install js-image-zoom@^0.7.0
   <!-- 直接安装，不要版本信息 -->
   - npm install recharts
   <!-- 用来make api requests -->
   - npm i axios

- 如果是从 GitHub 上搞得，那就直接运行 npm install，会根据 package.json 来安装所有的 dependencies

# Route

```js
// path是路径，element是exported的component
<Route path="/" element={<HomePage />} />
```

<br>

## Outlet

An <Outlet> should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered. If the parent route matched exactly, it will render a child index route or nothing if there is no index route.
写入父元素中，可以渲染匹配的 child route。

```js
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="tasks" element={<DashboardTasks />} />
      </Route>
    </Routes>
  );
}
```

<br>

# protected pages

1. design which page need to be protected : admin, user etc.

```js
<Route element={<ProtectedRoutesComponent admin={false} />}>
  <Route path="/user" element={<UserProfilePage />} />
  <Route path="/user/my-orders" element={<UserOrdersPage />} />
  <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
  <Route path="/user/order-details" element={<UserOrderDetailsPage />} />
</Route>
```

2. 上面的 ProtectedRoutesComponent 是我们设规则的 page，然后 export it。

```js
import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";

// check if user logged in or not.
const ProtectedRoutesComponent = ({ admin }) => {
  if (admin) {
    let adminAuth = true;
    // Outlet指的是App.js里面，被ProtectedRoutesComponent包裹的所有route
    //如果logged in, 就转去要去的page，如果没有就转去login page
    return adminAuth ? <Outlet /> : <Navigate to="/login" />;
  } else {
    let userAuth = true;
    return userAuth ? (
      <>
        <UserChatComponent /> <Outlet />
      </>
    ) : (
      <Navigate to="/login" />
    );
  }
};

export default ProtectedRoutesComponent;
```

<br>

# components

## badge

bootstrap 里面的 badge 就是，购物车 cart 边上的小红点，显示物品数量

<br>

## chat box 一键切换图标

一个 input，label 里套 2 个图标，然后用 input 来改动显示

```html
<input type="checkbox" id="check" />
<label className="chat-btn" htmlFor="check">
  <i className="bi bi-chat-dots"></i>
  <i className="bi bi-x-circle"></i>
</label>
```

# bootstrap

## background color

[choose color in bootstrap](https://getbootstrap.com/docs/5.2/utilities/background/)  
<br>

## grid

Bootstrap provides 12 columns per row which is made available in the Column class.
Bootstrap 每个 column 设置了 12 个 colunms。可以用 md = 4, md = 8. 来分为 1：2

- .col- Extra Small ( < 576 px )
- .col-sm- Small ( >= 576 px )
- .col-md- Medium ( >= 768 px )
- .col-lg- Large ( >= 992 px )
- .col-xl- Extra Large ( >= 1200 px )

<br>

## spinner

spinner 就是 loading 转圈圈  
component -> spinner
<br>

## upload

upload 的表单格式，去 form control 里扒
<br>

# React 相关

## effect hook

useEffect 需要传递两个参数，第一个参数是逻辑处理函数，第二个参数是一个数组。

- 第二个参数存放变量，当数组存放变量发生改变时，第一个参数，逻辑处理函数将会被执行
- 第二个参数可以不传，不会报错，但浏览器会无线循环执行逻辑处理函数

```js
useEffect(() => {
  /* 执行逻辑 */
}, []);
```

[react effect hook](https://reactjs.org/docs/hooks-effect.html)  
[effect 详解](https://dengxi.blog.csdn.net/article/details/114107703?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-114107703-blog-116949480.t0_edu_mix&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-114107703-blog-116949480.t0_edu_mix&utm_relevant_index=1)

<br>

# 页面设计相关

## 产品展示页： productDetailsPage

![产品展示页](./learning.images/bootstrap%20grid%20md.jpg)

```js
import { Row, Col, Container } from "react-bootstrap";

const ProductDetailsPage = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col md={4}>Images</Col>
        <Col md={8}>
          <Row>
            <Col md={8}>product name, price, description, rating</Col>
            <Col md={4}>product status, quantity</Col>
          </Row>
          <Row>
            <Col className="mt-5">
              <h5>REVIEWS</h5>
            </Col>
          </Row>
          <hr />
          send review form
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailsPage;
```
