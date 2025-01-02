"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  promoCodeRedeem,
} from "@/reduxStore/slices/PromoCodeRedeemSlice";
import { fetchTransactions } from "@/reduxStore/slices/transactionsSlice";

const DigTreasure = () => {
  const dispatch = useDispatch();
  const { message, amount, currency, loading, error } = useSelector(
    (state) => state.promoCodeRedeem
  );
  const { records } = useSelector((state) => state.transactions);
  const [code, setCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handleRedeem = () => {
    dispatch(promoCodeRedeem({ code }));
  };

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Determine the records to display for the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(records.length / recordsPerPage);

  // Handle pagination logic
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
        setCode("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  return (
    <Container
      className="mt-5 p-4"
      style={{
        borderRadius: "10px",
        backgroundColor: "#03002e",
      }}
    >
      <header className="mb-3 text-center">
        <h3 className="mb-3 text-center text-light">Redeem Your Treasure</h3>
        <p style={{ color: "#DA9100" }} className="text-center">
          Use this chance to redeem your treasure by using the Treasure code
          received from the roullete wheel
        </p>
      </header>
      <hr />
      <Form
        className="mb-2 p-4"
        style={{
          margin: "auto auto",
          backgroundColor: "#010048",
          borderRadius: "15px",
        }}
      >
        <Form.Group>
          <Form.Label className="text-light">Treasure Code</Form.Label>
          <Form.Control
            id="treasure-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Treasure Code"
            className="mb-3"
            style={{ borderColor: "#28a745" }}
            autoComplete="off"
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleRedeem}
          className="mt-2 w-100"
          disabled={loading}
        >
          {loading ? "Loading..." : "Redeem Treasure"}
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3 text-center">
          {(() => {
            const errorMessage = error.error;

            if (typeof errorMessage === "string") {
              try {
                const correctedErrorMessage = errorMessage.replace(/'/g, '"');
                const parsedError = JSON.parse(correctedErrorMessage);
                return Array.isArray(parsedError)
                  ? parsedError.join(", ")
                  : parsedError;
              } catch (e) {
                console.error("Parsing error:", e);
                return errorMessage;
              }
            } else {
              return "Error: " + JSON.stringify(errorMessage);
            }
          })()}
        </Alert>
      )}
      {message && (
        <Alert variant="primary" className="mt-3 text-center">
          {message}
        </Alert>
      )}

      <hr />
      <h3 style={{ color: "#DA9100" }} className="mt-4 mb-3 text-center">
        Income History
      </h3>
      <hr style={{ color: "#DA9100", border: "1px solid #DA9100" }} />
      <Row
        style={{
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {currentRecords.length > 0 ? (
          currentRecords.map((record, index) => (
            <Col key={index} xs={12} className="mb-2 px-1">
              <Card
                style={{
                  backgroundColor: "#010048",
                  color: "#fafafa",
                  borderRadius: "8px",
                }}
                className="p-2"
              >
                <Card.Text>
                  {record.currency} {record.amount}{" "}
                  <span>added to wallet on </span>{" "}
                  {new Date(record.created_at).toLocaleString("en-US", {
                    weekday: "long", // "Monday"
                    year: "numeric", // "2024"
                    month: "long", // "11" (for November)
                    day: "numeric",
                    hour: "numeric", // "5"
                    minute: "numeric", // "30"
                    second: "numeric", // "45"
                    hour12: true, // Use 12-hour clock (AM/PM)
                  })}
                </Card.Text>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text className="text-center">No history found</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <hr style={{ color: "#DA9100", border: "1px solid #DA9100" }} />
      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-2 p-2">
        <Button
          variant="primary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-2 p-2" style={{ color: "#DA9100" }}>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="primary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default DigTreasure;
