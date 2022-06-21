import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import TopBar from "../../components/topbar/TopBar";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState } from "../../state/user";
import { useMutation } from "@apollo/client";
import {
  UPDATE_INFO,
  UPDATE_PASSWORD,
  UPLOAD_PROFILE_PIC,
} from "../../graphql/mutation/user";
import Resizer from "react-image-file-resizer";
import FadeLoader from "react-spinners/FadeLoader";
import Footer from "../../components/footer/Footer";
import AccessComponent from "../../components/access/AccessComponent";
import AccessPage from "../../components/access/AccessPage";
import Toast from "../../utils/Toast";

import "./Setting.scss";

const Setting = () => {
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingPsw, setUpdatingPsw] = useState(false);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [passwdInput, setPasswdInput] = useState({});
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState({});
  const [user, setUser] = useRecoilState(userState);
  const [profilePic, setProfilePic] = useState("");
  const [uploadProfilePic] = useMutation(UPLOAD_PROFILE_PIC);
  const [updateInfo] = useMutation(UPDATE_INFO);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);

  useEffect(() => {
    if (user) {
      setProfilePic(user.profilePic);
      setInfo({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const onChangePasswordHandler = (e) => {
    setPasswdInput((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };

  const onChangeFileHandler = async (e) => {
    const file = e.target.files[0];
    const types = ["image/jpeg", "image/jpg", "image/png"];
    if (file) {
      if (file.size > 2000000) {
        Toast.error("File size is bigger than 2MB");
        return;
      } else if (!types.includes(file.type)) {
        Toast.error("File not image");
        return;
      }
      try {
        const image = await resizeFile(file);
        setUploading(true);
        uploadProfilePic({
          variables: {
            input: {
              image,
              profilePic,
            },
          },
          onCompleted(data) {
            setProfilePic(data.uploadProfilePic.url);
            setUser((...pre) => {
              return { ...pre, profilePic: image };
            });
            setUploading(false);
            Toast.success("Upload profile picture successful");
          },
          onError() {
            Toast.error("Error System.Can't not upload file");
            setUploading(false);
          },
        });
      } catch (error) {
        Toast.error("Error System.Can't not upload file");
        setUploading(false);
      }
    }
  };

  const onUpdateInfoHandler = (e) => {
    e.preventDefault();
    setUpdating(true);
    setIsUpdateInfo(false);
    setErrors({});
    updateInfo({
      variables: {
        input: info,
      },
      onCompleted(data) {
        Toast.success("Successfully updated");
        setUser((pre) => {
          return {
            ...pre,
            username: data.updateInfo.username,
            email: data.updateInfo.email,
          };
        });
        setUpdating(false);
      },
      onError(error) {
        setErrors(error.graphQLErrors[0].extensions.errors);
        setUpdating(false);
      },
    });
  };

  const onUpdatePasswordHandler = (e) => {
    e.preventDefault();
    setUpdatingPsw(true);
    setIsUpdatePassword(false);
    setErrors({});
    updatePassword({
      variables: {
        input: passwdInput,
      },
      onCompleted(data) {
        Toast.success("Successfully updated");
        setPasswdInput({
          password: "",
          newPassword: "",
        });
        setErrors({});
        setUpdatingPsw(false);
      },
      onError(error) {
        setErrors(error.graphQLErrors[0].extensions.errors);
        setUpdatingPsw(false);
        setIsUpdatePassword(true);
      },
    });
  };

  const onIsUpdateInfo = () => {
    if (!isUpdateInfo) {
      setIsUpdateInfo(true);
      return;
    }
  };

  const onIsNotUpdateInfo = () => {
    if (isUpdateInfo) {
      setIsUpdateInfo(false);
      return;
    }
  };

  const onIsUpdatePassword = () => {
    if (!isUpdatePassword) {
      setIsUpdatePassword(true);
      return;
    }
  };

  const onIsNotUpdatePassword = () => {
    if (isUpdatePassword) {
      setIsUpdatePassword(false);
      return;
    }
  };

  return (
    <AccessPage>
      <Fragment>
        <TopBar />
        <div className="main">
          <Container>
            <Row>
              <Col lg={9} className="mx-auto">
                <div className="settings">
                  <div className="settingsWrapper">
                    <div className="settingsTitle">
                      <span className="settingsTitleUpdate">
                        Update Your Info
                      </span>
                      {/* <span className="settingsTitleDelete">Delete Account</span> */}
                    </div>
                    <Form>
                      <label>Profile Picture</label>
                      <div className="settingsPP">
                        {uploading && (
                          <div className="profile-loading">
                            <FadeLoader
                              color={"#000000"}
                              loading={uploading}
                              size={10}
                            />
                          </div>
                        )}
                        {!uploading && <img src={profilePic} alt="profile" />}
                        <label htmlFor="fileInput">
                          <i className="settingsPPIcon far fa-user-circle"></i>{" "}
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          style={{ display: "none" }}
                          className="settingsPPInput"
                          onChange={onChangeFileHandler}
                        />
                      </div>
                    </Form>
                    <Form
                      onSubmit={onUpdateInfoHandler}
                      onMouseEnter={onIsUpdateInfo}
                      onMouseLeave={onIsNotUpdateInfo}
                    >
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          name="username"
                          required
                          value={info.username}
                          onChange={(e) =>
                            setInfo({ ...info, username: e.target.value })
                          }
                          disabled={!isUpdateInfo}
                          isInvalid={errors.username}
                        />
                         {errors.username && (
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          required
                          value={info.email}
                          onChange={(e) =>
                            setInfo({ ...info, email: e.target.value })
                          }
                          disabled={!isUpdateInfo}
                          isInvalid={errors.email}
                        />
                        {errors.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <Button
                        className="mx-auto"
                        variant="teal"
                        type="submit"
                        disabled={!isUpdateInfo}
                      >
                        {!updating && "Save"}
                        {updating && (
                          <div>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </div>
                        )}
                      </Button>
                    </Form>
                    <AccessComponent type={{ authType: true }}>
                      <Form
                        className="my-4"
                        onSubmit={onUpdatePasswordHandler}
                        onMouseEnter={onIsUpdatePassword}
                        onMouseLeave={onIsNotUpdatePassword}
                      >
                        <span className="settingsTitleUpdate">
                          Update Your Pasword
                        </span>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Your Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Your Password"
                            name="password"
                            value={passwdInput.password}
                            required
                            onChange={onChangePasswordHandler}
                            disabled={!isUpdatePassword}
                            isInvalid={errors.password}
                          />
                          {errors.password && (
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            value={passwdInput.newPassword}
                            required
                            onChange={onChangePasswordHandler}
                            disabled={!isUpdatePassword}
                            isInvalid={errors.newPassword}
                          />
                          {errors.newPassword && (
                            <Form.Control.Feedback type="invalid">
                              {errors.newPassword}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Button
                          variant="teal"
                          type="submit"
                          disabled={!isUpdatePassword}
                        >
                          {!updatingPsw && "Save"}
                          {updatingPsw && (
                            <div>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Saving...
                            </div>
                          )}
                        </Button>
                      </Form>
                    </AccessComponent>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </Fragment>
    </AccessPage>
  );
};

export default Setting;
