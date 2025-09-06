import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CreateOmrSheet.css"; // custom CSS

const CreateOmrSheet = ({ examName, paperName, paperCode, totalQuestions }) => {
  const sheetRef = useRef();

  // Generate barcode
  useEffect(() => {
    JsBarcode("#barcode", paperCode, { format: "CODE128", width: 1.5, height: 45 });
  }, [paperCode]);

  // Render boxes for Student Name
  const renderBoxes = (count) => {
    return (
      <div className="box-row">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="char-box"></div>
        ))}
      </div>
    );
  };

  // Render Roll No with bubbles under each digit
  // Render Roll No with bubbles under each digit (digit labels outside)
const renderRollNo = () => {
  return (
    <div className="rollno-row">
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} className="digit-col">
          {/* Top box for each roll number digit */}
          <div className="char-box"></div>

          {/* Bubble column with labels outside */}
          <div className="bubble-col">
            {Array.from({ length: 10 }, (_, d) => (
              <div key={d} className="digit-bubble">
                <div className="digit-label">{d}</div>
                <div className="bubble-circle"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


  // Render questions with A–D + bubble
  const renderQuestions = () => {
    const cols = 4;
    const perCol = Math.ceil(totalQuestions / cols);
    const options = ["A", "B", "C", "D"];

    return (
      <div className="question-grid">
        {Array.from({ length: cols }, (_, colIdx) => (
          <div key={colIdx} className="question-col">
            {Array.from({ length: perCol }, (_, rowIdx) => {
              const qNo = colIdx * perCol + rowIdx + 1;
              if (qNo > totalQuestions) return null;

              return (
                <div key={qNo} className="question-row">
                  <span className="qno">{qNo}.</span>
                  {options.map((opt) => (
                    <div key={opt} className="option">
                      <span className="opt-label">{opt}</span>
                      <div className="bubble"></div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Export as PDF
  const exportPDF = async () => {
    const element = sheetRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#f9fafb" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 595, 842);
    pdf.save(`${examName}_${paperName}_OMR.pdf`);
  };
  const exportPNG = async () => {
    const element = sheetRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#f9fafb" });
    const imgData = canvas.toDataURL("image/png");
  
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${examName}_${paperName}_OMR.png`;
    link.click();
  };

  return (
    <div>
      <div className="download-btn">
        <button onClick={exportPDF}>Download OMR PDF</button>
        <button onClick={exportPNG} style={{ marginLeft: "10px" }}>Download OMR PNG</button>
      </div>

      <div ref={sheetRef} className="omr-sheet">
        {/* Alignment Markers */}
        <div className="marker top-left"></div>
        <div className="marker top-right"></div>
        <div className="marker bottom-left"></div>
        <div className="marker bottom-right"></div>

        {/* Header */}
        <div className="omrheader">
          <div>
            <h1>{examName}</h1>
            <h2>{paperName}</h2>
          </div>
          <canvas id="barcode"></canvas>
        </div>

        {/* Student Info */}
        <div className="student-info">
          <p>Student Name:</p>
          {renderBoxes(28)}

          <p className="mt">Roll No:</p>
          {renderRollNo()}
        </div>

        {/* Questions */}
        <div className="questions">
          <p>Answer Section</p>
          {renderQuestions()}
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="sign-box">Student Sign</div>
          <div className="sign-box">Invigilator Sign</div>
        </div>
      </div>
    </div>
  );
};

export default CreateOmrSheet;
