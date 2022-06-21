import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import Permission from "../../../components/permission/Permission";
import { UPDATE_USER_FROM_ROLE } from "../../../graphql/mutation/role";
import { userState } from "../../../state/user";

const UpdateUserDashboard = ({
  userProfile,
  onCancelUpdate,
  onUpdateSuccess,
  Toast,
}) => {
  const [username, setUsername] = useState(userProfile && userProfile.username);
  const [email, setEmail] = useState(userProfile && userProfile.email);
  const [isActive, setIsActive] = useState(userProfile && userProfile.isActive);
  const [role, setRole] = useState(userProfile && userProfile.role);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [updateUserFromRole] = useMutation(UPDATE_USER_FROM_ROLE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (username.trim().length > 1 && email.trim().length > 1) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [username, email]);

  const onUpdateHandler = (e) => {
    e.preventDefault();
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const isActiveParse = isActive === "false" ? false : true;
    userProfile = {
      ...userProfile,
      username: username,
      email: email,
      isActive: isActiveParse,
      role: role,
    };
    delete userProfile.__typename;
    updateUserFromRole({
      variables: {
        input: userProfile,
      },
      onCompleted(data) {
        setLoading(false);
        setErrors({});
        onUpdateSuccess(data.userUpdateFromRoleInput);
      },
      onError(error) {
        setLoading(false);
        setErrors(error.graphQLErrors[0].extensions.errors);
      },
    });
  };

  if (errors.system) {
    Toast.error("Error system can't update user");
  }

  return (
    <Fragment>
      <Container>
        <Row>
          <Col lg={5} className="mx-auto my-5">
            <Form className="form-update" onSubmit={onUpdateHandler}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={true}
                  disabled={loading}
                />
              </Form.Group>
              {userProfile && !userProfile.passportId && (
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                    disabled={loading}
                    isInvalid={errors.email}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="active">Active</Form.Label>
                <Form.Select
                  id="active"
                  onChange={(e) => setIsActive(e.target.value)}
                  disabled={loading}
                  value={isActive}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Disabled</option>
                </Form.Select>
              </Form.Group>
              <Permission userRole={user && user.role} roles={["manager"]}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="role">Role</Form.Label>
                  <Form.Select
                    id="role"
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    value={role}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                  </Form.Select>
                </Form.Group>
              </Permission>
              <Button
                variant="secondary"
                type="submit"
                onClick={onCancelUpdate}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="mx-2"
                variant="teal"
                type="submit"
                disabled={!isValid || loading}
              >
                {!loading && "Update"}
                {loading && (
                  <div>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Handling...
                  </div>
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default UpdateUserDashboard;
