import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Button, Alert } from "react-bootstrap";
import { buyInvestment } from "../../store/slices/InvestSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const InvestButton = ({ investmentId, disabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleInvestClick = async () => {
    if (disabled) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await dispatch(buyInvestment(investmentId)).unwrap();
      setMessage(result.detail);
      setIsError(false);
    } catch (err) {
      const cleanedMessage = cleanErrorMessage(
        err?.detail ||
          "Unable to make investment, please make sure you have sufficient funds in your account and try again!"
      );

      setMessage(cleanedMessage);
      setIsError(true);

      if (
        cleanedMessage ===
        "Insufficient Funds for making a Purchase. Please make a deposit and try again. Redirecting to payment page"
      ) {
        setTimeout(() => {
          navigate("/dashboard/user/payment");
        }, 3000);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  // Function to clean the error message
  const cleanErrorMessage = (error) => {
    try {
      const parsed = JSON.parse(error);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0].replace(/^\['|'\]$/g, "");
      }
    } catch (e) {
      console.error("Error parsing error message:", e);
    }
    return error;
  };

  return (
    <div>
      <Button
        variant="primary"
        className="w-100"
        onClick={handleInvestClick}
        disabled={loading || disabled}
        style={{ borderRadius: "8px", padding: "8px" }}
      >
        {loading ? "Processing Subscription..." : "Buy Subscription"}
      </Button>
      {message && (
        <Alert
          variant={isError ? "danger" : "primary"}
          style={{ margin: "auto" }}
          className="mt-2 text-center"
        >
          {message}
        </Alert>
      )}
    </div>
  );
};

InvestButton.propTypes = {
  investmentId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default InvestButton;
