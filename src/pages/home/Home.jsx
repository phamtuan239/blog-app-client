import { useQuery, useSubscription } from "@apollo/client";
import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Loading from "../../components/loading/Loading";
import Posts from "../../components/posts/Posts";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { GET_POSTS_PAGE } from "../../graphql/query/post";
import { postsState } from "../../state/post";
import { CREATED_POST } from "../../graphql/subscription/post";

import "./Home.scss";

const Home = () => {
  const [posts, setPosts] = useRecoilState(postsState);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loadPage, setLoadPage] = useState(false);

  const { data } = useQuery(GET_POSTS_PAGE, {
    variables: {
      input: {
        page: page,
        perPage: 6,
      },
    },
  });

  useSubscription(CREATED_POST, {
    onSubscriptionData({
      subscriptionData: {
        data: { createdPost },
      },
    }) {
      if (page === 1) {
        setPosts((pre) => {
          const clone = [...pre];
          clone.unshift(createdPost);
          return [...clone.slice(0, 4)];
        });
      }
    },
  });

  useEffect(() => {
    if (data) {
      setLoadPage(false);
      setPosts(data.postsPage.posts);
      setCount(data.postsPage.count);
    }
  }, [data]);

  const onChangePagination = (e, value) => {
    setPage(value);
    setLoadPage(true);
    window.scrollTo(500, 500);
  };

  return (
    <Fragment>
      <Header />
      <div className="main">
        <div className="home">
          <Container fluid>
            <Row>
              <Col lg={12} md={12} className="position-relative">
                {posts.length > 0 && !loadPage && <Posts posts={posts} />}
                {posts.length === 0 && loadPage && <Loading />}
                {loadPage && (
                  <Loading color={"#36D7B7"} loading={true} size={40} />
                )}
                {posts.length > 0 && !loadPage && (
                  <div className="pagination-bar">
                    <Pagination
                      count={count}
                      page={page}
                      onChange={onChangePagination}
                      variant="outlined"
                      shape="rounded"
                    />
                  </div>
                )}
                <Stack spacing={2}></Stack>
              </Col>
              {/* <Col lg={12} md={0}>
                <SideBar />
              </Col> */}
            </Row>
          </Container>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Home;
