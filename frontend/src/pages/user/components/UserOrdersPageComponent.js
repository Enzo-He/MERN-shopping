import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import "./sortTable";

const UserOrdersPageComponent = ({ getOrders }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((orders) => setOrders(orders))
      .catch((er) => console.log(er));
  }, []);

  return (
    <Row className="m-5">
      <Col md={12}>
        <h1>My Orders</h1>
        <table id="sorttable" className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Total</th>
              <th>Delivered</th>
              <th>Order details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.orderTotal.cartSubtotal}</td>
                <td>
                  {order.isDelivered ? (
                    <i className="bi bi-check-lg text-success"></i>
                  ) : (
                    <i className="bi bi-x-lg text-danger"></i>
                  )}
                </td>
                <td>
                  <Link to={`/user/order-details/${order._id}`}>
                    go to order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default UserOrdersPageComponent;
