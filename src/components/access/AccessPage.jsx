import React, { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user";

import "./Access.scss";

const AccessPage = ({ children, roles }) => {
  const user = useRecoilValue(userState);

  const templateAlert = (title, message) => {
    return (
      <div className="container-fluid access-denided-page my-0 py-0">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="alert-access-denied">
              <img src="/access-denied.png" alt="access denided" />
              <h1>{title}</h1>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onOpenHandler = () => {
    document.body.classList.add("modal-open");
  };

  const onCloseHandler = () => {
    document.body.classList.remove("modal-open");
  };

  return (
    <Fragment>
      <Fragment>
        {!user &&
          templateAlert("ACCESS DENIDED", "Please login to access pages.")}
        {user &&
          roles &&
          !roles.includes(user.role) &&
          templateAlert(
            "ACCESS DENIDED",
            "Your account is not permitted to access this page."
          )}
        {user && roles && roles.includes(user.role) && children}
        {user && !roles && children}
      </Fragment>
    </Fragment>
  );
};

export default AccessPage;
