import React, { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user";

import "./Access.scss";

const AccessComponent = ({ children, type }) => {
  const user = useRecoilValue(userState);
  const { isLogin, authType } = type;
  const displayComponent = () => {
    if (isLogin !== undefined) {
      return (
        <Fragment>
          {user && isLogin && children}
          {!user && !isLogin && children}
        </Fragment>
      );
    } else if(authType !== undefined) {
      return <Fragment>{user && user.authType === 0 && children}</Fragment>;
    }
  };
  return <Fragment>{displayComponent()}</Fragment>;
};

export default AccessComponent;
