import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ACTIVE_ACCOUNT, REGISTER } from "../../graphql/mutation/user";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../utils/Toast";

import "./Register.scss";

const Register = () => {
  const [input, setInput] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(null);

  const [register] = useMutation(REGISTER);
  const [active] = useMutation(ACTIVE_ACCOUNT);
  const navigate = useNavigate();

  useEffect(() => {
    if (input.username && input.password && input.email) {
      if (
        input.username.trim().length > 1 &&
        input.password.trim().length > 1 &&
        input.email.trim().length > 1
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [input.email, input.username, input.password, isValid]);

  const onChangeHandler = (e) => {
    setInput((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    register({
      variables: {
        input: input,
      },
      onCompleted(data) {
        if (data.register) {
          setIsActive(true);
          Toast.success(
            "Register successful.Check your email to get code active account."
          );
        }
        setLoading(false);
        setErrors({});
        setInput({});
      },
      onError(error) {
        setErrors(error.graphQLErrors[0].extensions.errors);
        setLoading(false);
      },
    });
  };

  const onActiveSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    active({
      variables: {
        input: input.code,
      },
      onCompleted(data) {
        if (data.activeAccount) {
          navigate("/login");
        }
        setLoading(false);
        setIsValid(false);
        setErrors({});
        setInput({});
      },
      onError(error) {
        setErrors(error.graphQLErrors[0].extensions.errors);
        setLoading(false);
      },
    });
  };

  return (
    <div className="register">
      {!isActive && (
        <Container>
          <Row>
            <Col lg={5} className="mx-auto">
              <Form className="register-form" onSubmit={onSubmitHandler}>
                <h1>Register</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    onChange={onChangeHandler}
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    disabled={loading}
                    isInvalid={errors.username}
                  />
                  {errors.username && (
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    onChange={onChangeHandler}
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    disabled={loading}
                    isInvalid={errors.email}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    onChange={onChangeHandler}
                    type="password"
                    placeholder="Password"
                    name="password"
                    disabled={loading}
                    isInvalid={errors.password}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button
                    variant="teal"
                    type="submit"
                    disabled={!isValid || loading}
                  >
                    {!loading && "Save"}
                    {loading && (
                      <div>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Saving...
                      </div>
                    )}
                  </Button>
                  <div className="text-center">
                    <Link to="/login">You have an account? Login here.</Link>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
      {isActive && (
        <Container>
          <Row>
            <Col lg={5} className="mx-auto">
              <Form className="register-form" onSubmit={onActiveSubmit}>
                <h1>Active Account</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    onChange={onChangeHandler}
                    type="text"
                    placeholder="Enter code"
                    name="code"
                    disabled={loading}
                    isInvalid={errors.code}
                  />
                  {errors.code && (
                    <Form.Control.Feedback type="invalid">
                      {errors.code}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button
                    variant="teal"
                    type="submit"
                    disabled={!isValid || loading}
                  >
                    {!loading && "Active"}
                    {loading && (
                      <div>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Checking...
                      </div>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Register;
