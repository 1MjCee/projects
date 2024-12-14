import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import SubHeader from "../SubHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../store/slices/UserSlice";
import { fetchPaymentTypes } from "../../store/slices/PaymentTypeSlice";
import {
  sendSmsCode,
  createOrUpdateWithdrawal,
  fetchWithdrawalDetails,
} from "../../store/slices/WithdrawalSlice";

const WithdrawalAccount = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const paymentTypes = useSelector((state) => state.paymentTypes.list);
  const withdrawalDetail = useSelector(
    (state) => state.withdrawal?.withdrawalDetail || {}
  );

  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  // const [smsCode, setSmsCode] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  // const [isCodeSent, setIsCodeSent] = useState(false);
  // const [isDisabled, setIsDisabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchPaymentTypes());
    dispatch(fetchWithdrawalDetails());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.username || "");
      setPhoneNumber(userInfo.phone_number || "");
      setCountryCode(userInfo.country.calling_code || "");
    }
  }, [userInfo]);

  useEffect(() => {
    if (withdrawalDetail && Object.keys(withdrawalDetail).length > 0) {
      setName(withdrawalDetail.real_name || "");
      setAccountNumber(withdrawalDetail.account_number || "");
      setSelectedPaymentType(withdrawalDetail.withdrawal_type || "");
    }
  }, [withdrawalDetail]);

  useEffect(() => {
    if (paymentTypes.length > 0) {
      setSelectedPaymentType(paymentTypes[0].id);
    }
  }, [paymentTypes]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Populate with the first option if no selection was made
    if (!selectedPaymentType) {
      setSelectedPaymentType(paymentTypes[0]?.id);
    }

    const data = {
      real_name: name,
      account_number: accountNumber,
      calling_code: countryCode,
      phone_number: phoneNumber,
      withdrawal_type: selectedPaymentType,
    };

    const resultAction = await dispatch(createOrUpdateWithdrawal(data));
    if (createOrUpdateWithdrawal.fulfilled.match(resultAction)) {
      setSuccessMessage("Withdrawal details saved successfully!");
      setErrorMessage("");
    } else {
      setErrorMessage("Failed to save withdrawal details.");
      setSuccessMessage("");
    }
  };

  return (
    <Container
      style={{ backgroundColor: "#03002e" }}
      fluid
      className="border rounded p-4 mt-5"
    >
      <SubHeader title="Withdrawal Details" />

      {successMessage && (
        <div className="alert alert-primary" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="mb-4 p-3 border rounded text-light">
        <h5 className="mb-4 text-center text-light">
          Current Withdrawal Details
        </h5>
        <div className="mb-2">
          <strong>Name:</strong> {withdrawalDetail.real_name || "Not provided"}
        </div>
        <div className="mb-2">
          <strong>Account/Wallet:</strong>{" "}
          {withdrawalDetail.account_number || "Not provided"}
        </div>
        <div className="mb-2">
          <strong>Withdrawal Method:</strong>{" "}
          {paymentTypes.find((pt) => pt.id === withdrawalDetail.withdrawal_type)
            ?.type || "Not provided"}
        </div>
      </div>

      <div className="mb-4 p-3 border rounded">
        <h5 className="mb-4 text-center text-light">
          Set Up Your Payment Details
        </h5>
        <Form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <Row className="mb-3 w-100 g-3">
            <Col md={4} xs={12}>
              <Form.Group>
                <Form.Label className="text-light">Name</Form.Label>
                <Form.Control
                  className="bg-light"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              <Form.Group>
                <Form.Label className="text-light">
                  Account/Wallet Address
                </Form.Label>
                <Form.Control
                  className="bg-light"
                  type="text"
                  name="account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  placeholder="Enter your account/wallet address"
                />
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              <Form.Group>
                <Form.Label className="text-light">
                  Select Payment Method
                </Form.Label>
                <Form.Control
                  className="bg-light"
                  as="select"
                  name="bankCode"
                  required
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                >
                  {paymentTypes.map((paymentType) => (
                    <option key={paymentType.id} value={paymentType.id}>
                      {paymentType.type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="w-100 g-3 px-2">
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Save Withdrawal Details
            </Button>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default WithdrawalAccount;
