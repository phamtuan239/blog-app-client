import React, { Fragment } from "react";

const Permission = ({ children, userRole, roles }) => {
  const isPermission = roles.includes(userRole);
  return <Fragment>{isPermission && children}</Fragment>;
};

export default Permission;
