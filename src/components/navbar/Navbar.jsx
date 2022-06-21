import React, { useState, Fragment } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import { optionState, userState } from "../../state/user";
import { useRecoilValue } from "recoil";
import { Dropdown } from "react-bootstrap";
import { LOGOUT } from "../../graphql/mutation/user";
import { useMutation } from "@apollo/client";

import "./Navbar.scss";

function Navbar({ onOptions, Toast }) {
  const [sidebar, setSidebar] = useState(false);
  const user = useRecoilValue(userState);
  const [logout] = useMutation(LOGOUT);
  const navigate = useNavigate();
  const showSidebar = () => setSidebar(!sidebar);
  const option = useRecoilValue(optionState);


  const onLogoutHanler = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
    logout({
      onError(errors) {
        Toast.error("Error System", {
          position: "top-center",
          autoClose: 8000,
        });
      },
    });
  };

  const onBackHome = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-custom-navbar">
              <h6 className="mx-3">{user.role}</h6>
              <img className="topImg" src={user.profilePic} alt="profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <li className="link" onClick={onBackHome}>
                  HOME
                </li>
              </Dropdown.Item>
              <Dropdown.Item>
                <li className="link" onClick={onLogoutHanler}>
                  LOGOUT
                </li>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li
                  key={index}
                  className={
                    option === item.title.toLowerCase()
                      ? `${item.cName} isValid`
                      : item.cName
                  }
                >
                  <a href="/" onClick={(e) => onOptions(e, item.title)}>
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </Fragment>
  );
}

export default Navbar;
