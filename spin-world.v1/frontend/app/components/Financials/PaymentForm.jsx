"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import {
  createPaymentOrder,
  setAmount,
  setCryptocurrency,
  resetPaymentState,
  fetchAvailableCurrencies,
  fetchMinimumPaymentAmount,
  fetchEstimatedPrice,
} from "@/reduxStore/slices/PaymentOrderSlice";
import { useRouter } from "next/navigation";
import PaymentGuide from "./PaymentGuide";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const router = useRouter;
  const [showGuide, setShowGuide] = useState(false);

  const {
    predefinedAmounts,
    selectedAmount,
    selectedCryptocurrency,
    selectedCurrency,
    loading,
    invoiceUrl,
    paymentStatus,
    error,
    cryptoCurrencies,
    minAmount,
    fiatEquivalent,
    estimatedPrice,
  } = useSelector((state) => state.payment);

  const [showError, setShowError] = useState(false);

  // Fetch available currencies on mount
  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAmount || !selectedCryptocurrency || !selectedCurrency) {
      alert("Please select amount, cryptocurrency, and currency.");
      return;
    }

    // Check if the selected amount is greater than or equal to the minimum required amount
    if (minAmount !== null && selectedAmount < minAmount) {
      alert(
        `The selected amount is below the minimum required amount of ${minAmount} ${selectedCryptocurrency}`
      );
      return;
    }

    // Proceed with payment order creation
    dispatch(
      createPaymentOrder({
        amount: selectedAmount,
        currency: selectedCurrency,
        cryptocurrency: selectedCryptocurrency,
      })
    );
  };

  // Redirect to NOWPayments invoice page once we get the URL
  useEffect(() => {
    if (invoiceUrl) {
      setTimeout(() => {
        window.location.href = invoiceUrl;
      }, 3000);
    }
  }, [invoiceUrl]);

  // Handle payment status update
  useEffect(() => {
    if (paymentStatus === "confirmed") {
      alert("Payment successful!");
      dispatch(resetPaymentState());
    } else if (paymentStatus === "failed") {
      alert("Payment failed!");
      dispatch(resetPaymentState());
    }
  }, [paymentStatus, dispatch]);

  // Handle error visibility
  useEffect(() => {
    if (error) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch the minimum payment amount whenever a new cryptocurrency is selected
  useEffect(() => {
    if (selectedCryptocurrency) {
      dispatch(
        fetchMinimumPaymentAmount({
          currencyFrom: selectedCryptocurrency,
          currencyTo: "USD",
        })
      );
    }
  }, [selectedCryptocurrency, dispatch]);

  // Fetch estimated price when selected amount or cryptocurrency changes
  useEffect(() => {
    if (selectedAmount && selectedCryptocurrency) {
      dispatch(
        fetchEstimatedPrice({
          amount: selectedAmount,
          currencyFrom: "USD",
          currencyTo: selectedCryptocurrency,
        })
      );
    }
  }, [selectedAmount, selectedCryptocurrency, dispatch]);

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <Container fluid className="mt-5 px-0">
      <header>
        <h5 className="text-light text-center">Payment Form</h5>
        <p className="text-center text-light">
          -- Follow the instructions on the payment guidelines at the end of
          this form --
        </p>
      </header>
      <Form
        style={{
          backgroundColor: "#03002e",
          padding: "10px",
          margin: 0,
          borderRadius: "15px",
        }}
        onSubmit={handleSubmit}
      >
        <hr style={{ color: "#DA9100", border: "2px solid #DA9100" }} />
        {/* Amount Selection */}
        <Form.Group className="mt-3">
          <Form.Label className="text-light">Select Payment Amount</Form.Label>

          {/* Use buttons instead of Form.Select */}
          <div className="d-flex flex-wrap">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "info" : "outline-info"}
                className="m-1 text-sm"
                onClick={() => dispatch(setAmount(amount))}
              >
                $ {amount}
              </Button>
            ))}
          </div>
        </Form.Group>

        {/* Display Payment Currency */}
        <Form.Group className="mt-3">
          <Form.Label className="text-light">Payment Currency</Form.Label>
          <Form.Control
            id="payment-currency"
            type="text"
            value={selectedCurrency.toUpperCase()}
            readOnly
          />
        </Form.Group>
        <hr style={{ color: "#DA9100", border: "2px solid #DA9100" }} />

        {/* Cryptocurrency Selection Buttons */}
        <Form.Group className="mt-3 w-100">
          <Form.Label className="text-light">
            Select Cryptocurrency/Currency
          </Form.Label>
          <Row>
            {cryptoCurrencies.length > 0 ? (
              <Col xs={12} className="d-flex flex-wrap">
                {cryptoCurrencies.map((crypto) => (
                  <Row>
                    <Col xs={4}>
                      <Button
                        key={crypto}
                        variant={
                          selectedCryptocurrency === crypto
                            ? "info"
                            : "outline-info"
                        }
                        className="m-1 text-sm"
                        onClick={() => dispatch(setCryptocurrency(crypto))}
                      >
                        {crypto.toUpperCase()}
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Col>
            ) : (
              <div className="text-light mt-2">
                No cryptocurrencies available
              </div>
            )}
          </Row>
        </Form.Group>

        {/* Minimum Payment Amount Display */}
        {minAmount !== null && (
          <div className="mt-3">
            <Alert variant="info">
              Minimum amount for {selectedCryptocurrency} to USD: {minAmount}{" "}
              {fiatEquivalent && `(≈ ${fiatEquivalent} USD)`}
            </Alert>
          </div>
        )}
        <hr style={{ color: "#DA9100", border: "2px solid #DA9100" }} />

        {/* Estimated Price Display */}
        {estimatedPrice !== null && (
          <div className="mt-3">
            <Alert variant="info">
              The approximate price for {selectedAmount} {selectedCurrency} in{" "}
              {selectedCryptocurrency} {estimatedPrice} {selectedCryptocurrency}
            </Alert>
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="w-100 mt-3"
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Processing Payment..." : "Proceed to Pay"}
        </Button>
      </Form>

      {/* Error Message */}
      {showError && error && (
        <Alert className="text-center" variant="danger">
          {error.error || "An unexpected error occurred."}
        </Alert>
      )}

      {/* Invoice Redirect Message */}
      {invoiceUrl && !loading && (
        <div className="mt-3 text-center">
          <Alert className="text-center" variant="primary">
            You will be redirected to the payment page.
          </Alert>
        </div>
      )}
      <hr />
      <Row className="mt-5">
        <header>
          <h5 className="text-center">Payment Guide</h5>
          <p className="text-center">
            -- Are you unsure how to proceed? Please the payment guide below --
          </p>
        </header>
        <Button
          className="text-decoration-none"
          variant="link"
          onClick={toggleGuide}
        >
          {showGuide ? "Hide Payment Guide" : "Show Payment Guide"}
        </Button>
        {showGuide && <PaymentGuide />}
      </Row>
    </Container>
  );
};

export default PaymentForm;
