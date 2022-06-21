import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../../graphql/mutation/post";
import { myPostState } from "../../state/post";
import { useRecoilState } from "recoil";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import "./Post.scss";

const Post = ({ index, post, isUser, onChooseCard }) => {
  let { _id, title, backgroundPic, createdAt, categories, createdBy } = post;
  const tags = ["tag-blue", "tag-yellow", "tag-red", "tag-green", "tag-teal"];
  const [show, setShow] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePost] = useMutation(DELETE_POST);
  const [myPost, setMyPost] = useRecoilState(myPostState);
  const navigate = useNavigate();

  createdAt = moment(new Date(parseInt(createdAt.toString()))).fromNow();

  const options = ["Update", "Delete"];

  const ITEM_HEIGHT = 48;

  //material icon
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    const { option } = e.currentTarget.dataset;
    switch (option) {
      case "Delete":
        onOpenHandler();
        setAnchorEl(null);
        break;
      case "Update":
        onNavigateUpdatePage();
        setAnchorEl(null);
        break;
      default:
        setAnchorEl(null);
    }
  };

  const toastError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const toastSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const displayCat = () => {
    if (categories.length > 0) {
      return categories.map((cat, key) => {
        return (
          <a href={"/posts-category/?cat=" + cat.name} key={key}>
            <span className={"tag " + tags[key]}>{cat.name}</span>
          </a>
        );
      });
    }
  };

  if (title.length > 80) {
    title = title.slice(0, 80) + "...";
  }

  const onOpenHandler = () => {
    document.body.classList.add("modal-open");
    setShow(true);
  };

  const onCloseHandler = () => {
    document.body.classList.remove("modal-open");
    setShow(false);
  };

  const displayDeleteModal = () => {
    return (
      <Modal show={show} onHide={onCloseHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCloseHandler}
            disabled={deleting}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={ondeleteHandler}
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

  const ondeleteHandler = () => {
    setDeleting(true);
    deletePost({
      variables: {
        input: _id,
      },
      onCompleted() {
        toastSuccess("Delete post successfully");
        let clone = [...myPost];
        clone = clone.filter((c) => c._id !== _id);
        setMyPost(clone);
        setDeleting(false);
        setShow(false);
      },
      onError() {
        toastError("Can't delete post");
        setDeleting(false);
      },
    });
  };

  const onNavigateUpdatePage = () => {
    navigate(`/update-my-post/${_id}`);
  };

  return (
    <div className="card">
      <ToastContainer />
      {displayDeleteModal()}
      <div className="card__header">
        <Link to={"/post/" + _id}>
          <img src={backgroundPic} alt="card__image" className="card__image" />
        </Link>
      </div>
      <div className="card__body">
        <div className="tag__container">{displayCat()}</div>
        <h5>{title}</h5>
      </div>
      <div className="card__footer">
        <div className="user">
          <div className="user__detail">
            <img
              src={createdBy && createdBy.profilePic}
              alt="user__image"
              className="user__image"
            />
            <div className="user__info">
              <h6 className="my-0">{createdBy && createdBy.username}</h6>
              <small>{createdAt}</small>
            </div>
          </div>
          {isUser && (
            <div className="user__controller">
              <Form.Group className="mt-2">
                <Form.Check type="checkbox" onClick={() => onChooseCard(_id)} />
              </Form.Group>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    data-option={option}
                    onClick={handleClose}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
