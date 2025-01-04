"use client";

import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWithdrawalTerms } from "@/reduxStore/slices/WithdrawalTermsSlice";
import {
  Form,
  Alert,
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import WithdrawalButton from "./WithdrawalButton";
import {
  fetchWalletStats,
  selectWallet,
} from "@/reduxStore/slices/WalletSlice";
import CurrencyConverter from "@/app/utils/CurrencyConverter";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import { fetchPaymentTypes } from "@/reduxStore/slices/PaymentTypeSlice";
import Image from "next/image";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const { balance, totalEarnings, currency } = useSelector(selectWallet);
  const { userInfo } = useSelector((state) => state.user);
  const { list } = useSelector((state) => state.paymentTypes);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);

  const { loading, success } = useSelector((state) => state.withdrawal);
  const {
    terms,
    loading: termsLoading,
    error: termsError,
  } = useSelector((state) => state.withdrawalTerms);

  const formatCurrency = (amount, currencySymbol = "$") => {
    const parsedAmount = parseFloat(amount);

    const formattedAmount = Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
    }).format(parsedAmount);

    const formattedWithSpaces = formattedAmount.replace(/,/g, ", ");

    return `${currencySymbol} ${formattedWithSpaces}`;
  };

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUser());
    }
    dispatch(fetchWalletStats());
    dispatch(fetchWithdrawalTerms());
    dispatch(fetchPaymentTypes());
    if (success) {
      setAmount("");
    }
  }, [dispatch, success]);

  const userPaymentTypes = list.filter(
    (paymentType) =>
      !paymentType.country ||
      paymentType.country === userInfo.country.country_code
  );

  const handleCheckboxChange = (id) => {
    setSelectedPaymentTypes((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Access user's country currency symbol
  const target_currency = userInfo?.country?.currency;

  return (
    <Container fluid className="px-0">
      <div
        style={{
          backgroundColor: "#03002e",
          borderRadius: "8px",
          border: "1px solid #DA9100",
        }}
        className="mt-4 px-2 mx-0 text-light"
      >
        <header>
          <h4 className="text-center mt-4" style={{ color: "#DA9100" }}>
            Withdrawal Terms and Conditions
          </h4>
          <p className="text-center p-3">
            Please adhere to these terms and conditions
          </p>
        </header>
        <hr />
        <div>
          {termsLoading && <Spinner animation="border" />}
          {termsError && <Alert variant="danger">{termsError}</Alert>}
          {terms && terms.length > 0 ? (
            terms.map((term) => (
              <div key={term.id} className="mb-3">
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Minimum Withdrawal Amount:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {formatCurrency(
                          term.minimum_withdrawal_amount,
                          term.currency.symbol
                        )}
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawal Timeframe:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_timeframe_start} -{" "}
                        {term.withdrawal_timeframe_end}
                      </span>
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Processing Time:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_processing_time_min} to{" "}
                        {term.withdrawal_processing_time_max} hours
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawals Processed on Weekends:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawals_processed_on_weekends ? "Yes" : "No"}
                      </span>
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawal Tax Percentage:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_tax_percentage}%
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <p>No withdrawal terms available.</p>
          )}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#03002e",
          borderRadius: "8px",
          border: "1px solid #DA9100",
        }}
        className="mt-3 px-2"
      >
        <header>
          <h4 className="text-center mt-4" style={{ color: "#DA9100" }}>
            Withdraw
          </h4>
          <p className="text-center text-light p-3">
            Please adhere to the above terms and conditions
          </p>
        </header>

        <Card className=" text-center bg-info">
          <Card.Body>
            <Row>
              <Col xs={12}>
                <Card.Text>
                  <span className="text-center">
                    Withdrawable Balance <br />
                    {formatCurrency(
                      totalEarnings,
                      currency.currency_code
                    )} ||{" "}
                    <CurrencyConverter
                      amountInBaseCurrency={totalEarnings}
                      targetCurrency={target_currency}
                    />
                  </span>
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <hr />
        <Row>
          <Col>
            <h7 style={{ color: "#fafafa" }}> Select Payment Method</h7>
            <Form className="d-flex flex-wrap">
              {userPaymentTypes.map((paymentType) => (
                <div
                  className="bg-light"
                  style={{
                    border: "1px solid #DA9100",
                    borderRadius: "8px",
                    margin: "5px",
                    padding: "5px",
                  }}
                >
                  <Form.Group key={paymentType.id}>
                    <Form.Check
                      type="checkbox"
                      id={`paymentType-${paymentType.id}`}
                      name="paymentTypes"
                      value={paymentType.id}
                      checked={selectedPaymentTypes.includes(paymentType.id)}
                      onChange={() => handleCheckboxChange(paymentType.id)}
                      label={
                        <div className="d-flex flex-column align-items-center">
                          <Image
                            src={
                              paymentType.icon || "/assets/images/default.png"
                            }
                            alt={paymentType.type}
                            width={30}
                            height={24}
                            className="mb-2"
                            style={{ borderRadius: "15px" }}
                          />
                          <span style={{ fontSize: "10px", color: "#03002e" }}>
                            {paymentType.type}
                          </span>{" "}
                        </div>
                      }
                    />
                  </Form.Group>
                </div>
              ))}
            </Form>
          </Col>
        </Row>

        <hr />

        <Form className="mb-4">
          <Form.Group>
            <Form.Label style={{ color: "#fafafa" }}>
              Amount to Withdraw
            </Form.Label>
            <Form.Control
              id="withdraw-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
              className="mb-3"
              disabled={loading}
              autoComplete="on"
            />
          </Form.Group>
          <WithdrawalButton amount={amount} />
        </Form>
      </div>
    </Container>
  );
};

export default Withdraw;
