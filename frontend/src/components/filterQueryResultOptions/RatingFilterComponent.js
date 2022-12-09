import { Rating } from "react-simple-star-rating";
import { Form } from "react-bootstrap";
import { Fragment } from "react";

// npmjs, 搜索 react-simple-star-rating
const RatingFilterComponent = () => {
  return (
    <>
      <span className="fw-bold">Rating</span>
      {/* 建立5个empty */}
      {Array.from({ length: 5 }).map((_, idx) => (
        /* fragment整合children elements，设一个key */
        <Fragment key={idx}>
          {/* Form.check是在react bootstrap里，Forms => checks & Radios => Customizing FormCheck rendering */}
          <Form.Check type="checkbox" id={`check-api-${idx}`}>
            <Form.Check.Input type="checkbox" isValid />
            <Form.Check.Label style={{ cursor: "pointer" }}>
              {/* initialValue是star的星数，从5星开始到1星 */}
              <Rating readonly size={20} initialValue={5 - idx} />
            </Form.Check.Label>
          </Form.Check>
        </Fragment>
      ))}
    </>
  );
};

export default RatingFilterComponent;

