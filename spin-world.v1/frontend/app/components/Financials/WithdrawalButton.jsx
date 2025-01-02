"use client";

import { useState, useEffect } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  submitWithdrawalRequest,
  selectWithdrawalRequestLoading,
  selectWithdrawalRequestError,
  selectWithdrawalRequestSuccess,
  resetMessages,
} from "@/reduxStore/slices/WithdrawalRequestSlice";

const WithdrawalButton = ({ amount }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectWithdrawalRequestLoading);
  const error = useSelector(selectWithdrawalRequestError);
  const success = useSelector(selectWithdrawalRequestSuccess);

  // State for validation error message
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(resetMessages());
    setValidationError("");

    // Validate amount before dispatching
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setValidationError("Please specify a valid withdrawal amount.");
      return;
    }

    await dispatch(submitWithdrawalRequest(amount));
  };

  const handleDismissError = () => {
    dispatch(resetMessages());
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" /> Processing...
          </>
        ) : (
          "Submit Withdrawal Request"
        )}
      </Button>

      {validationError && (
        <Alert variant="warning" className="mt-3">
          {validationError}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          className="mt-3 text-center"
          onClose={handleDismissError}
          dismissible
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="primary"
          className="mt-3 text-center"
          onClose={handleDismissError}
          dismissible
        >
          {success.message}
        </Alert>
      )}
    </div>
  );
};

export default WithdrawalButton;
