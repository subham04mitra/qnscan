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
      setExamData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPaper();
}, [paperId]);

  const generatePDF = () => {
    if (!examData) return;

    const exam = examData;

    if (!exam || !exam.inst_name || !exam.topics) {
      console.error("Exam data is incomplete", exam);
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text(`${exam.inst_name || ""} - ${exam.branch_name || ""}`, 10, 10);
    doc.setFontSize(14);
    doc.text(`${exam.examName || ""} (${exam.examType || ""})`, 10, 20);
    doc.text(`Exam: ${exam.exam || ""}`, 10, 28);
    doc.text(`Date: ${exam.examDate || ""}`, 10, 36);
    doc.text(`Duration: ${exam.duration || ""}`, 10, 44);
    doc.text(
      `Total Questions: ${exam.totalQs || ""}, Total Marks: ${exam.totalMarks || ""}`,
      10,
      52
    );

    let yOffset = 62;

    exam.topics.forEach((topic, idx) => {
      if (!topic || !topic.questions) return;

      doc.setFontSize(14);
      doc.text(`Topic ${idx + 1}: ${topic.topic || ""}`, 10, yOffset);
      yOffset += 8;

      topic.questions.forEach((q, qIdx) => {
        doc.setFontSize(12);
        doc.text(`${qIdx + 1}. ${q.text || ""} (${q.difficulty || ""})`, 10, yOffset);
        yOffset += 6;

        q.options?.forEach((opt) => {
          doc.text(`${opt.label || ""}. ${opt.text || ""}`, 15, yOffset);
          yOffset += 6;
        });

        yOffset += 4; // space between questions
      });

      yOffset += 6; // space between topics
    });

    doc.save(`${exam.examName || "exam"}.pdf`);
  };

  if (!examData) return <p>Loading exam data...</p>;

  return (
    <div>
      <h3>{examData.examName}</h3>
      <p>Type: {examData.examType}</p>
      <p>Date: {examData.examDate}</p>
      <p>Duration: {examData.duration}</p>
      <MDBBtn onClick={generatePDF}>Download Exam PDF</MDBBtn>
    </div>
  );
};

export default ExamPaperViewer;
