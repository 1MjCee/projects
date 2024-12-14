import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendPhoneVerificationCode,
  registerUser,
} from "../../store/slices/AuthSlice";
import { fetchCountries } from "../../store/slices/CountrySlice";
import { Button, Alert, Container, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PhoneInput from "./InputFields/PhoneInput";
import SMSInput from "./InputFields/SMSInput";
import InviteInput from "./InputFields/InviteInput";
import PasswordInput from "./InputFields/PasswordInput";
import "../../styles/buttons.css";
import { validatePhoneNumber } from "../../utils/phoneUtils";

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);
  const { countries } = useSelector((state) => state.countries);

  const [formData, setFormData] = useState({
    phone_number: "",
    invite_code: "",
    sms_code: "",
    password: "",
  });

  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0) {
      const defaultCountry = countries[0];
      setSelectedCountry(defaultCountry);
    }
  }, [countries]);

  useEffect(() => {
    const inviteCode = new URLSearchParams(location.search).get("inviteCode");
    if (inviteCode) {
      setFormData((prevState) => ({ ...prevState, invite_code: inviteCode }));
    }
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormError("");
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [formError, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "phone_number" && selectedCountry) {
      setIsPhoneNumberValid(
        validatePhoneNumber(value, selectedCountry.calling_code)
      );
    }
  };

  const handleCountryChange = (e) => {
    const countryId = parseInt(e.target.value);
    const country = countries.find((c) => c.id === countryId);
    setSelectedCountry(country);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!selectedCountry?.id) {
      setFormError("Please select a country code.");
      return;
    }

    if (
      !validatePhoneNumber(formData.phone_number, selectedCountry.calling_code)
    ) {
      setFormError("Invalid phone number format.");
      return;
    }

    if (step === 1) {
      await handleFirstStep();
    } else if (step === 2) {
      await handleSecondStep();
    }
  };

  const handleFirstStep = async () => {
    try {
      await dispatch(
        sendPhoneVerificationCode({
          phone_number: formData.phone_number,
          country: selectedCountry.id,
        })
      ).unwrap();
      setStep(2);
      setSuccessMessage("Verification code sent successfully.");
    } catch (error) {
      setFormError(
        error?.response?.data ||
          "Unable to send verification code. Try again later"
      );
    }
  };

  const handleSecondStep = async () => {
    if (!formData.sms_code || !formData.password) {
      setFormError("All fields are required for verification.");
      return;
    }

    try {
      await dispatch(
        registerUser({
          phone_number: formData.phone_number,
          sms_code: formData.sms_code,
          invite_code: formData.invite_code,
          country: selectedCountry.id,
          password: formData.password,
        })
      ).unwrap();

      resetForm();
      setSuccessMessage("Registration Successful!");
      setStep(1);
      navigate("/login");
    } catch (error) {
      setFormError(
        error?.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      phone_number: "",
      invite_code: "",
      sms_code: "",
      password: "",
      country: null,
    });
    setSelectedCountry(null);
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col sm={12} md={6}>
          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow-sm"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <h2 className="mb-4 text-center" style={{ color: "#117745" }}>
              Register Here
            </h2>
            <PhoneInput
              countries={countries}
              selectedCountry={selectedCountry}
              handleCountryChange={handleCountryChange}
              formData={formData}
              handleChange={handleChange}
              isPhoneNumberValid={isPhoneNumberValid}
              step={step}
            />
            {step === 2 && (
              <>
                <SMSInput formData={formData} handleChange={handleChange} />
                <InviteInput formData={formData} handleChange={handleChange} />
                <PasswordInput
                  formData={formData}
                  handleChange={handleChange}
                />
              </>
            )}
            {successMessage && (
              <Alert variant="success" className="mt-3">
                {successMessage}
              </Alert>
            )}
            {formError && (
              <Alert variant="danger" className="mt-3">
                {formError}
              </Alert>
            )}
            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading
                ? "Wait a moment…"
                : step === 1
                ? "Request Code"
                : "Register"}
            </Button>
            <Link to="/login">
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
