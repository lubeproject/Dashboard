import React from "react";
import Header from "../header/Header";
import SideBar from "../sidebar/SideBar";
import { Outlet } from "react-router-dom";

export default function Portal() {
  return (
    <div>
      <Header />
      <div>
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}
