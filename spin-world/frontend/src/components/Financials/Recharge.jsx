import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletStats } from "../../store/slices/WalletSlice";
import { fetchPaymentTypes } from "../../store/slices/PaymentTypeSlice";
import { fetchPaymentMethods } from "../../store/slices/PaymentMethodSlice";
import { submitDeposit } from "../../store/slices/RechargeSlice";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import SubHeader from "../SubHeader";
import { FiCopy, FiCheck } from "react-icons/fi";

const generateRechargeOptions = (minimumAmount) => {
  const options = [];
  let multiple = 1;

  while (options.length < 10) {
    const value = multiple * minimumAmount;

    // Ensure the value is a multiple of 2
    if (value % 2 === 0) {
      options.push(value);
    }
    multiple++;
  }

  return options;
};

const Recharge = () => {
  const dispatch = useDispatch();

  const { balance, currency } = useSelector((state) => state.wallet);
  const {
    list: paymentTypes,
    loading,
    error,
  } = useSelector((state) => state.paymentTypes);
  const { list: paymentMethods, loading: paymentMethodsLoading } = useSelector(
    (state) => state.paymentMethods
  );

  const [amount, setAmount] = useState("");
  const [payType, setPayType] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [rechargeOptions, setRechargeOptions] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchWalletStats());
    dispatch(fetchPaymentTypes());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const formatCurrency = (amount, currencySymbol = "$") => {
    const parsedAmount = parseFloat(amount);

    const formattedAmount = Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
    }).format(parsedAmount);

    const formattedWithSpaces = formattedAmount.replace(/,/g, ", ");

    return `${currencySymbol} ${formattedWithSpaces}`;
  };

  useEffect(() => {
    if (paymentMethods.length > 0) {
      const method = paymentMethods[0];
      setSelectedMethod(method);
      const minimumAmount = parseFloat(method.minimum_amount);
      const options = [
        600, 1200, 4000, 8500, 18000, 27000, 55000, 85000, 120000, 210000,
        300000,
      ];
      setRechargeOptions(options);
    }
  }, [paymentMethods]);

  const handleRecharge = () => {
    if (!amount) {
      setAlertMessage("Please Input Recharge Amount");
      return;
    }

    const minimumAmount = parseFloat(selectedMethod.minimum_amount);
    if (amount < minimumAmount) {
      setAlertMessage(`Minimum Recharge Amount ${minimumAmount}`);
      return;
    }

    if (!payType) {
      setAlertMessage("Please Select Payment Method");
      return;
    }

    if (!referenceCode) {
      setAlertMessage("Please Input Reference Code");
      return;
    }

    dispatch(
      submitDeposit({
        amount,
        reference_code: referenceCode,
        payment_type: payType,
      })
    )
      .unwrap()
      .then(() => {
        setAmount("");
        setPayType("");
        setReferenceCode("");
        setAlertMessage("Recharge Successful!");
      })
      .catch((error) => {
        setAlertMessage(error.message);
      });
  };

  const handleCopy = (addressNumber) => {
    navigator.clipboard.writeText(addressNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Container fluid className="my-4">
      <SubHeader title="Recharge Your Account" />
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h5 style={{ fontWeight: "bold" }} className="text-center mb-3">
                Available Payment Methods
              </h5>
              <p className="text-center">
                You should use the available payment methods to recharge your
                wallet
              </p>
              {paymentMethodsLoading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="success" />
                  <p>Loading payment methods...</p>
                </div>
              ) : paymentMethods.length > 0 ? (
                paymentMethods.map((method, index) => (
                  <Card key={index} className="mb-2 p-2">
                    <Card.Body>
                      <Row className="mb-2">
                        <Col xs={12}>
                          <h6 style={{ fontSize: "12px" }}>
                            <strong>Recipient Name:</strong>{" "}
                            {method.recipient_name}
                          </h6>
                        </Col>
                        <Col xs={12}>
                          <div
                            style={{
                              backgroundColor: "#F5F5DC",
                              borderRadius: "8px",
                            }}
                            className="mb-3 border bordered p-2"
                          >
                            <Row>
                              <Col xs={9} md={2}>
                                <strong style={{ fontSize: "12px" }}>
                                  Account Number:
                                </strong>
                                <span
                                  style={{ fontSize: "12px" }}
                                  className="flex-grow-1"
                                >
                                  {" "}
                                  {method.address_number}
                                </span>
                              </Col>
                              <Col>
                                <div
                                  onClick={() =>
                                    handleCopy(method.address_number)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  {copied === method.address_number ? (
                                    <FiCheck size={20} color="green" />
                                  ) : (
                                    <FiCopy size={20} color="green" />
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col xs={12}>
                          <p style={{ fontSize: "12px" }} className="mb-1">
                            <strong>Payment Method:</strong>{" "}
                            {method.method_type.type}
                          </p>
                        </Col>
                        <Col xs={12}>
                          <p style={{ fontSize: "12px" }} className="mb-1">
                            <strong>Minimum Amount:</strong>{" "}
                            {method.minimum_amount} {method.currency}
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No payment methods available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body
              style={{ backgroundColor: "#F5F5DC " }}
              className="border-none rounded"
            >
              <h5 className="text-center">Current Balance</h5>
              <p className="text-center">
                {formatCurrency(balance, currency.symbol)}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr />
      <h5 className="text-center">Submission Form</h5>
      <p className="text-center">Submit Amount deposited and reference code</p>
      <Row className="mb-4">
        <Col>
          <Form.Control
            id="recharge-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Recharge Amount"
            required
            autoComplete="on"
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Form.Control
            id="reference-code"
            type="text"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="Reference Code"
            pattern="^[A-Z0-9]{10}$"
            required
            autoComplete="on"
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h6>Select a Quick Recharge Amount:</h6>
              <Row className="d-flex flex-wrap">
                {rechargeOptions.length > 0 ? (
                  rechargeOptions.map((option) => (
                    <Col xs={6} md={3} lg={4} key={option} className="mb-2">
                      <Button
                        variant={
                          amount === option ? "success" : "outline-success"
                        }
                        onClick={() => setAmount(option)}
                        className="w-100"
                      >
                        {formatCurrency(option, currency.symbol)}
                      </Button>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p>No recharge options available.</p>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <span>Pay Type:</span>
              {loading ? (
                <p>Loading payment types...</p>
              ) : (
                paymentTypes.map((type) => (
                  <Form.Check
                    key={type.id}
                    type="radio"
                    label={type.type}
                    name="payType"
                    value={type.id}
                    checked={payType === type.id.toString()}
                    onChange={(e) => setPayType(e.target.value)}
                    className="my-2"
                    required
                  />
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="text-center">
          <Button className="w-100" variant="success" onClick={handleRecharge}>
            Recharge Now
          </Button>
          {alertMessage && (
            <Alert className="w-100 mt-2" variant="success">
              {alertMessage}
            </Alert>
          )}
          {error && (
            <Alert className="w-100 mt-3" variant="danger">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <p>1. Please follow the correct payment process.</p>
              <p>2. For malicious refund users, accounts will be blocked.</p>
              <p>3. If payment is not credited, contact support.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Recharge;
