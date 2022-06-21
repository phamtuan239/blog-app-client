import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppoloProvider from "./AppoloProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <Router>
    <AppoloProvider>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </AppoloProvider>
  </Router>,
  document.getElementById("root")
);
