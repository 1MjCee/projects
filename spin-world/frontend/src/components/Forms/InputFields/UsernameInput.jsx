import React from "react";
import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col, Button } from "react-bootstrap";
import { MdPerson } from "react-icons/md";

const UsernameInput = ({ formData, handleChange }) => (
  <Form.Group className="mb-2">
    <Form.Label style={{ color: "#DA9100" }}>Username</Form.Label>
    <InputGroup>
      <Row className="w-100 gx-2">
        <Col xs={12}>
          <Form.Control
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              height: "36px",
              backgroundColor: "#03002e",
              color: "#fafafa",
            }}
            placeholder="Enter your username"
            className="shadow-sm w-100"
            autoComplete="off"
          />
          <style>
            {`
              #username::placeholder {
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

UsernameInput.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default UsernameInput;
