import { Modal, Spinner } from "react-bootstrap";
import React, { Fragment, useState } from "react";
import { Button } from "react-bootstrap";
import Post from "../post/Post";
import { DELETE_POSTS } from "../../graphql/mutation/post";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "@apollo/client";

import "./Posts.scss";

const Posts = ({ posts, isUser }) => {
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePosts] = useMutation(DELETE_POSTS);
  const onShowHandler = () => {
    document.body.classList.add("modal-open");
    setOpen(true);
  };

  const onCloseShowHandler = () => {
    document.body.classList.remove("modal-open");
    setOpen(false);
  };

  const toastError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const onChooseCardHandler = (postId) => {
    const clone = [...cards];
    if (clone.includes(postId)) {
      const index = clone.indexOf(postId);
      clone.splice(index, 1);
      setCards(clone);
    } else {
      clone.push(postId);
      setCards(clone);
    }
  };

  const displayPost = () => {
    if (posts && posts.length > 0) {
      return posts.map((post, key) => {
        return (
          <li key={key}>
            <Post
              index={key}
              post={post}
              isUser={isUser}
              onChooseCard={onChooseCardHandler}
            />
          </li>
        );
      });
    }
  };

  const displayModalDelete = () => {
    return (
      <Modal show={open} onHide={onCloseShowHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Posts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {cards.length} posts?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCloseShowHandler}
            disabled={deleting}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={onDeleteHandler}
            disabled={deleting}
          >
            {!deleting && "Delete"}
            {deleting && (
              <div>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Deleting...
              </div>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const onDeleteHandler = () => {
    setDeleting(true);
    deletePosts({
      variables: {
        input: cards,
      },
      onCompleted() {
        window.location.reload();
      },
      onError() {
        toastError("Can't delete posts");
        setDeleting(false);
      },
    });
  };

  return (
    <Fragment>
      <ToastContainer />
      {displayModalDelete()}
      {cards.length > 0 && (
        <div className="tool">
          <Button variant="danger" onClick={onShowHandler}>
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      )}
      <div className="posts">{displayPost()}</div>
    </Fragment>
  );
};

export default Posts;
