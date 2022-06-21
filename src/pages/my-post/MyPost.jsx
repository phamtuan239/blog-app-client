import { useQuery } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import AccessPage from "../../components/access/AccessPage";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Posts from "../../components/posts/Posts";
import TopBar from "../../components/topbar/TopBar";
import { GET_MY_POST } from "../../graphql/query/post";
import { myPostState } from "../../state/post";
import { userState } from "../../state/user";

import "./MyPost.scss";

const MyPost = () => {
  const [myPost, setMyPost] = useRecoilState(myPostState);
  const [isUser, setIsUser] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const user = useRecoilValue(userState);

  useQuery(GET_MY_POST, {
    variables: {
      input: user && user._id,
    },
    onCompleted(data) {
      if (data.myPost.length === 0) {
        setIsSuccess(true);
      } else if (myPost.length === 0) {
        setMyPost(data.myPost);
      }
      setIsUser(true);
    },
  });

  return (
    <AccessPage>
      <Fragment>
        <TopBar />
        <div className="main">
          {myPost.length > 0 && (
            <div>
              <Posts posts={myPost} isUser={isUser} />
            </div>
          )}
          {myPost.length === 0 && !isSuccess && <Loading />}
          {isSuccess && (
            <Container>
              <Row>
                <Col lg={12}>
                  <Alert variant="info">
                    <Alert.Heading>My Post Empty</Alert.Heading>
                    <p>
                      Create a new post <Link to="/write">here</Link>
                    </p>
                  </Alert>
                </Col>
              </Row>
            </Container>
          )}
        </div>
        <Footer />
      </Fragment>
    </AccessPage>
  );
};

export default MyPost;
