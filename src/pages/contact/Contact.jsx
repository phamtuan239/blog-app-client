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
import Footer from "../../components/footer/Footer";
import TopBar from "../../components/topbar/TopBar";
import { CONTACT } from "../../graphql/mutation/user";

import "./Contact.scss";

const Contact = () => {
  const [contact] = useMutation(CONTACT);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [input, setInput] = useState({});

  useEffect(() => {
    if (input.name && input.email && input.content) {
      if (
        input.name.trim().length > 1 &&
        input.email.trim().length > 1 &&
        input.content.trim().length > 1
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [input.name, input.email, input.content, isValid]);

  const onChangeHandler = (e) => {
    setInput((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    e.preventDefault();
    setLoading(true);
    setErrors({});
    contact({
      variables: {
        input: input,
      },
      onCompleted(data) {
        setLoading(false);
        setErrors({});
        setInput({});
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
      <TopBar />
      <div className="main">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              {!isSuccess && (
                <Form className="register-form" onSubmit={onSubmitHandler}>
                  <h2>Contact</h2>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      disabled={loading}
                      isInvalid={errors.name}
                    />
                    {errors.name && (
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
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
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      onChange={onChangeHandler}
                      as="textarea"
                      placeholder="Content"
                      name="content"
                      disabled={loading}
                      isInvalid={errors.content}
                      style={{ height: "155px" }}
                    />
                    {errors.content && (
                      <Form.Control.Feedback type="invalid">
                        {errors.content}
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
                          Sending...
                        </div>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
              {isSuccess && (
                <Alert variant="success">
                  <Alert.Heading>Thanks your contact</Alert.Heading>
                  <p className="mb-0">
                    If you would like any further information, please don’t
                    hesitate to contact us.
                  </p>
                </Alert>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Contact;
