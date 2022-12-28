import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const RegisterPageComponent = ({ registerUserApiRequest,
  reduxDispatch,
  setReduxUserState, }) => {
  //去react bootstrap里面找，form => validation 抄一个
  const [validated, setValidated] = useState(false);
  const [registerUserResponseState, setRegisterUserResponseState] = useState({
    /* 这个是spinner，如果是loading：false了，那就不显示spinner */
    success: "",
    error: "",
    loading: false,
  });

  const [passwordsMatchState, setPasswordsMatchState] = useState(true);

  //const一个function去检测，确认密码是否匹配原始密码
  const onChange = () => {
    const password = document.querySelector("input[name=password]");
    const confirmPassword = document.querySelector("input[name=confirmPassword]");
    if (confirmPassword.value === password.value) {
      setPasswordsMatchState(true);
    } else {
      setPasswordsMatchState(false);

    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const email = form.email.value;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const password = form.password.value;
    /* 下面是一些form里面的判定 validation的判定 */
    if (event.currentTarget.checkValidity() === true && email && password && name && lastName &&
      form.password.value === form.confirmPassword.value) {
      /* 点击submit了之后，判定validity，如果form里面的东西都是true了，那loading true。后面会用这个state操作spinner */
      setRegisterUserResponseState({ loading: true });
      registerUserApiRequest(name, lastName, email, password)
        .then((data) => {
          /* 如果data success了，那就set spinner false */
          setRegisterUserResponseState({
            success: data.success,
            loading: false,
          });
          reduxDispatch(setReduxUserState(data.userCreated));

        })
        // incase some error写一个catch error的function
        .catch((er) =>
          setRegisterUserResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Your last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your last name"
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
              <Form.Control.Feedback type="invalid">
                Please anter a valid email address
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={onChange}
                /* 判断一下两个passwords是不是全等，不是的话，就是isInvalid 是 false。 */
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Please anter a valid password
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Password should have at least 6 characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                required
                type="password"
                placeholder="Repeat Password"
                minLength={6}
                onChange={onChange}
              />
              <Form.Control.Feedback type="invalid">
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="pb-2">
              <Col>
                Do you have an account already?
                <Link to={"/login"}> Login </Link>
              </Col>
            </Row>

            <Button type="submit">
            {registerUserResponseState &&
              registerUserResponseState.loading === true ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                ""
              )}
              Submit
            </Button>
            {/* 在user controller里面handle了user exists 以及 user created */}
            <Alert show={registerUserResponseState && registerUserResponseState.error === "user exists"} variant="danger">
              User with that email already exists!
            </Alert>
            <Alert show={registerUserResponseState && registerUserResponseState.success === "User created"} variant="info">
              User created
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPageComponent;

