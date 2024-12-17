import React from "react";
import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col } from "react-bootstrap";

const EmailInput = ({ formData, handleChange }) => (
  <Form.Group className="mb-2">
    <Form.Label style={{ color: "#DA9100" }}>Email</Form.Label>
    <InputGroup>
      <Row className="w-100 gx-2">
        <Col xs={12}>
          <Form.Control
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              height: "36px",
              backgroundColor: "#03002e",
              color: "#fafafa",
            }}
            placeholder="Enter your email"
            className="shadow-sm w-100"
            autoComplete="off"
          />
          <style>
            {`
              #email::placeholder {
                color: #fafafa;
                background-color: #03002e;
              }
            `}
          </style>
        </Col>
      </Row>
    </InputGroup>
  </Form.Group>
);

EmailInput.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default EmailInput;
