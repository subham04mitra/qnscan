import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBValidation,
  MDBValidationItem,
  MDBSpinner,
  MDBInputGroup
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import api from "../api/api";
import { getToken, decodeToken } from "../utils/jwtUtils";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CreateUser = () => {
  const [role, setRole] = useState(null); // logged-in user role
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingId, setCheckingId] = useState(false);
  const [userIdStatus, setUserIdStatus] = useState(null); // "available" | "unavailable" | null

  const [form, setForm] = useState({
    id: "",
    pwd: "",
    name: "",
    role: "",
    email: "",
    mobile: "",
    branch: "",
    owner: ""
  });

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userBranch = userData?.user_branch;

  // Get logged-in user role
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role);

      if (decoded?.role === "OWNER" && userBranch) {
        setForm((prev) => ({ ...prev, branch: userBranch }));
      }
    }
  }, []);

  // Fetch owners if ADMIN
  useEffect(() => {
    if (role === "ADMIN") {
      api
        .get("/get-owners")
        .then((res) => {
          if (res.data.code === "200") {
            setOwners(res.data.data);
          }
        })
        .catch(() => {
          toast.error("Failed to load owners!", { position: "bottom-right", autoClose: 1500 });
        });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setForm((prev) => ({ ...prev, role: selectedRole, owner: "", branch: "" }));

    if (role === "ADMIN" && selectedRole === "OWNER") {
      setForm((prev) => ({ ...prev, branch: userBranch }));
    }
    if (role === "OWNER" && selectedRole === "TEACHER") {
      setForm((prev) => ({ ...prev, branch: userBranch, owner: userData?.id }));
    }
  };

  const handleOwnerSelect = (e) => {
    const ownerId = e.target.value;
    const selectedOwner = owners.find((o) => o.id === ownerId);
    setForm((prev) => ({
      ...prev,
      owner: ownerId,
      branch: selectedOwner?.branch || ""
    }));
  };

  const checkUserId = async () => {
    if (!form.id) {
      toast.error("Enter User ID to check!", { position: "top-right", autoClose: 1500 });
      return;
    }
    setCheckingId(true);
    try {
      const res = await api.post("/check-user", { id: form.id });
      if (res.status === 200) {
        setUserIdStatus("available");
        toast.success("User ID available!", { position: "top-right", autoClose: 1500 });
      }
    } catch {
      setUserIdStatus("unavailable");
      toast.error("User ID unavailable!", { position: "top-right", autoClose: 1500 });
    } finally {
      setCheckingId(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.id || !form.pwd || !form.name || !form.role || !form.email || !form.mobile) {
      toast.error("All fields are required!", { position: "top-right", autoClose: 1500 });
      return;
    }
    if (form.role === "TEACHER" && !form.owner && role === "ADMIN") {
      toast.error("Please select Owner for Teacher!", { position: "top-right", autoClose: 1500 });
      return;
    }
    if (form.role === "OWNER" && !form.branch && role === "ADMIN") {
      toast.error("Branch is required for Owner!", { position: "top-right", autoClose: 1500 });
      return;
    }
    if (userIdStatus !== "available") {
      toast.error("Please check User ID availability!", { position: "top-right", autoClose: 1500 });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/save-user", form);
      if (res.data.code === "200") {
        toast.success("User created successfully!", { position: "top-right", autoClose: 1500 });

        setForm({
          id: "",
          pwd: "",
          name: "",
          role: "",
          email: "",
          mobile: "",
          branch: role === "OWNER" ? userBranch || "" : "",
          owner: ""
        });
        setUserIdStatus(null);
      } else {
        toast.error(res.data.message || "Failed to create user", { position: "top-right", autoClose: 1500 });
      }
    } catch {
      toast.error("Error creating user!", { position: "top-right", autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="p-4 bg-light" style={{ minHeight: "100%" }}>
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="10">
          <MDBCard className="shadow-4 rounded-4" style={{width:"100%"}}>
            <MDBCardHeader className="text-center bg-secondary text-white">
              <h4>Create User</h4>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBValidation onSubmit={handleSubmit} noValidate>
                <MDBRow className="gy-3">
                  <MDBCol md="4">
                     <MDBValidationItem invalid feedback="User ID required">
                  <div className="mb-3">
                    <MDBInputGroup>
                      <MDBInput
                        name="id"
                        label="User ID"
                        value={form.id}
                        onChange={handleChange}
                        required
                      />
                      <MDBBtn type="button" onClick={checkUserId} disabled={checkingId}>
                        {checkingId ? <MDBSpinner size="sm" grow /> : <FaSearch />}
                      </MDBBtn>
                      {userIdStatus === "available" && (
                        <FaCheckCircle color="green" size={20} style={{ marginLeft: "8px", marginTop: "10px" }} />
                      )}
                      {userIdStatus === "unavailable" && (
                        <FaTimesCircle color="red" size={20} style={{ marginLeft: "8px", marginTop: "10px" }} />
                      )}
                    </MDBInputGroup>
                  </div>
                </MDBValidationItem>
                  </MDBCol>
                 
                  <MDBCol md="8">
                    <MDBValidationItem invalid feedback="Name required">
                  <MDBInput
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </MDBValidationItem>
                  </MDBCol>
                </MDBRow>
                {/* User ID field with search + check */}
               
                      <MDBRow className="gy-3">
                         <MDBCol md="6">
<MDBValidationItem invalid feedback="Password required">
                  <MDBInput
                    label="Password"
                    type="text"
                    name="pwd"
                    value={form.pwd}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </MDBValidationItem>
                  </MDBCol>
                  <MDBCol md="3">
                    <div className="mb-3">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleRoleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Role</option>
                    {role === "ADMIN" && (
                      <>
                        <option value="OWNER">OWNER</option>
                        <option value="TEACHER">TEACHER</option>
                      </>
                    )}
                    {role === "OWNER" && <option value="TEACHER">TEACHER</option>}
                  </select>
                </div>
                  </MDBCol>
                  <MDBCol md="3">
 {role === "ADMIN" && form.role === "TEACHER" && (
                  <div className="mb-3">
                    <select
                      className="form-select"
                      value={form.owner}
                      onChange={handleOwnerSelect}
                      required
                    >
                      <option value="">Select Owner</option>
                      {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.branch})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                  </MDBCol>
                      </MDBRow>
                <MDBRow className="gy3">
                  <MDBCol md="4">
<MDBValidationItem invalid feedback="Branch required">
                  <MDBInput
                    label="Branch"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                    readOnly={
                      (role === "ADMIN" && form.role === "TEACHER") ||
                      (role === "OWNER" && form.role === "TEACHER") ||
                      (role === "ADMIN" && form.role === "OWNER")
                    }
                    className="mb-3"
                  />
                </MDBValidationItem>
                  </MDBCol>
                  <MDBCol md="4">
                    <MDBValidationItem invalid feedback="Email required">
                  <MDBInput
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </MDBValidationItem>
                  </MDBCol>
                  <MDBCol md="4">
                    
                <MDBValidationItem invalid feedback="Mobile required">
                  <MDBInput
                    label="Mobile"
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    pattern="[0-9]{10}"
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </MDBValidationItem>
                  </MDBCol>
                </MDBRow>

                

                {/* Role dropdown */}
                

                {/* Owner dropdown if Admin → Teacher */}
               
                

                


                <div className="text-center">
                  <MDBBtn outline  type="submit" color="info" className="w-10" disabled={loading}>
                    {loading ? <MDBSpinner size="sm" grow /> : "Create User"}
                  </MDBBtn>
                </div>
              </MDBValidation>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default CreateUser;
