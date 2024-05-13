import logo from '../../assets/logo.svg';
import './App.css';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserInfoForm from "../UserInfoForm/UserInfoForm";
import Home from "../Home/Home";

function App() {
  return (
    <>
    <h1>Retirement Planner</h1>
    <BrowserRouter>
    <Routes>
        <Route exact path="/home" element={<Home />}/> {/* 👈 Renders at /#/app/... */}
        <Route exact path="/user_info" element={<UserInfoForm />}/> {/* 👈 Renders at /#/app/... */}
      </Routes>
    </BrowserRouter>

    </>
    
  );
}

export default App;
