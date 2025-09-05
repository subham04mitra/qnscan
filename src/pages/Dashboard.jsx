import React, { useEffect, useState } from "react";
import { decodeToken, getToken } from "../utils/jwtUtils";
import api from "../api/api";




function Dashboard() {
  const [dashdata, setDashdata] = useState({});
  useEffect(() => {
    api.get("/dash").then((res) => {
      setDashdata(res.data.data);
    });
  }, []);
  return (
    <div style={{marginLeft:"20px"}}>
      <h1>Dashboard</h1>
      <p>TEACHER: {dashdata?.tot_teacher}</p>
      <p>PAPER: {dashdata?.tot_paper}</p>
      <p>BRANCH: {dashdata?.tot_branch}</p>
      <p>QUESTION: {dashdata?.tot_ques}</p>
      <p>SCAN: {dashdata?.tot_scan}</p>
    </div>
  );
}

export default Dashboard;
