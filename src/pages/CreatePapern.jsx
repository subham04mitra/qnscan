import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import api from "../api/api"
export default function CreatePaper() {
  const [examName, setExamName] = useState("");
  const [duration, setDuration] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [totalQs, setTotalQs] = useState("");
  const [exam, setExam] = useState("");
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
const [examTypes, setExamTypes] = useState([]);
const [subjects, setSubjects] = useState([]);
const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
useEffect(() => {
    api.get("/exam-type").then(res => {
      setExamTypes(res.data.data);
    });
  }, []);
  useEffect(async() => {
    //  if (examType === "Subject Wise" || examType === "Chapter Wise") {
      const res = await api.get("/subjects");
      setSubjects(res.data.data);
    // }
  }, []);
useEffect(async() => {
    const res = await api.post("/chapters", { subject });
      setChapters(res.data.data);
  }, []);
  useEffect(async() => {
    const res = await api.post("/topics", { chapter });
      setTopics(res.data.data);
  }, []);
  
  // const subjects = ["Math", "Physics", "Chemistry"];
  // const chapters = {
  //   Math: ["Algebra", "Geometry"],
  //   Physics: ["Laws of Motion", "Work & Energy"],
  //   Chemistry: ["Atoms", "Reactions"],
  // };
  // const topics = {
  //   Algebra: ["Linear Equations", "Quadratic Equations"],
  //   Geometry: ["Triangles", "Circles"],
  //   "Laws of Motion": ["Newton’s 1st Law", "Newton’s 2nd Law"],
  //   "Work & Energy": ["Kinetic Energy", "Potential Energy"],
  //   Atoms: ["Atomic Models", "Structure"],
  //   Reactions: ["Acids", "Bases"],
  // };

  const [selectedTopics, setSelectedTopics] = useState({});

  // handle checkbox toggle
  const handleCheckbox = (topic) => {
    setSelectedTopics((prev) => {
      const isSelected = !prev[topic]?.selected;
      return {
        ...prev,
        [topic]: {
          ...prev[topic],
          selected: isSelected,
          easy: isSelected ? prev[topic]?.easy || "" : "",   // clear if unselected
          medium: isSelected ? prev[topic]?.medium || "" : "",
          hard: isSelected ? prev[topic]?.hard || "" : "",
        },
      };
    });
  };

  // Save only selected rows
  const handleSave = () => {
    const selected = Object.entries(selectedTopics)
      .filter(([_, val]) => val.selected) // keep only checked rows
      .map(([topic, val]) => ({
        topic,
        easy: val.easy || 0,
        medium: val.medium || 0,
        hard: val.hard || 0,
      }));

    console.log("Saved Data:", {
      examName,
      duration,
      examDate,
      totalMarks,
      totalQs,
      exam,
      examType,
      subject,
      chapter,
      topics: selected,   // only checked topics with values
    });
  };


  const handleInputChange = (topic, field, value) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [field]: value,
      },
    }));
  };


console.log(examType);

  // Decide what to show in table
  let tableTopics = [];
  if (examType === "Subject Wise") {
    tableTopics = chapters || [];
  } else if (examType === "Chapter Wise") {
    tableTopics = topics || [];
  }

  return (
    <MDBContainer
      fluid
      className="d-flex justify-content-center align-items-start min-vh-100"
      style={{
        // background: "linear-gradient(to right, #ffffffff, #2575fc)",
        padding: "20px",
      }}
    >
      <MDBCard className="w-100" style={{ maxWidth: "1000px" }}>
        <MDBCardBody>
          <MDBTypography tag="h4" className="text-center mb-4">
            Paper Creation
          </MDBTypography>

          {/* Top fields */}
          <MDBRow className="gy-3">
            <MDBCol md="4">
              <MDBInput
                label="Exam Name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput
                label="Duration (mins)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput
                label="Exam Date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput
                label="Total Marks"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput
                label="Total Questions"
                type="number"
                value={totalQs}
                onChange={(e) => setTotalQs(e.target.value)}
              />
            </MDBCol>
          </MDBRow>

          {/* Exam selection */}
          <MDBRow className="gy-3 mt-3">
            <MDBCol md="3">
              <select
                className="form-select"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
              >
                <option value="">Select Exam</option>
                <option value="Exam1">Exam 1</option>
                <option value="Exam2">Exam 2</option>
              </select>
            </MDBCol>
               <MDBCol md="3">
      <select
        className="form-select"
        value={examType}
        onChange={(e) => {
          setExamType(e.target.value);
          setSubject("");
          setChapter("");
        }}
      >
        <option value="">Select Exam Type</option>
        {examTypes.map((type, idx) => (
          <option key={idx} value={type}>
            {type}
          </option>
        ))}
      </select>
    </MDBCol>

            {examType === "Subject Wise" && (
              <MDBCol md="3">
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </MDBCol>
            )}

            {examType === "Chapter Wise" && (
              <>
                <MDBCol md="3">
                  <select
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </MDBCol>
                {subject && (
                  <MDBCol md="3">
                    <select
                      className="form-select"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                    >
                      <option value="">Select Chapter</option>
                      {chapters.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                    </select>
                  </MDBCol>
                )}
              </>
            )}
          </MDBRow>

          {/* Table */}
          {examType !== "Full Exam" && tableTopics.length > 0 && (
            <div className="table-responsive mt-4">
              <MDBTable bordered small align="middle">
                <MDBTableHead>
                  <tr>
                    <th>Select</th>
                    <th>Topic</th>
                    <th>Available Qs</th>
                    <th>Easy Qs</th>
                    <th>Medium Qs</th>
                    <th>Hard Qs</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {tableTopics.map((topic, index) => (
                    <tr key={index}>
                      <td>
                        <MDBCheckbox
                          checked={+[topic]?.selected || false}
                          onChange={() => handleCheckbox(topic)}
                        />
                      </td>
                      <td>{topic}</td>
                      <td>{Math.floor(Math.random() * 50 + 10)}</td>
                      <td>
                        <MDBInput
                          type="number"
                          size="sm"
                          value={selectedTopics[topic]?.easy || ""}
                          disabled={!selectedTopics[topic]?.selected}   // disable if not checked
                          onChange={(e) =>
                            handleInputChange(topic, "easy", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <MDBInput
                          type="number"
                          size="sm"
                          value={selectedTopics[topic]?.medium || ""}
                          disabled={!selectedTopics[topic]?.selected}
                          onChange={(e) =>
                            handleInputChange(topic, "medium", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <MDBInput
                          type="number"
                          size="sm"
                          value={selectedTopics[topic]?.hard || ""}
                          disabled={!selectedTopics[topic]?.selected}
                          onChange={(e) =>
                            handleInputChange(topic, "hard", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          )}

          <div className="text-center mt-4">
            <MDBBtn onClick={handleSave}>Save</MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}