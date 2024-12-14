import PropTypes from "prop-types";
import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { IoIosPhonePortrait } from "react-icons/io";

const PhoneInput = ({
  countries,
  selectedCountry,
  handleCountryChange,
  formData,
  handleChange,
  isPhoneNumberValid,
}) => {
  return (
    <Form.Group className="mb-2">
      <Form.Label style={{ color: "#DA9100" }}>Phone Number</Form.Label>
      <InputGroup style={{ backgroundColor: "#010048" }}>
        <Row className="w-100 gx-2">
          {/* <Col xs={1} sm="auto" className="d-flex">
            <InputGroup.Text
              style={{ backgroundColor: "#03002e" }}
              id="basic-addon1"
            >
              <IoIosPhonePortrait
                color="#DA9100"
                style={{ fontSize: "25px" }}
              />
            </InputGroup.Text>
          </Col> */}
          <Col xs={4} sm="auto" className="d-flex">
            <Form.Select
              id="country-select"
              onChange={handleCountryChange}
              value={selectedCountry ? selectedCountry.id : ""}
              aria-label="Country calling code"
              style={{
                height: "100%",
                backgroundColor: "#03002e",
                color: "#fafafa",
              }}
            >
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.country_code} ({country.calling_code})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col className="d-flex">
            <Form.Control
              id="phone-number"
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className={`shadow-sm w-100 ${
                !isPhoneNumberValid ? "is-invalid" : ""
              }`}
              autoComplete="on"
              style={{
                height: "100%",
                backgroundColor: "#03002e",
                color: "#fafafa",
              }}
            />
            <style>
              {`
      #phone-number::placeholder {
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
};

PhoneInput.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      country_code: PropTypes.string.isRequired,
      calling_code: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCountry: PropTypes.shape({
    id: PropTypes.number,
    country_code: PropTypes.string,
    calling_code: PropTypes.string,
  }),
  handleCountryChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    phone_number: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  isPhoneNumberValid: PropTypes.bool.isRequired,
};

export default PhoneInput;
