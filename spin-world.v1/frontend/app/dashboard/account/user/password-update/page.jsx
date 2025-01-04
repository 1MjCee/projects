"use client";

import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  clearState,
} from "@/reduxStore/slices/UpdatePasswordSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(
    (state) => state.changePassword
  );

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  // State for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setAlertMessage("");

    if (!oldPass || !newPass || newPass !== rePass) {
      setAlertMessage("Please ensure all fields are filled correctly.");
      setAlertVariant("danger");
      return;
    }

    const data = { oldPassword: oldPass, newPassword: newPass };
    dispatch(changePassword(data));
  };

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertVariant("danger");
    }
    if (success) {
      setAlertMessage(success);
      setAlertVariant("success");
      dispatch(clearState()); // Clear state after showing success
    }
  }, [error, success, dispatch]);

  return (
    <Container fluid className="px-0 py-5 mt-5">
      <div
        style={{ backgroundColor: "#03002e" }}
        className="page-content p-4 shadow rounded"
      >
        <h2 style={{ color: "#DA9100" }} className="mb-4 text-center">
          Change Password
        </h2>

        {alertMessage && (
          <Alert
            variant={alertVariant}
            onClose={() => setAlertMessage("")}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className="text-light">Old Password</Form.Label>
            <Form.Control
              id="old-password"
              className="mb-3 bg-light"
              type={showOldPassword ? "text" : "password"}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              required
              placeholder="Enter old password"
              autoComplete="on"
            />
            <Form.Check
              className="text-primary"
              id="pass-check"
              type="checkbox"
              label="Show password"
              onChange={() => setShowOldPassword(!showOldPassword)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-light">New Password</Form.Label>
            <Form.Control
              id="new-password"
              className="mb-3 bg-light"
              type={showNewPassword ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              placeholder="Enter new password"
              autoComplete="on"
            />
            <Form.Check
              className="text-primary"
              id="new-pass-check"
              type="checkbox"
              label="Show password"
              onChange={() => setShowNewPassword(!showNewPassword)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-light">Confirm New Password</Form.Label>
            <Form.Control
              id="confirm-new-password"
              className="mb-3 bg-light"
              type={showRePassword ? "text" : "password"}
              value={rePass}
              onChange={(e) => setRePass(e.target.value)}
              required
              placeholder="Re-enter new password"
              autoComplete="on"
            />
            <Form.Check
              className="text-primary"
              id="confirm-new-pass-check"
              type="checkbox"
              label="Show password"
              onChange={() => setShowRePassword(!showRePassword)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="mt-3 w-100"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ChangePassword;
