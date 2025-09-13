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

 const generatePDF = async() => {
  if (!examData) return;

  const exam = examData;

  if (!exam || !exam.inst_name || !exam.questions) {
    console.error("Exam data is incomplete", exam);
    return;
  }


    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yOffset = 20;
    let count = 0;
    let pageNumber = 1;

    // === Load logo from URL ===
    const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"; // replace with your real logo
    const logoBase64 = await toDataUrl(logoUrl);

    // ===== Draw Border on First Page =====
    drawBorder(doc, pageWidth, pageHeight);

    // ===== Logo =====
    doc.addImage(logoBase64, "PNG", 12, 8, 20, 20); // left top corner

    // console.log(exam);
    
    // ===== Paper ID (top right) =====
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Paper ID: ${paperId}`, pageWidth - 12, 15, { align: "right" });

    // ===== Institute Name =====
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(exam.inst_name || "Institute Name", pageWidth / 2, yOffset, {
      align: "center",
    });
    yOffset += 8;

    // ===== Branch Name =====
    doc.setFontSize(14);
    doc.setFont("times", "italic");
    doc.text(exam.branch_name || "Branch Name", pageWidth / 2, yOffset, {
      align: "center",
    });
    yOffset += 10;

    // ===== Exam Info (Date, Duration, Marks) =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date: ${exam.examDate || ""}`, 20, yOffset);
    doc.text(`Duration: ${exam.duration || ""} Minutes`, pageWidth / 2, yOffset, {
      align: "center",
    });
    doc.text(`Total Marks: ${exam.totalMarks || ""}`, pageWidth - 20, yOffset, {
      align: "right",
    });
    yOffset += 6;
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 8;

    // ===== Exam Title =====
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(
      `Exam: ${exam.exam || ""} - ${exam.examName || ""} (${exam.examType || ""})`,
      pageWidth / 2,
      yOffset,
      { align: "center" }
    );
    yOffset += 6;
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 10;

    // ===== General Instructions Box =====
    const instructions = [
      "1. All questions are compulsory.",
      "2. Read each question carefully before answering.",
      "3. Do not use unfair means.",
      "4. Time management is key.",
    ];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("General Instructions:", 22, yOffset);
    yOffset += 6;

    const boxTop = yOffset;
    const boxHeight = instructions.length * 6 + 4;
    doc.rect(20, boxTop - 4, pageWidth - 40, boxHeight);

    doc.setFont("helvetica", "normal");
    instructions.forEach((inst) => {
      doc.text(inst, 24, yOffset);
      yOffset += 6;
    });

    yOffset += 6;

    // ===== Questions Section =====
    exam.questions.forEach((question) => {
      if (yOffset > pageHeight - 40) {
        addFooter(doc, exam.created_by || "Teacher Name", pageWidth, pageHeight, pageNumber);
        pageNumber++;
        doc.addPage();
        drawBorder(doc, pageWidth, pageHeight);
        yOffset = 30;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${count + 1}. ${question.text || ""}`, 20, yOffset);
      yOffset += 6;

      doc.setFont("helvetica", "normal");
      question.options?.forEach((opt) => {
        if (yOffset > pageHeight - 40) {
          addFooter(doc, exam.created_by || "Teacher Name", pageWidth, pageHeight, pageNumber);
          pageNumber++;
          doc.addPage();
          drawBorder(doc, pageWidth, pageHeight);
          yOffset = 30;
        }
        if (opt.type === "RAW") {
    // Simple text option
    doc.text(`${opt.label || ""}. ${opt.text || ""}`, 26, yOffset);
    yOffset += 6;

  } else if (opt.type === "IMG" && opt.text) {
    // Convert Base64 image
    try {
      // Adjust width/height for consistency
      const imgWidth = 40;
      const imgHeight = 25;
      doc.text(`${opt.label || ""}.`, 20, yOffset + 10); // label left aligned
      doc.addImage(opt.text, "PNG", 30, yOffset, imgWidth, imgHeight);

      // Move yOffset down after image
      yOffset += imgHeight + 6;
    } catch (err) {
      console.error("Image render failed:", err);
    }
  }
      });

      yOffset += 4;
      count++;
    });

    // ===== Final Footer =====
    addFooter(doc, exam.created_by || "Teacher Name", pageWidth, pageHeight, pageNumber);

    doc.save(`${exam.examName || "exam"}.pdf`);
  };

  // === HELPER: Footer ===
  const addFooter = (doc, teacherName, pageWidth, pageHeight, pageNumber) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(teacherName, pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 12);
  };

  // === HELPER: Draw Page Border ===
  const drawBorder = (doc, pageWidth, pageHeight) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // outer border
  };

  // === HELPER: Convert URL to Base64 ===
  const toDataUrl = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });


  if (!examData) return <p>Loading exam data...</p>;

  return (
    <div>
      <h3>{examData.examName}</h3>
      <p>Type: {examData.examType}</p>
      <p>Date: {examData.examDate}</p>
      <p>Duration: {examData.duration} Minutes</p>
      <MDBBtn onClick={generatePDF}>Download Exam PDF</MDBBtn>
    </div>
  );
};

export default ExamPaperViewer;
