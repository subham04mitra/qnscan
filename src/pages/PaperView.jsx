import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
} from "mdb-react-ui-kit";

// PaperView defined outside
const PaperView = ({ paperId }) => {
  return <div>HELLO {paperId}</div>;
};

export default function CreatePaper() {
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState("P01");

  return (
    <MDBContainer fluid className="p-4">
      <MDBCard>
        <MDBCardBody>
          <MDBBtn
            onClick={() => {
              setSelectedPaperId("P01"); // Example paper ID
              setShowPaperModal(true);
            }}
          >
            Open Paper Modal
          </MDBBtn>

          <MDBModal
            show={showPaperModal}
            setShow={(val) => setShowPaperModal(val)}
            tabIndex="-1"
            centered
          >
            <MDBModalDialog size="lg" fullscreen="sm-down">
              <MDBModalContent>
                <MDBModalHeader>
                  <h5 className="modal-title">Exam Paper Preview</h5>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={() => setShowPaperModal(false)}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  {selectedPaperId && <PaperView paperId={selectedPaperId} />}
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
