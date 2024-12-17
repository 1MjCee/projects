"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/reduxStore/slices/AuthSlice";
import { Button, Alert, Container, Row, Col, Form } from "react-bootstrap";
import PasswordInput from "./InputFields/PasswordInput";
import UsernameInput from "./InputFields/UsernameInput";
import EmailInput from "./InputFields/EmailInput";
import InviteInput from "./InputFields/InviteInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserRegister = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux selectors for loading state and country data
  const { loading } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  // State for form data, error messages, and success messages
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    invite_code: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Extract invite code from URL when the component mounts

  useEffect(() => {
    setIsClient(true);
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get("inviteCode");
    if (inviteCode) {
      setFormData((prevState) => ({
        ...prevState,
        invite_code: inviteCode,
      }));
    }
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    try {
      // Dispatch registration action
      await dispatch(
        registerUser({
          username: formData.username,
          email: formData.email,
          invite_code: formData.invite_code,
          password: formData.password,
        })
      ).unwrap();

      resetForm();
      setSuccessMessage("Registration Successful!");
      router.push("/login");
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      // Check if the response contains specific validation errors
      if (error?.response?.data) {
        const { email, username } = error.response.data;

        if (email && username) {
          errorMessage = "Email and username are already taken.";
        } else if (email) {
          errorMessage = "User with this email already exists.";
        } else if (username) {
          errorMessage = "User with this username already exists.";
        } else if (
          error?.response?.data.error &&
          error?.response?.data.error.includes(
            "You cannot register more than 2 accounts from the same IP."
          )
        ) {
          errorMessage =
            "You cannot register more than 2 accounts from the same IP Address.";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }

      // Set the error message to be displayed in the form
      setFormError(errorMessage);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      invite_code: "",
      password: "",
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container style={{ backgroundColor: "#010048" }} fluid className="mt-5">
      <Row style={{ margin: "300px auto" }} className="justify-content-center">
        <Col sm={12} md={6}>
          <Form
            onSubmit={handleSubmit}
            className="p-4"
            style={{ backgroundColor: "#03002e", borderRadius: "8px" }}
          >
            <h2 className="mb-4 text-center" style={{ color: "#DA9100" }}>
              Create a new Account
            </h2>
            <div className="d-flex justify-content-center align-items-center gap-2 text-light">
              <span className="mr-3">Not sure yet?</span>
              <Link
                href="/"
                passHref
                className="text-light font-weight-bold"
                style={{ textDecoration: "none" }}
              >
                <span className="text-warning hover-underline">Go Home</span>
              </Link>
            </div>

            <hr
              style={{
                color: "#ffffff",
                border: "1px solid #fafafa",
                marginBottom: "10px",
              }}
            />
            <UsernameInput formData={formData} handleChange={handleChange} />
            <EmailInput formData={formData} handleChange={handleChange} />
            <InviteInput formData={formData} handleChange={handleChange} />
            <PasswordInput
              formData={formData}
              handleChange={handleChange}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Wait a moment…" : "Register"}
            </Button>
            {successMessage && (
              <Alert variant="success" className="mt-3 text-center">
                {successMessage}
              </Alert>
            )}
            {formError && (
              <Alert variant="danger" className="mt-3 text-center">
                {formError}
              </Alert>
            )}
            <Link href="/auth/login" passHref>
              <Button
                variant="outline-secondary"
                className="mt-3 w-100 custom-button"
                disabled={loading}
              >
                I have an Account
              </Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegister;
