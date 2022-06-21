import { useQuery } from "@apollo/client";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Posts from "../../components/posts/Posts";
import TopBar from "../../components/topbar/TopBar";
import { GET_POST_CATEGORY } from "../../graphql/query/post";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { searchState } from "../../state/post";
import { useRecoilState } from "recoil";

import "./Search.scss";

const SearchCategory = () => {
  const [search, setSearch] = useRecoilState(searchState);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loadPage, setLoadPage] = useState(false);

  const { data } = useQuery(GET_POST_CATEGORY, {
    variables: {
      input: {
        page: page,
        perPage: 6,
        cat: searchParams.get("cat").trim(),
      },
    },
    onError() {
      navigate("/not-found");
    },
  });

  useEffect(() => {
    if (data) {
      setLoadPage(false);
      setSearch(data.postCategory.posts);
      setCount(data.postCategory.count);
    }
  }, [data]);

  const onChangePagination = (e, value) => {
    setPage(value);
    setLoadPage(true);
    window.scrollTo(0, 0);
  };

  return (
    <Fragment>
      <TopBar />
      <div className="main">
        {search.length > 0 && !loadPage && (
          <div>
            <Posts posts={search} />
          </div>
        )}
        {search.length === 0 && <Loading />}
        {loadPage && <Loading color={"#36D7B7"} loading={true} size={40} />}
        {search.length > 0 && !loadPage && (
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
      </div>
      <Footer />
    </Fragment>
  );
};

export default SearchCategory;
