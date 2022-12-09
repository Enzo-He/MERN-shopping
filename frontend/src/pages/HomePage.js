import ProductCarouselComponent from "../components/ProductCarouselComponent";
import CategoryCardComponent from "../components/CategoryCardComponent";
import { Row, Container } from "react-bootstrap";

const HomePage = () => {
  const categories = [
    "Tablets",
    "Monitors",
    "Games",
    "Printers",
    "Software",
    "Cameras",
    "Books",
    "Videos",
    "XXXXX"
  ];

  return (
    <>
      <ProductCarouselComponent />

      {/* map一下card卡片，然后在cards里面找grid，copy style设置样式，然后再加个container */}
      {/* 此处map categories的名字， CategoryCardComponent里面map内容和图片*/}
      <Container>
        <Row xs={1} md={2} className="g-4 mt-5">
          {categories.map((category, idx) => (
            <CategoryCardComponent key={idx} category={category} idx={idx} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
