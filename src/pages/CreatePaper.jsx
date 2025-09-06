import React, { useState, useEffect } from "react";
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
  MDBModal,
  MDBModalContent,
  MDBModalDialog,
  MDBModalHeader,
  MDBModalBody,
  MDBModalTitle,
  MDBModalFooter,
  MDBCardHeader,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdb-react-ui-kit";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import ExamPaperViewer from "./ExamPaperViewer";
import PaperView from "./PaperView";
export default function CreatePaper() {
  const [examName, setExamName] = useState("");
  const [duration, setDuration] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [eachMark, seteachMark] = useState("");
  const [totalQs, setTotalQs] = useState("");
  const [exam, setExam] = useState("");
  const [examType, setExamType] = useState("");
  const [examMock, setExamMock] = useState([]);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const toggleOpen = () => setShowPaperModal(!showPaperModal);
  // get exam types
  useEffect(() => {
    api.get("/exam-type").then((res) => {
      setExamTypes(res.data.data);
    });
  }, []);

  useEffect(() => {
    api.get("/exam-name").then((res) => {
      setExamMock(res.data.data);
    });
  }, []);
  // get subjects
  useEffect(() => {
    api.get("/subjects").then((res) => {
      setSubjects(res.data.data);
    });
  }, []);

  // get chapters when subject changes
  useEffect(() => {
    if (subject) {
      api.post("/chapters", { subject }).then((res) => {
        setChapters(res.data.data); // [{name:"Heat", availableQs:41}, ...]
      });
    }
  }, [subject]);

  // get topics when chapter changes
  useEffect(() => {
    if (chapter) {
      api.post("/topics", { chapter }).then((res) => {
        setTopics(res.data.data); // [{name:"Reflection", availableQs:15}, ...]
      });
    }
  }, [chapter]);

  // checkbox toggle
  // checkbox toggle
  const handleCheckbox = (id) => {
    setSelectedTopics((prev) => {
      const isSelected = !prev[id]?.selected;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          selected: isSelected,
          easy: isSelected ? prev[id]?.easy || "" : "",
          medium: isSelected ? prev[id]?.medium || "" : "",
          hard: isSelected ? prev[id]?.hard || "" : "",
        },
      };
    });
  };


  // input change
  const handleInputChange = (id, field, value) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };


  // save
 // save
const handleSave = () => {
  // 1. Check required fields
  if (!examName || !duration || !examDate || !eachMark || !totalQs || !exam || !examType) {
    toast.error("All fields are required!", { position: "bottom-right", autoClose: 1500 });
    return;
  }

  const selected = [];

  for (const [id, val] of Object.entries(selectedTopics)) {
    if (!val.selected) continue;

    const topic = tableTopics.find(t => t.id === id);
    const available = getCountsArray(topic?.availableQs || []);

    // Easy
    if (val.easy) {
      if (val.easy < 0) {
        toast.error("Easy Qs cannot be negative!", { position: "bottom-right", autoClose: 1500 });
        return;
      }
      if (val.easy > available[0]) {
        toast.error(`Easy Qs cannot exceed available (${available[0]})`, { position: "bottom-right", autoClose: 1500 });
        return;
      }
      selected.push({ topic: id, type: "E", count: val.easy });
    }

    // Medium
    if (val.medium) {
      if (val.medium < 0) {
        toast.error("Medium Qs cannot be negative!", { position: "bottom-right", autoClose: 1500 });
        return;
      }
      if (val.medium > available[1]) {
        toast.error(`Medium Qs cannot exceed available (${available[1]})`, { position: "bottom-right", autoClose: 1500 });
        return;
      }
      selected.push({ topic: id, type: "M", count: val.medium });
    }

    // Hard
    if (val.hard) {
      if (val.hard < 0) {
        toast.error("Hard Qs cannot be negative!", { position: "bottom-right", autoClose: 1500 });
        return;
      }
      if (val.hard > available[2]) {
        toast.error(`Hard Qs cannot exceed available (${available[2]})`, { position: "bottom-right", autoClose: 1500 });
        return;
      }
      selected.push({ topic: id, type: "H", count: val.hard });
    }
  }

  // if no topics selected
  if (selected.length === 0) {
    toast.error("Please select at least one topic!", { position: "bottom-right", autoClose: 1500 });
    return;
  }

  const totalSelectedCount = selected.reduce((sum, t) => sum + Number(t.count), 0);
if (Number(totalQs) !== totalSelectedCount) {
  toast.error(`Total Qs (${totalQs}) must equal selected counts (${totalSelectedCount})!`, {
    position: "bottom-right",
    autoClose: 1500,
  });
  return;
}

  // ✅ API call
  api.post("/save-paper", {
    examName,
    duration,
    examDate,
    totalMarks:String(totalQs * eachMark),
    totalQs,
    exam,
    examType,
    subject,
    chapter,
    eachMark,
    topics: selected,
  })
    .then((res) => {
      const paperId = res.data.data; // e.g., "P01"
      setSelectedPaperId(paperId);
      setTimeout(() => setShowPaperModal(true), 1000);
      toast.success(res.data.Message, {
        position: "bottom-right",
        autoClose: 1500,
      });
      // reset fields
      setExamName("");
      setDuration("");
      setExamDate("");
      setTotalMarks("");
      setTotalQs("");
      setExam("");
      setExamType("");
      setSubject("");
      setChapter("");
      setTopics([]);
      seteachMark("");
      setSelectedTopics({});
    })
    .catch((err) => {
      toast.error(err.response?.data?.Message || "Something went wrong!", {
        position: "bottom-right",
        autoClose: 1500,
      });
    });
};


const getCountsArray = (availableQs = []) => {
  const easy = availableQs.find(q => q.ques_type === "E")?.count || 0;
  const medium = availableQs.find(q => q.ques_type === "M")?.count || 0;
  const hard = availableQs.find(q => q.ques_type === "H")?.count || 0;
  return [easy, medium, hard];
};

  // what to show in table
  let tableTopics = [];
  if (examType === "PAT2" && subject) {
    tableTopics = chapters;
  } else if (examType === "PAT3" && chapter) {
    tableTopics = topics;
  }
  else if (examType === "PAT1" ) {
    tableTopics = subjects;
  }
  console.log(subjects);

  return (
    <MDBContainer
      fluid
      className="d-flex justify-content-center align-items-start min-vh-100"

    >
      <MDBCard className="w-100" style={{ maxWidth: "100%" }}>
         <MDBCardHeader className="text-center bg-secondary text-white">
              <h4>Create Paper</h4></MDBCardHeader>
        <MDBCardBody>
         

          {/* Top fields */}
          <MDBRow className="gy-3">
            <MDBCol md="4">
              <MDBInput color="outline-info"
                label="Exam Name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput color="outline-info"
                label="Duration (mins)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput color="outline-info"
                label="Exam Date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </MDBCol>
           <MDBCol md="2">
              <MDBInput color="outline-info"
                label="Total Questions"
                type="number"
                value={totalQs}
                onChange={(e) => setTotalQs(e.target.value)}
              />
            </MDBCol>
            <MDBCol md="2">
              <MDBInput color="outline-info"
                label="Each Qs Marks"
                type="number"
                value={eachMark}
                onChange={(e) => seteachMark(e.target.value)}
              />
            </MDBCol>
            
            
          </MDBRow>

          {/* Exam selection */}
          <MDBRow className="gy-3 mt-3">
             <MDBCol md="2">
              <MDBInput color="outline-info"
                label="Total Marks"
                type="number"
                value={totalQs*eachMark}
                readOnly
              />
            </MDBCol>
           <MDBCol md="2" sm="12">
  <MDBDropdown className="w-100">
    <MDBDropdownToggle color="outline-info" className="w-100 text-start">
      {exam
        ? examMock.find((e) => e.id === exam)?.name
        : "Select Exam"}
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

            <MDBCol md="2" sm="12">
  <MDBDropdown className="w-100">
    <MDBDropdownToggle color="outline-info" className="w-100 text-start">
      {examType
        ? examTypes.find((t) => t.id === examType)?.name
        : "Select Exam Type"}
    </MDBDropdownToggle>
    <MDBDropdownMenu className="w-100">
      {examTypes.map((type) => (
        <MDBDropdownItem
          key={type.id}
          link
          onClick={() => {
            setExamType(type.id);
            setSubject("");
            setChapter("");
          }}
          className="d-flex flex-column"
        >
          <span className="fw-bold">{type.name}</span>
        </MDBDropdownItem>
      ))}
    </MDBDropdownMenu>
  </MDBDropdown>
</MDBCol>

            {examType === "PAT2" && (
             <MDBCol md="3" sm="12">
  <MDBDropdown className="w-100">
    <MDBDropdownToggle color="outline-info" className="w-100 text-start">
      {subject
        ? subjects.find((s) => s.id === subject)?.name
        : "Select Subject"}
    </MDBDropdownToggle>
    <MDBDropdownMenu className="w-100">
      {subjects.map((sub) => (
        <MDBDropdownItem
          key={sub.id}
          link
          onClick={() => setSubject(sub.id)}
          className="d-flex flex-column"
        >
          <span className="fw-bold">{sub.name}</span>
        </MDBDropdownItem>
      ))}
    </MDBDropdownMenu>
  </MDBDropdown>
</MDBCol>

            )}

            {examType === "PAT3" && (
              <>
                <MDBCol md="3" sm="12">
  <MDBDropdown className="w-100">
    <MDBDropdownToggle color="outline-info" className="w-100 text-start">
      {subject
        ? subjects.find((s) => s.id === subject)?.name
        : "Select Subject"}
    </MDBDropdownToggle>
    <MDBDropdownMenu className="w-100">
      {subjects.map((sub) => (
        <MDBDropdownItem
          key={sub.id}
          link
          onClick={() => setSubject(sub.id)}
          className="d-flex flex-column"
        >
          <span className="fw-bold">{sub.name}</span>
        </MDBDropdownItem>
      ))}
    </MDBDropdownMenu>
  </MDBDropdown>
</MDBCol>


                {subject && (
                 <MDBCol md="3" sm="12">
  <MDBDropdown className="w-100">
    <MDBDropdownToggle color="outline-info" className="w-100 text-start">
      {chapter
        ? chapters.find((ch) => ch.id === chapter)?.name
        : "Select Chapter"}
    </MDBDropdownToggle>
    <MDBDropdownMenu className="w-100">
      {chapters.map((ch) => (
        <MDBDropdownItem
          key={ch.id}
          link
          onClick={() => setChapter(ch.id)}
          className="d-flex flex-column"
        >
          <span className="fw-bold">{ch.name}</span>
        </MDBDropdownItem>
      ))}
    </MDBDropdownMenu>
  </MDBDropdown>
</MDBCol>

                )}
              </>
            )}

          </MDBRow>
          {console.log(tableTopics)}

          {/* Table */}
          {/* Table */}
          {tableTopics.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="table-responsive mt-4 d-none d-md-block">
                <MDBTable bordered small align="middle">
                  <MDBTableHead>
                    <tr>
                      <th>Select</th>
                      <th>
                        {examType === "PAT1"
                          ? "Subject"
                          : examType === "PAT2"
                            ? "Chapter"
                            : "Topic"}
                      </th>

                      <th>Available Qs</th>
                      <th>Easy Qs</th>
                      <th>Medium Qs</th>
                      <th>Hard Qs</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {tableTopics.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <MDBCheckbox
                            checked={selectedTopics[item.id]?.selected || false}
                            onChange={() => handleCheckbox(item.id)}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>[{getCountsArray(item.availableQs).join(", ")}]</td>

                        <td>
                          <MDBInput
                            type="number"
                            size="sm"
                            value={selectedTopics[item.id]?.easy || ""}
                            disabled={!selectedTopics[item.id]?.selected}
                            onChange={(e) => handleInputChange(item.id, "easy", e.target.value)}
                          />
                        </td>
                        <td>
                          <MDBInput
                            type="number"
                            size="sm"
                            value={selectedTopics[item.id]?.medium || ""}
                            disabled={!selectedTopics[item.id]?.selected}
                            onChange={(e) => handleInputChange(item.id, "medium", e.target.value)}
                          />
                        </td>
                        <td>
                          <MDBInput
                            type="number"
                            size="sm"
                            value={selectedTopics[item.id]?.hard || ""}
                            disabled={!selectedTopics[item.id]?.selected}
                            onChange={(e) => handleInputChange(item.id, "hard", e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              </div>

              {/* Mobile Table */}
              <div className="mt-4 d-md-none">
                {tableTopics.map((item, index) => (
                  <div key={index} className="border p-3 mb-2 rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <MDBCheckbox
                        checked={selectedTopics[item.id]?.selected || false}
                        onChange={() => handleCheckbox(item.id)}
                      />
                      <span>
                        <strong>{item.name}</strong> | Available: {getCountsArray(item.availableQs).join(", ")}
                      </span>
                    </div>
                    {selectedTopics[item.id]?.selected && (
                      <MDBRow className="gy-2">
                        <MDBCol xs="12">
                          <MDBInput
                            label="Easy Qs"
                            type="number"
                            value={selectedTopics[item.id]?.easy || ""}
                            onChange={(e) => handleInputChange(item.id, "easy", e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol xs="12">
                          <MDBInput
                            label="Medium Qs"
                            type="number"
                            value={selectedTopics[item.id]?.medium || ""}
                            onChange={(e) => handleInputChange(item.id, "medium", e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol xs="12">
                          <MDBInput
                            label="Hard Qs"
                            type="number"
                            value={selectedTopics[item.id]?.hard || ""}
                            onChange={(e) => handleInputChange(item.id, "hard", e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}


          <div className="text-center mt-4">
            <MDBBtn onClick={handleSave}>Save</MDBBtn>
          </div>

          {/* {selectedPaperId && <ExamPaperViewer paperId={selectedPaperId} />} */}


          {/* Exam Paper Modal */}
          <MDBModal open={showPaperModal} staticBackdrop={false} onClose={() => setShowPaperModal(false)} tabIndex='-1'>
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Download the Paper</MDBModalTitle>
                  <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody> {selectedPaperId && <ExamPaperViewer paperId={selectedPaperId} />}</MDBModalBody>


              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>




        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
