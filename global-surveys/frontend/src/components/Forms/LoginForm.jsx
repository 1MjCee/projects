import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/AuthSlice";
import { Button, Alert, Container, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./InputFields/PasswordInput";
import EmailInput from "./InputFields/EmailInput";

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => {
        setFormError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [formError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();
    } catch (error) {
      if (error?.non_field_errors) {
        setFormError(error.non_field_errors[0]);
      } else {
        setFormError("Unknown error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      style={{
        backgroundColor: "#010048",
        margin: "300px auto",
      }}
      fluid
    >
      <Row className="justify-content-center">
        <Col sm={12} md={6} lg={6}>
          <Form
            onSubmit={handleSubmit}
            className="p-4 shadow-sm"
            style={{ backgroundColor: "#03002e", borderRadius: "8px" }}
          >
            <h2 style={{ color: "#DA9100" }} className="text-center mb-4">
              Login into your account
            </h2>
            <div className="d-flex justify-content-center align-items-center gap-2 text-light">
              <span className="mr-3">Not sure yet?</span>
              <Link
                to="/"
                className="text-light font-weight-bold"
                style={{ textDecoration: "none" }}
              >
                <span className="text-warning hover-underline">Go Home</span>
              </Link>
            </div>

            <hr
              style={{
                color: "#ffffff",
                border: "2px solid #fafafa",
                marginBottom: "10px",
              }}
            />
            <EmailInput formData={formData} handleChange={handleChange} />

            <PasswordInput
              formData={formData}
              handleChange={handleChange}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            {formError && (
              <Alert variant="danger" className="mt-3 text-center">
                {formError}
              </Alert>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 shadow-sm"
            >
              {loading ? "Logging in…" : "Login"}
            </Button>
            <Link to="/register">
              <Button
                variant="outline-secondary"
                disabled={loading}
                className="w-100 mt-3 shadow-sm"
              >
                Need an Account?
              </Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
