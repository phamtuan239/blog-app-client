import React from "react";
import TopBar from "../topbar/TopBar";
import './Header.scss';

const Header = () => {
  return (
    <div>
      <TopBar />  
      <div className="header">
        <div className="headerTitles">
          <span className="headerTitleSm">Dev & Storys</span>
          <span className="headerTitleLg">BLOG</span>
        </div>
        <img
          className="headerImg"
          src="./background.jpg"
          alt="background"
        />
      </div>
    </div>
  );
};

export default Header;
