import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBCardHeader } from "mdb-react-ui-kit";
import api from "../api/api";
import PaperView from "./PaperView";

const ViewPapers = () => {
  const [papers, setPapers] = useState([]);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    api.get("/get-paper-list").then((res) => {
      setPapers(res.data.data);
    });
  }, []);

  const handleView = (row) => {
    setSelectedRow(row);   // ✅ store the full row
    setShowPaperModal(true);
  };

  const columns = [
    { name: "Paper Name", selector: (row) => row.paper_name, sortable: true },
    { name: "Exam Name", selector: (row) => row.exam_name, sortable: true },
    { name: "Exam Type", selector: (row) => row.exam_type, sortable: true },
    { name: "User", selector: (row) => row.user_name, sortable: true },
    { name: "Branch", selector: (row) => row.branch, sortable: true },
    { name: "Total Qs", selector: (row) => row.tot_qs, sortable: true },
    { name: "Marks", selector: (row) => row.tot_mrks, sortable: true },
    { name: "Duration", selector: (row) => row.parer_duration, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <MDBBtn size="sm" onClick={() => handleView(row)}>
          View
        </MDBBtn>
      ),
    },
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
              <h4>Paper List</h4></MDBCardHeader>
      <DataTable
        columns={columns}
        data={papers}
        pagination
        highlightOnHover
        striped
        responsive
        persistTableHead
        customStyles={customStyles}
      />

      <MDBModal open={showPaperModal} staticBackdrop={false} onClose={() => setShowPaperModal(false)} tabIndex="-1">
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>View the Paper</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setShowPaperModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {selectedRow && (
                <PaperView
                  paperId={selectedRow.paper_id}
                  subject={selectedRow.subject}
                  chapter={selectedRow.chapter}
                  topic={selectedRow.topic}
                />
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default ViewPapers;
