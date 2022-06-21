import React, { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";

import "./Footer.scss";

const Footer = () => {
  return (
    <Fragment>
      <footer>
        <Container>
          <Row>
            <Col className="text-center py-3">
              Copyright © 2022 Blog App Inc. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;
