import { useQuery } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/topbar/TopBar";
import { GET_POST } from "../../graphql/query/post";
import parse from "html-react-parser";
import { Col, Container, Row } from "react-bootstrap";
import EdjsParser from "../../utils/parse/parse-editor-to-html";
import Loading from "../../components/loading/Loading";
import Footer from "../../components/footer/Footer";
import CardUser from "../../components/card-user/CardUser";
import Toast from "../../utils/Toast";

import './Single.scss';

const Single = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { id } = useParams();

  const { loading } = useQuery(GET_POST, {
    variables: { input: id },
    onCompleted(data) {
      if (data.post && data.post.content){
        const clone = {...data.post};
        setPost(clone);
      } else {
        Toast.error("Error System.Can't load post");
      }
    },
    onError() {
      navigate("/not-found");
    },
  });

  const displayPost = () => {
    if (post) {
      const parseHtml = new EdjsParser();
      const htmlParser = parseHtml.parse(post.content);
      return (
        <Fragment>
          <Row className="mt-5">
            <Col lg={9} className="mx-auto text-center">
              <img
                className="writeImg"
                src={post.backgroundPic}
                alt="background post"
              />
              <CardUser user={post.createdBy} createdAt={post.createdAt} />
              <h1 className="writeInput">{post.title}</h1>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mx-auto">
              {parse(htmlParser)}
            </Col>
          </Row>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <TopBar />
      <div className="single">
        {loading && <Loading />}
        <Container>{displayPost()}</Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Single;
