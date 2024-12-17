import React from "react";
import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col } from "react-bootstrap";

const InviteInput = ({ formData, handleChange }) => (
  <Form.Group className="mb-2">
    <Form.Label style={{ color: "#DA9100" }}>Invite Code</Form.Label>
    <InputGroup>
      <Row className="w-100 gx-1">
        <Col className="d-flex">
          <Form.Control
            id="invite-code"
            type="text"
            name="invite_code"
            value={formData.invite_code}
            onChange={handleChange}
            placeholder="Enter invite code (optional)"
            className="w-100"
            autoComplete="on"
            style={{ backgroundColor: "#03002e", color: "#fafafa" }}
          />
          <style>
            {`
      #invite-code::placeholder {
        color: #fafafa;
      }
    `}
          </style>
        </Col>
      </Row>
    </InputGroup>
  </Form.Group>
);

InviteInput.propTypes = {
  formData: PropTypes.shape({
    invite_code: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InviteInput;
