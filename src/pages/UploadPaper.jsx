import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBCardHeader,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";
import api from "../api/api";
import { toast } from "react-toastify";
import { RiAiGenerate2, RiDownload2Line } from "react-icons/ri";
import jsPDF from "jspdf";


const UploadPaper = () => {
  const [exam, setExam] = useState("");
  const [examType, setExamType] = useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [examMock, setExamMock] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [marksData, setMarksData] = useState(null);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAndGenerate = async () => {
    if (!file || !selectedPaper) {
      toast.error("Please select a paper and upload a file.");
      return;
    }

    try {
      setLoading(true);

      // Upload file first
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("File uploaded successfully!");

      // Now get marks data
      const res = await api.post("/get-marks", { paper_id: selectedPaper });
      setMarksData(res.data.data?.[0] || {});
      setShowModal(true);
    } catch (err) {
      toast.error("Error uploading file or fetching marks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Grade Calculator
  const getGrade = (marksObtained, totalMarks) => {
    const percent = (marksObtained / totalMarks) * 100;
    if (percent >= 90) return "A+";
    if (percent >= 75) return "A";
    if (percent >= 60) return "B";
    if (percent >= 45) return "C";
    return "D";
  };

  // Generate PDF Report
  // Generate PDF Report without autotable
const generateReportPDF = () => {
  if (!marksData) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yOffset = 20;

  // Logo + Institute Name
  const logoUrl = "https://t3.ftcdn.net/jpg/06/77/55/24/360_F_677552477_n4oAOK2rn5ZGf31QCigKrX38Mv2znhG9.jpg";
  doc.addImage(logoUrl, "PNG", 10, yOffset, 20, 20);

  doc.setFontSize(18);
  doc.text("Institute Name", pageWidth / 2, yOffset + 10, { align: "center" });
  yOffset += 20;

  doc.setFontSize(14);
  doc.text("Branch Name", pageWidth / 2, yOffset, { align: "center" });
  yOffset += 15;

  // Exam Info Box
  doc.setFontSize(12);
  doc.rect(10, yOffset, pageWidth - 20, 40);
  doc.text(`Exam: ${examMock.find((e) => e.id === exam)?.name || ""}`, 15, yOffset + 10);
  doc.text(`Exam Type: ${examTypes.find((e) => e.id === examType)?.name || ""}`, 15, yOffset + 20);
  doc.text(`Paper: ${papers.find((p) => p.paper_id === selectedPaper)?.paper_name || ""}`, 15, yOffset + 30);

  yOffset += 45;

  // Report Card Title
  doc.setFontSize(14);
  doc.text("Report Card", pageWidth / 2, yOffset, { align: "center" });
  yOffset += 12;

  // Student Info
  doc.setFontSize(12);
  doc.text(`Student Name: ${marksData.student_name}`, 15, yOffset);
  yOffset += 8;
  doc.text(`Roll No: ${marksData.student_roll}`, 15, yOffset);
  yOffset += 12;

  // Manual Table (Header + Data)
  const headers = ["Total Qs", "Attempted", "Correct", "Wrong", "Total Marks", "Marks Obtained", "Grade"];
  const values = [
    marksData.tot_qs,
    marksData.tot_attm || marksData.tot_attempt,
    marksData.tot_crct,
    marksData.tot_wrng,
    marksData.tot_marks,
    marksData.mrk_obtn,
    getGrade(marksData.mrk_obtn, marksData.tot_marks),
  ];

  const colWidth = (pageWidth - 15) / headers.length;
  const rowHeight = 10;
  let x = 10;

  // Draw header
  headers.forEach((h, i) => {
    doc.rect(x, yOffset, colWidth, rowHeight);
    doc.text(h, x + colWidth / 2, yOffset + 7, { align: "center" });
    x += colWidth;
  });

  // Draw values
  x = 10;
  yOffset += rowHeight;
  values.forEach((v, i) => {
    doc.rect(x, yOffset, colWidth, rowHeight);
    doc.text(String(v), x + colWidth / 2, yOffset + 7, { align: "center" });
    x += colWidth;
  });

  // Save File
  doc.save(`${marksData.student_name}_Report.pdf`);
};


  return (
    <>
      <MDBCardHeader className="text-center bg-secondary text-white">
        <h4>Scan OMR and Report Card Generation</h4>
      </MDBCardHeader>
      <br />

      <div className="row g-3">
        {/* Exam Dropdown */}
        <MDBCol md="2" sm="12">
          <MDBDropdown className="w-100">
            <MDBDropdownToggle color="outline-primary" className="w-100 text-start">
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
        <MDBCol md="4" sm="12">
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
      </div>

      {/* File Upload + Upload Button */}
      {selectedPaper && (
        <div className="row g-3 mt-3">
          <MDBCol md="6" sm="12">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="form-control"
              onChange={handleFileChange}
            />
          </MDBCol>
          <MDBCol md="2" sm="12">
            <MDBBtn onClick={handleUploadAndGenerate} disabled={!file || loading} className="w-100">
              <RiAiGenerate2 className="me-2" />
              {loading ? "Processing..." : "AI Scan"}
            </MDBBtn>
          </MDBCol>
        </div>
      )}

      {/* Modal to show marks summary */}
      <MDBModal open={showModal} tabIndex="-1" onClose={() => setShowModal(false)}>
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Report Card</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setShowModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {marksData ? (
                <div>
                  <p><strong>Exam ID:</strong> {selectedPaper}</p>
                  <p><strong>Student Name:</strong> {marksData.student_name}</p>
                  <p><strong>Roll No:</strong> {marksData.student_roll}</p>
                  <p><strong>Total Questions:</strong> {marksData.tot_qs}</p>
                  <p><strong>Total Attempted:</strong> {marksData.tot_attm || marksData.tot_attempt}</p>
                  <p><strong>Correct:</strong> {marksData.tot_crct}</p>
                  <p><strong>Wrong:</strong> {marksData.tot_wrng}</p>
                  <p><strong>Total Marks:</strong> {marksData.tot_marks}</p>
                  <p><strong>Marks Obtained:</strong> {marksData.mrk_obtn}</p>
                  <p><strong>Grade:</strong> {getGrade(marksData.mrk_obtn, marksData.tot_marks)}</p>
                </div>
              ) : (
                <p>No data available.</p>
              )}
            </MDBModalBody>

            {/* Footer with Download Button */}
            <div className="d-flex justify-content-end p-3">
              <MDBBtn color="success" onClick={generateReportPDF}>
                <RiDownload2Line className="me-2" />
                Download Report Card
              </MDBBtn>
            </div>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default UploadPaper;
