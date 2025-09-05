import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { decodeToken, getToken } from "../utils/jwtUtils";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaUserTie,
  FaChalkboardTeacher,
  FaFileAlt,
  FaRegCheckCircle,
  FaUniversity,
} from "react-icons/fa"; // Added icons
import api from "../api/api";

export default function Profile() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userName = userData?.user_name;
  const userMobile = userData?.user_mobile;
  const userEmail = userData?.user_email;
  const userInst = userData?.user_inst;
  const userBranch = userData?.user_branch;

  const [role, setRole] = useState(null);
  const [dashdata, setDashdata] = useState({});

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role);
    }
  }, []);
useEffect(() => {
    api.get("/dash").then((res) => {
      setDashdata(res.data.data);
    });
  }, []);
  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#ffffffff" }}
    >
      <MDBContainer fluid className="py-5">
        <MDBRow className="justify-content-center">
        <MDBCol size="12" md="8" lg="12" xl="5" className="d-flex justify-content-center">
  <MDBCard
    style={{
      borderRadius: "15px",
      width: "100%",
      maxWidth: "1000px", // expanded for large screens
    }}
    className="shadow-sm mx-auto"
  >
    <MDBCardBody className="text-center">
      <MDBCardHeader className="text-center bg-secondary text-white">
              <h4>User Profile</h4></MDBCardHeader>
      {/* Avatar */}
      <div className="mt-3 mb-4">
        <MDBCardImage
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQb8PA2bjbFplCkJw2701CPASZmNCZP4hBJg&s"
          className="rounded-circle"
          fluid
          style={{ width: "110px" }}
        />
      </div>

      {/* Name + Role */}
      <MDBTypography tag="h4" className="d-flex align-items-center justify-content-center">
        <FaUser className="me-2 text-primary" />
        {userName}
      </MDBTypography>
      <MDBCardText className="text-muted mb-1">
        <strong>Role:</strong> {role || "Not Available"}
      </MDBCardText>

      {/* Institute + Branch */}
      <MDBCardText className="text-muted mb-4">
        {userInst} <span className="mx-2">|</span> <a href="#!">{userBranch}</a>
      </MDBCardText>

      {/* Contact Info */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-center mb-2">
          <FaPhoneAlt className="me-2 text-success" />
          <span className="mx-2">{userMobile || "Not Provided"}</span> |  <FaEnvelope className="me-2 text-danger mx-2" />
          <span className="mx-2">{userEmail || "Not Provided"}</span>
        </div>
       
      </div>

      {/* Button */}
      <MDBBtn rounded size="lg">
        Update Profile
      </MDBBtn>

      {/* Stats Section */}
    {/* Stats Section */}
<div className="d-flex flex-wrap justify-content-center text-center mt-5 mb-2">
  {/* Teacher Count (only for ADMIN & OWNER) */}
  {(role === "ADMIN" || role === "OWNER") && (
    <div className="flex-fill p-2" style={{ minWidth: "150px" }}>
      <MDBCardText className="mb-1 h5">{dashdata?.tot_teacher||0}</MDBCardText>
      <MDBCardText className="small text-muted mb-0 d-flex justify-content-center align-items-center">
        <FaChalkboardTeacher className="me-1 text-primary" />
        Teacher Count
      </MDBCardText>
    </div>
  )}

  {/* Papers Generated (for all roles) */}
  {(role === "ADMIN" || role === "OWNER" || role === "TEACHER") && (
    <div className="flex-fill p-2" style={{ minWidth: "150px" }}>
      <MDBCardText className="mb-1 h5">{dashdata?.tot_paper||0}</MDBCardText>
      <MDBCardText className="small text-muted mb-0 d-flex justify-content-center align-items-center">
        <FaFileAlt className="me-1 text-success" />
        Papers Generated
      </MDBCardText>
    </div>
  )}

  {/* OMR Sheet Scanned (for all roles) */}
  {(role === "ADMIN" || role === "OWNER" || role === "TEACHER") && (
    <div className="flex-fill p-2" style={{ minWidth: "150px" }}>
      <MDBCardText className="mb-1 h5">{dashdata?.tot_scan||0}</MDBCardText>
      <MDBCardText className="small text-muted mb-0 d-flex justify-content-center align-items-center">
        <FaRegCheckCircle className="me-1 text-warning" />
        OMR Sheet Scanned
      </MDBCardText>
    </div>
  )}

  {/* Branch Count (only for ADMIN) */}
  {role === "ADMIN" && (
    <div className="flex-fill p-2" style={{ minWidth: "150px" }}>
      <MDBCardText className="mb-1 h5">{dashdata?.tot_branch||0}</MDBCardText>
      <MDBCardText className="small text-muted mb-0 d-flex justify-content-center align-items-center">
        <FaUniversity className="me-1 text-danger" />
        Branch Count
      </MDBCardText>
    </div>
  )}
</div>

    </MDBCardBody>
  </MDBCard>
</MDBCol>

        </MDBRow>
      </MDBContainer>
    </div>
  );
}
