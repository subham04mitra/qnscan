import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  MDBBtn,
  MDBCol,
  MDBCardHeader,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import api from "../api/api";

const ViewMarks = () => {
  const [exam, setExam] = useState("");
  const [examType, setExamType] = useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [examMock, setExamMock] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [marksData, setMarksData] = useState([]);

  // fetch exam types
  useEffect(() => {
    api.get("/exam-type").then((res) => {
      setExamTypes(res.data.data);
    });
  }, []);

  // fetch exam names
  useEffect(() => {
    api.get("/exam-name").then((res) => {
      setExamMock(res.data.data);
    });
  }, []);

  // fetch papers when exam & examType selected
  useEffect(() => {
    if (exam && examType) {
      api
        .post("/get-paper-list-cnd", { exam, examType })
        .then((res) => {
          setPapers(res.data.data || []);
          setSelectedPaper("");
        })
        .catch(() => setPapers([]));
    }
  }, [exam, examType]);

  const handleSearch = () => {
    if (!selectedPaper) return;
    api
      .post("/get-marks", { paper_id: selectedPaper })
      .then((res) => setMarksData(res.data.data || []))
      .catch(() => setMarksData([]));
  };

  const columns = [
    { name: "Student Name", selector: (row) => row.student_name, sortable: true },
    { name: "Student Roll No", selector: (row) => row.student_roll, sortable: true },
    { name: "Total Qs", selector: (row) => row.tot_qs, sortable: true },
    { name: "Total Attempted", selector: (row) => row.tot_attm, sortable: true },
    { name: "Total Correct", selector: (row) => row.tot_crct, sortable: true },
    { name: "Total Wrong", selector: (row) => row.tot_wrng, sortable: true },
    { name: "Marks Obtained", selector: (row) => row.mrk_obtn, sortable: true },
    { name: "Full marks", selector: (row) => row.tot_marks, sortable: true },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "red",
        whiteSpace: "nowrap",
      },
    },
  };

  return (
    <>
      <MDBCardHeader className="text-center bg-secondary text-white">
        <h4>Student Data</h4>
      </MDBCardHeader>
      <br />

      <div className="row g-3">
        {/* Exam Dropdown */}
        <MDBCol md="2" sm="12">
          <MDBDropdown className="w-100">
            <MDBDropdownToggle  color="outline-primary" className="w-100 text-start">
              {exam ? examMock.find((e) => e.id === exam)?.name : "Select Exam"}
            </MDBDropdownToggle>
            <MDBDropdownMenu className="w-100">
              {examMock.map((type) => (
                <MDBDropdownItem
                  key={type.id}
                  link
                  onClick={() => setExam(type.id)}
                  className="d-flex flex-column"
                >
                  <span className="fw-bold">{type.name}</span>
                 
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>

        {/* Exam Type Dropdown */}
        <MDBCol md="2" sm="12">
          <MDBDropdown className="w-100">
            <MDBDropdownToggle color="outline-primary" className="w-100 text-start">
              {examType ? examTypes.find((e) => e.id === examType)?.name : "Select Exam Type"}
            </MDBDropdownToggle>
            <MDBDropdownMenu className="w-100">
              {examTypes.map((type) => (
                <MDBDropdownItem
                  key={type.id}
                  link
                  onClick={() => setExamType(type.id)}
                  className="d-flex flex-column"
                >
                  <span className="fw-bold">{type.name}</span>
                  
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>

        {/* Papers Dropdown */}
        <MDBCol md="6" sm="12">
          <MDBDropdown className="w-100">
            <MDBDropdownToggle color="outline-success" className="w-100 text-start">
              {selectedPaper
                ? papers.find((p) => p.paper_id === selectedPaper)?.paper_name
                : "Select Paper"}
            </MDBDropdownToggle>
            <MDBDropdownMenu className="w-100">
              {papers.map((p) => (
                <MDBDropdownItem
                  key={p.paper_id}
                  link
                  onClick={() => setSelectedPaper(p.paper_id)}
                  className="d-flex flex-column"
                >
                  <span className="fw-bold">
                    {p.paper_name} ({p.exam_date})
                  </span>
                  <small className="text-muted">
                    {p.user_name} • {p.branch} • {p.paper_id}
                  </small>
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>

        {/* Search Button */}
        <MDBCol md="2" sm="12">
          <MDBBtn onClick={handleSearch} disabled={!selectedPaper} className="w-100">
            Search
          </MDBBtn>
        </MDBCol>
      </div>

      <br />

      <DataTable
        columns={columns}
        data={marksData}
        pagination
        highlightOnHover
        striped
        responsive
        persistTableHead
        customStyles={customStyles}
      />
    </>
  );
};

export default ViewMarks;
