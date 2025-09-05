import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBCardHeader } from "mdb-react-ui-kit";
import api from "../api/api";
import PaperView from "./PaperView";

const ViewMarks = () => {
  const [marks, setMarks] = useState([]);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
 useEffect(() => {
    api.get("/auth").then((res) => {
    });
  }, []);
  useEffect(() => {
    api.get("/get-marks").then((res) => {
      setMarks(res.data.data);
    });
  }, []);


  const columns = [
    { name: "Student Name", selector: (row) => row.paper_name, sortable: true },
    { name: "Student Roll No", selector: (row) => row.exam_name, sortable: true },
    { name: "Total Qs", selector: (row) => row.exam_type, sortable: true },
    { name: "Total Attempted", selector: (row) => row.user_name, sortable: true },
    { name: "Total Correct", selector: (row) => row.branch, sortable: true },
    { name: "Total Wrong", selector: (row) => row.tot_qs, sortable: true },
    { name: "Marks Obtained", selector: (row) => row.tot_mrks, sortable: true },
    { name: "Full marks", selector: (row) => row.parer_duration, sortable: true },
    
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
              <h4>Student Data</h4></MDBCardHeader>
      <DataTable
        columns={columns}
        data={marks}
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
