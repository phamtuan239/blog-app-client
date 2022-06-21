import React, { Fragment } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const ViewContactDashboard = ({ contact, onCloseViewContact }) => {
  return (
    <Fragment>
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <Form className="register-form">
              <h2>Contact</h2>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  readOnly={true}
                  value={contact && contact.name}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  readOnly={true}
                  value={contact && contact.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Content"
                  name="content"
                  style={{ height: "155px" }}
                  readOnly={true}
                  value={contact && contact.content}
                />
              </Form.Group>
              <Button variant="secondary" type="submit" onClick={onCloseViewContact}>
                Back
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ViewContactDashboard;
