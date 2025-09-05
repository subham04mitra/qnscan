import React, { useState, useEffect } from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import jsPDF from "jspdf";
import api from "../api/api";

const ExamPaperViewer = ({ paperId }) => {
  const [examData, setExamData] = useState(null);

  
 useEffect(() => {
  if (!paperId) return; // only fetch if paperId exists

  const fetchPaper = async () => {
    try {
      const res = await api.post("/get-paper", { paper_id: paperId });
      setExamData(res.data.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPaper();
}, [paperId]);

 const generatePDF = () => {
  if (!examData) return;

  const exam = examData;

  if (!exam || !exam.inst_name || !exam.questions) {
    console.error("Exam data is incomplete", exam);
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height; // height of A4 page
  let yOffset = 20;
  let count = 0;

  // Header
  doc.setFontSize(16);
  doc.text(`${exam.inst_name || ""} - ${exam.branch_name || ""}`, 10, yOffset);
  yOffset += 8;
  doc.setFontSize(14);
  doc.text(`${exam.examName || ""} (${exam.examType || ""})`, 10, yOffset);
  yOffset += 8;
  doc.text(`Exam: ${exam.exam || ""}`, 10, yOffset);
  yOffset += 8;
  doc.text(`Date: ${exam.examDate || ""}`, 10, yOffset);
  yOffset += 8;
  doc.text(`Duration: ${exam.duration || ""}`, 10, yOffset);
  yOffset += 8;
  doc.text(
    `Total Questions: ${exam.totalQs || ""}, Total Marks: ${exam.totalMarks || ""}`,
    10,
    yOffset
  );

  yOffset += 12;

  // Loop questions
  exam.questions.forEach((question, idx) => {
    // Check page break
    if (yOffset > pageHeight - 20) {
      doc.addPage();
      yOffset = 20; // reset to top margin
    }

    doc.setFontSize(12);
    doc.text(`${count + 1}. ${question.text || ""}`, 10, yOffset);
    yOffset += 6;

    question.options?.forEach((opt) => {
      // Again check page break before writing option
      if (yOffset > pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(`${opt.label || ""}. ${opt.text || ""}`, 15, yOffset);
      yOffset += 6;
    });

    yOffset += 4; // space between questions
    count++;
  });

  doc.save(`${exam.examName || "exam"}.pdf`);
};


  if (!examData) return <p>Loading exam data...</p>;

  return (
    <div>
      <h3>{examData.examName}</h3>
      <p>Type: {examData.examType}</p>
      <p>Date: {examData.examDate}</p>
      <p>Duration: 90 Mins</p>
      <MDBBtn onClick={generatePDF}>Download Exam PDF</MDBBtn>
    </div>
  );
};

export default ExamPaperViewer;
