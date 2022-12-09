import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";

const ProductForListComponent = ({ images, idx }) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <Row>
        <Col lg={5}>
          <Card.Img
            variant="top"
            /* 在上面加入{images， idx} 来遍历从ProductListPage传进来的image array */
            /* "/images/"是文件夹位置，+images[idx]传来的games，monitors，tablets，再+"-category.png"
                就是一个完整的src路线：{/images/games-category.png} */
            src={"/images/" + images[idx] + "-category.png"}
          />
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>Product Name Lorem ipsum dolor sit amet</Card.Title>
            <Card.Text>
              Product Description Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Magni ipsa ducimus architecto explicabo id
              accusantium nihil exercitationem autem porro esse.
            </Card.Text>
            <Card.Text>
              {/* {5} /> (1) 5是5星，1是后面几个人评论 */}
              <Rating readonly size={20} initialValue={5} /> (1)
            </Card.Text>
            <Card.Text className="h4">
              {/* $124 后面加个空格，分开和button的距离 */}
              $124 {" "}
              <LinkContainer to="/product-details">
                <Button variant="danger">See product</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForListComponent;
