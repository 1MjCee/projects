import React from "react";
import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { TbMessage2Plus } from "react-icons/tb";

const SMSInput = ({ formData, handleChange }) => (
  <InputGroup className="mb-3">
    <Row className="w-100 gx-1">
      {" "}
      {/* gx-1 adds minimal horizontal gap */}
      <Col xs={2} sm="auto" className="d-flex">
        <InputGroup.Text>
          <TbMessage2Plus style={{ fontSize: "24px" }} />
        </InputGroup.Text>
      </Col>
      <Col className="d-flex">
        <Form.Control
          id="sms-code"
          type="text"
          name="sms_code"
          value={formData.sms_code}
          onChange={handleChange}
          placeholder="Enter SMS code"
          required
          className="shadow-sm w-100"
          autoComplete="on"
        />
      </Col>
    </Row>
  </InputGroup>
);

SMSInput.propTypes = {
  formData: PropTypes.shape({
    sms_code: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default SMSInput;
