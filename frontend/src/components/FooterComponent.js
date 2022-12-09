import { Container, Row, Col } from "react-bootstrap";

const FooterComponent = () => {
  return (
    /* 在index.css里设置了footer的格式。 position：ab; bottom：0 etc. */
    <footer>
      <Container fluid>
        <Row className="mt-5">
          <Col className="bg-dark text-white text-center py-5">
            Copyright &copy; Best Online Shop
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;

