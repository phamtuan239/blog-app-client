import React, { Fragment, useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import TopBar from "../../components/topbar/TopBar";
import { Container, Row, Col, Form, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { EDITOR_JS_TOOLS } from "../../utils/parse/constants";
import EdjsParser from "../../utils/parse/parse-editor-to-html";
import parse from "html-react-parser";
import Undo from "editorjs-undo";
import DragDrop from "editorjs-drag-drop";
import { useRecoilValue } from "recoil";
import { categoriesState } from "../../state/category";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_POST } from "../../graphql/mutation/post";
import { userState } from "../../state/user";
import EditorJS from "@editorjs/editorjs";
import { GET_POST } from "../../graphql/query/post";
import Loading from "../../components/loading/Loading";
import Footer from "../../components/footer/Footer";
import CardUser from "../../components/card-user/CardUser";
import AccessPage from "../../components/access/AccessPage";
import Toast from "../../utils/Toast";
import { Button } from 'react-bootstrap';

import "./UpdatePost.scss";

const UpdatePost = () => {
  const categories = useRecoilValue(categoriesState);
  const [backgroundPic, setBackgroundPic] = useState("./background.jpg");
  const [checkCategory, setCheckCategory] = useState([]);
  const [checkedCategory, setCheckedCategory] = useState([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("Your title...");
  const [publishing, setPublishing] = useState(false);
  const [content, setContent] = useState({});
  const [html, setHtml] = useState("");
  const [updatePost] = useMutation(UPDATE_POST);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [editor, setEditor] = useState(null);

  useQuery(GET_POST, {
    variables: { input: id },
    onCompleted(data) {
      if (data.post && data.post.content) {
        const clone = { ...data.post };
        setPost(clone);
      } else {
        Toast.error("Error System.Can't load post");
      }
    },
    onError() {
      navigate("/not-found");
    },
  });

  useEffect(() => {
    if (post) {
      setBackgroundPic(post.backgroundPic);
      setTitle(post.title);
      let clone = [...post.categories];
      clone = clone.map((c) => c._id);
      setCheckedCategory(clone);
      setCheckCategory(clone);
    }
  }, [post]);

  if (post) {
    if (!editor) {
      const content = post.content;
      setEditor(
        new EditorJS({
          holder: "editorjs",
          readOnly: false,
          tools: EDITOR_JS_TOOLS,
          data: {
            blocks: content.blocks,
          },
          version: "2.22.2",
        })
      );
    }
  }

  const handleReady = (editor) => {
    new Undo({ editor });
    new DragDrop({ editor });
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        855,
        400,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const displayCategories = () => {
    if (categories.length > 0 && checkedCategory.length > 0) {
      return categories.map((category, key) => {
        const checked = checkedCategory.includes(category._id);
        return (
          <Form.Check
            key={key}
            inline
            label={category.name}
            value={category._id}
            name="group1"
            type="checkbox"
            id={key}
            onClick={onCheckHandler}
            defaultChecked={checked}
          />
        );
      });
    }
  };

  const onChangeBackgroundHandler = async (e) => {
    const file = e.target.files[0];
    const types = ["image/jpeg", "image/jpg", "image/png"];
    if (file) {
      if (file.size > 3000000) {
        Toast.error("File size is bigger than 3MB");
        return;
      } else if (!types.includes(file.type)) {
        Toast.error("File not image");
        return;
      }
      try {
        const image = await resizeFile(file);
        setBackgroundPic(image);
      } catch (error) {
        Toast.error("Can't upload image");
      }
    }
  };

  const onCheckHandler = (e) => {
    let checkCategoryClone = [...checkCategory];
    if (checkCategoryClone.includes(e.target.value)) {
      const index = checkCategoryClone.indexOf(e.target.value);
      checkCategoryClone.splice(index, 1);
      setCheckCategory(checkCategoryClone);
    } else {
      checkCategoryClone.push(e.target.value);
      setCheckCategory(checkCategoryClone);
    }
  };

  const onPublisPostHandler = async (e) => {
    e.preventDefault();
    setPublishing(true);
    if (checkCategory.length === 0) {
      Toast.warning("Please choose at leat 1 category");
      setPublishing(false);
      return;
    } else if (checkCategory.length > 5) {
      Toast.warning("Each post max 5 categories");
      setPublishing(false);
      return;
    }
    const savedData = await editor.save();
    updatePost({
      variables: {
        input: {
          title: title,
          content: savedData,
          categories: checkCategory,
          backgroundPic: backgroundPic,
          userId: user._id,
          postId: post._id,
        },
      },
      onCompleted(data) {
        setPublishing(false);
        navigate(`/post/${data.updatePost}`);
        window.location.reload();
      },
      onError(err) {
        Toast.error("Error System. Can't publish post");
        setPublishing(false);
      },
    });
  };

  const onShowHandler = async () => {
    setShow(true);
    const savedData = await editor.save();
    const parseHtml = new EdjsParser();
    const htmlParser = parseHtml.parse(savedData);
    setContent(savedData);
    setHtml(htmlParser);
  };

  const displayViewDemo = () => {
    return (
      <Modal
        className="view-demo"
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Demo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col lg={9} className="mx-auto text-center">
                <img
                  className="writeImg"
                  src={backgroundPic}
                  alt="background post"
                />
                {post && (
                  <CardUser user={post.createdBy} createdAt={post.createdAt} />
                )}
                <h2 className="writeInput">{title}</h2>
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="mx-auto">
                {parse(html)}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <AccessPage>
      <Fragment>
        <TopBar />
        {displayViewDemo()}
        <div className="main">
          <div className="update-post">
            {post && (
              <Container className="px-4">
                <Row>
                  <Col lg={9} className="mx-auto px-0 mt-5 position-relative">
                    <img
                      className="writeImg"
                      src={backgroundPic}
                      alt="background post"
                    />
                    <CardUser
                      user={post.createdBy}
                      createdAt={post.createdAt}
                    />
                    <form className="form-upload-background">
                      <label htmlFor="fileInput">
                        <i className="writeIcon fas fa-plus"></i>
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={onChangeBackgroundHandler}
                      />
                    </form>
                  </Col>
                </Row>
                <Row>
                  <Col lg={9} className="mx-auto px-0">
                    <div className="write">
                      <form className="writeForm">
                        <div className="writeFormGroup">
                          <input
                            className="writeInput text-center"
                            placeholder="Title"
                            value={title}
                            type="text"
                            autoFocus={true}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={8} className="mx-auto px-0">
                    <div id="editorjs"></div>
                    <Form className="py-5 form-publish">
                      <Form.Group className="form-publish-checkbox">
                        {displayCategories()}
                      </Form.Group>
                      <Form.Group className="form-publish-button mt-3">
                        <Button
                          variant="teal"
                          type="button"
                          className="mx-3"
                          onClick={onShowHandler}
                          disabled={publishing}
                        >
                          View Demo
                        </Button>
                        <Button
                          variant="teal"
                          type="submit"
                          onClick={onPublisPostHandler}
                          disabled={publishing}
                        >
                          {!publishing && "Update"}
                          {publishing && (
                            <div>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Updating...
                            </div>
                          )}
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </Container>
            )}
            {!post && <Loading />}
          </div>
        </div>
      </Fragment>
      <Footer />
    </AccessPage>
  );
};

export default UpdatePost;
