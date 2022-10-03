import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import App from "./App";

 if (
   localStorage.getItem("username") !== null ||
   localStorage.getItem("fullnames") !== null
 ) {
    ReactDOM.render(
     <BrowserRouter>
       <App
         username={localStorage.getItem("username")}
         fullnames={localStorage.getItem("fullname")}
       />
     </BrowserRouter>,
     document.getElementById("root")
   );
 } else {
    ReactDOM.render(<Login />, document.getElementById("root"));
 }
