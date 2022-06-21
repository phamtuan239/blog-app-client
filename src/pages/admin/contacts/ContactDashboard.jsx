import { useMutation, useQuery } from "@apollo/client";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
  Modal,
} from "react-bootstrap";
import { GET_CONTACTS } from "../../../graphql/query/role";
import moment from "moment";
import { Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import ViewContactDashboard from "./ViewContactDashboard";
import { DELETE_CONTACT } from "../../../graphql/mutation/role";

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);
  const [count, setCount] = useState(0);
  const [isView, setIsView] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [options, setOptions] = useState({
    keyword: "",
    filter: {
      role: "all",
    },
    pagination: {
      page: 1,
      perpage: 5,
    },
    refresh: 0,
  });

  const { data, loading } = useQuery(GET_CONTACTS, {
    variables: {
      options: options,
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT);

  useEffect(() => {
    if (data) {
      setContacts(data.contacts.contacts);
      setCount(data.contacts.count);
    }
  }, [data]);

  const loadContactsTable = (contacts) => {
    if (contacts.length > 0) {
      return contacts.map((contact, key) => {
        const createdAt = moment(
          new Date(parseInt(contact.createdAt.toString()))
        ).format("MMM Do YY");
        const content =
          contact.content.length > 100
            ? contact.content.slice(0, 40) + "..."
            : contact.content;
        return (
          <Fragment key={key}>
            <tr className="tr-user-dashboard">
              <td>{key + 1}</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{content}</td>
              <td>{contact.replied ? "done" : "not done"}</td>
              <td>{createdAt}</td>
              <td className="text-center">
                <Button
                  variant="success"
                  onClick={() => displayViewContact(contact._id)}
                >
                  <i className="fas fa-eye"></i>
                </Button>
              </td>
              <td className="text-center">
                <Button variant="info">
                  <i className="fas fa-comment-dots"></i>
                </Button>
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleShow(contact._id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          </Fragment>
        );
      });
    }
  };

  const displayContacts = () => {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col lg={12} className="mx-auto mt-3">
              <Form className="form-filter-user">
                <Form.Group className="form-filter-user-group">
                  <Form.Label>
                    <h6>Search</h6>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email or name"
                    // onChange={onSearchHandler}
                  />
                </Form.Group>
              </Form>
              {!loading && (
                <div className="TableContainer">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Content</th>
                        <th>Replied</th>
                        <th>Day</th>
                        <th className="text-center">Detail</th>
                        <th className="text-center">Reply</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>{loadContactsTable(contacts)}</tbody>
                  </Table>
                </div>
              )}
              {loading && <Spinner animation="border" variant="info" />}
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  };

  const handleClose = () => {
    setShow(false);
    setId("");
  };

  const handleShow = (_id) => {
    setShow(true);
    setId(_id);
  };

  const displayModal = () => {
    return (
      <Fragment>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete this contact?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={deleting}
            >
              Close
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={deleting}
              onClick={onDeleteContact}
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
      </Fragment>
    );
  };

  const onDeleteContact = () => {
    setDeleting(true);
    deleteContact({
      variables: {
        input: id,
      },
      onCompleted() {
        setDeleting(false);
        setShow(false);
        onRefresh();
      },
      onError() {
        setDeleting(false);
        setShow(false);
      },
    });
  };

  const displayViewContact = (_id) => {
    const result = contacts.find((contact) => contact._id === _id);
    if (result) {
      setIsView(true);
      setContact(result);
    }
  };

  const onCloseViewContact = () => {
    setIsView(false);
    setContact(null);
  };

  const onChangePagination = (e, value) => {
    setOptions((pre) => {
      return {
        ...pre,
        pagination: {
          perpage: 5,
          page: value,
        },
      };
    });
  };

  const onRefresh = () => {
    const num = Math.floor(Math.random() * 10000);
    setOptions((pre) => {
      return {
        ...pre,
        keyword: "",
        filter: {
          role: "all",
        },
        pagination: {
          page: 1,
          perpage: 5,
        },
        refresh: num,
      };
    });
  };

  return (
    <Fragment>
      {displayModal()}
      <Fragment>
        {!isView && <Fragment>{displayContacts()} </Fragment>}
        {isView && (
          <ViewContactDashboard
            contact={contact}
            onCloseViewContact={onCloseViewContact}
          />
        )}
      </Fragment>
      {!loading && !isView && (
        <div className="pagination-bar">
          <Pagination
            count={count}
            page={options.pagination.page}
            onChange={onChangePagination}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}
      <Stack spacing={2}></Stack>
    </Fragment>
  );
};

export default ContactDashboard;
