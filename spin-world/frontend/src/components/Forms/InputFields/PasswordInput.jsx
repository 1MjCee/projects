import React from "react";
import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col, Button } from "react-bootstrap";
import { MdOutlineVpnKey } from "react-icons/md";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const PasswordInput = ({
  formData,
  handleChange,
  showPassword,
  togglePasswordVisibility,
}) => (
  <Form.Group className="mb-2">
    <Form.Label style={{ color: "#DA9100" }}>Password</Form.Label>
    <InputGroup>
      <Row className="w-100 gx-2">
        {/* <Col xs={2} sm="auto" className="d-flex">
          <InputGroup.Text style={{ backgroundColor: "#03002e" }}>
            <MdOutlineVpnKey color="#DA9100" style={{ fontSize: "20px" }} />
          </InputGroup.Text>
        </Col> */}
        <Col xs={10}>
          <Form.Control
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              height: "36px",
              backgroundColor: "#03002e",
              color: "#fafafa",
            }}
            placeholder="Enter your password"
            className="shadow-sm w-100"
            autoComplete="off"
          />
          <style>
            {`
      #password::placeholder {
        color: #fafafa;
        background-color: #03002e;
      }
    `}
          </style>
        </Col>
        <Col className="align-items-center">
          <Button
            style={{ height: "35px" }}
            className="w-100"
            variant="outline-primary"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </Button>
        </Col>
      </Row>
    </InputGroup>
  </Form.Group>
);

PasswordInput.propTypes = {
  formData: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  togglePasswordVisibility: PropTypes.func.isRequired,
};

export default PasswordInput;
