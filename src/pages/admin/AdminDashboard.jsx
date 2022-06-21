import React from "react";
import { Fragment } from "react";
import AccessPage from "../../components/access/AccessPage";
import Navbar from "../../components/navbar/Navbar";
import UsersDashboard from "./users/UsersDashboard";
import Toast from "../../utils/Toast";
import ContactDashboard from "./contacts/ContactDashboard";
import { useRecoilState } from "recoil";
import { optionState } from "../../state/user";

import "./Admin.scss";

const AdminDashboard = () => {
  const [option, setOption] = useRecoilState(optionState);
  const localStorageOption = localStorage.getItem("option");

  if (!localStorageOption) {
    localStorage.setItem("option", "users");
    setOption(localStorage.getItem("option"));
  } else {
    setOption(localStorageOption);
  }

  const onOptionsHandler = (e, option) => {
    e.preventDefault();
    setOption(option.toLowerCase());
    localStorage.setItem("option", option.toLowerCase());
  };

  return (
    <Fragment>
      <AccessPage roles={["admin", "manager"]}>
        <Navbar onOptions={onOptionsHandler} Toast={Toast} />
        {option === "users" && <UsersDashboard Toast={Toast} />}
        {option === "posts" && "Posts"}
        {option === "contacts" && <ContactDashboard Toast={Toast} />}
      </AccessPage>
    </Fragment>
  );
};

export default AdminDashboard;
