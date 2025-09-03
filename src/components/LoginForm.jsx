// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authService";
import { decodeToken, storeToken } from "../utils/jwtUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

function LoginForm({ onLogin }) {
  const [uuid, setUuid] = useState("");
  const [user_pwd, setUser_pwd] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const navigate = useNavigate();

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return `${a} + ${b}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expected = eval(captcha); // safe because captcha is "num + num"

    if (parseInt(captchaInput) !== expected) {
      toast.error("❌ Invalid captcha");
      setCaptcha(generateCaptcha()); // regenerate on failure
      setCaptchaInput("");
      return;
    }

    try {
      const res = await loginApi(uuid, user_pwd);

      if (res?.code === "200" && res?.token) {
        storeToken(res.token);
        localStorage.setItem("userData", JSON.stringify(res.data));

        const decoded = decodeToken(res.token);
        console.log("Decoded token:", decoded);

        // handle role extraction flexibly (role or authorities[0])
        const userRole = decoded?.role || decoded?.authorities?.[0];

        toast.success("✅ Login successful!", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          onLogin(userRole);
          navigate("/"); // redirect to dashboard -> MainLayout -> sidebar
        }, 1600);
      } else {
        toast.error("❌ Invalid credentials!");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong. Please try again!");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100"
      >
        <MDBCard
          style={{
            background: "rgba(255, 255, 255, 0.1)", // frosted glass
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <MDBCardBody className="p-5 text-center text-white">
            <h2 className="fw-bold mb-4">Login to QnScan</h2>

            <form onSubmit={handleSubmit}>
              {/* User ID */}
              <MDBInput
                wrapperClass="mb-4"
                label="User ID"
                id="uuid"
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                required
                className="text-white"
                contrast
              />

              {/* Password */}
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="password"
                type="password"
                value={user_pwd}
                onChange={(e) => setUser_pwd(e.target.value)}
                required
                className="text-white"
                contrast
              />

              {/* Captcha */}
              <div className="d-flex align-items-center mb-4">
                <span className="fw fs-4 me-2">{captcha.split(" ")[0]}</span>
                <span className="fw fs-4 me-2">+</span>
                <span className="fw fs-4 me-2">{captcha.split(" ")[2]}</span>
                <span className="fw fs-4 me-2">=</span>

                <MDBInput
                  id="captcha"
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  className="text-white"
                  contrast
                  style={{ width: "70px", height: "40px" }}
                />
              </div>

              {/* Submit Button */}
              <MDBBtn
                rounded
                color="success"
                className="w-100 mb-4"
                size="md"
                type="submit"
                style={{ borderRadius: "50px" }}
              >
                Login
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
