import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FORGOT_PASSWORD } from "../../graphql/mutation/user";

import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  useEffect(() => {
    if (email.trim().length > 1) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    forgotPassword({
      variables: {
        input: email,
      },
      onCompleted(data) {
        setLoading(false);
        setErrors({});
        setIsSuccess(true);
      },
      onError(error) {
        setErrors(error.graphQLErrors[0].extensions.errors);
        setLoading(false);
      },
    });
  };

  return (
    <Fragment>
      <div className="forgot-password">
        <Container>
          <Row>
            <Col lg={5} className="mx-auto">
              {!isSuccess && (
                <Form className="register-form" onSubmit={onSubmitHandler}>
                  <h2 className="mb-4">Forgot Password</h2>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter your email"
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
                  <div className="d-grid gap-2">
                    <Button
                      variant="teal"
                      type="submit"
                      disabled={!isValid || loading}
                    >
                      {!loading && "Send"}
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
              )}
              {isSuccess && (
                <Alert variant="success">
                  We sent a new password to your email address. Back{" "}
                  <Link to="/login">login</Link>
                </Alert>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
