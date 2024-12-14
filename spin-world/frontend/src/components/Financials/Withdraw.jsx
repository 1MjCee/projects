import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWithdrawalTerms } from "../../store/slices/WithdrawalTermsSlice";
import {
  Form,
  Alert,
  Container,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import WithdrawalButton from "./WithdrawalButton";
import { fetchWalletStats, selectWallet } from "../../store/slices/WalletSlice";
import CurrencyConverter from "../../utils/CurrencyConverter";
import { fetchUser } from "../../store/slices/UserSlice";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const { balance, totalEarnings, currency } = useSelector(selectWallet);
  const { userInfo } = useSelector((state) => state.user);

  const { loading, success } = useSelector((state) => state.withdrawal);
  const {
    terms,
    loading: termsLoading,
    error: termsError,
  } = useSelector((state) => state.withdrawalTerms);

  const formatCurrency = (amount, currencySymbol = "$") => {
    const parsedAmount = parseFloat(amount);

    const formattedAmount = Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
    }).format(parsedAmount);

    const formattedWithSpaces = formattedAmount.replace(/,/g, ", ");

    return `${currencySymbol} ${formattedWithSpaces}`;
  };

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUser());
    }
    dispatch(fetchWalletStats());
    dispatch(fetchWithdrawalTerms());
    if (success) {
      setAmount("");
    }
  }, [dispatch, success]);

  // Access user's country currency symbol
  const target_currency = userInfo?.country?.currency;

  return (
    <Container fluid>
      <div
        style={{
          backgroundColor: "#03002e",
          borderRadius: "8px",
          border: "1px solid #DA9100",
        }}
        className="mt-4 p-3 text-light"
      >
        <header>
          <h4 className="text-center mt-4" style={{ color: "#DA9100" }}>
            Withdrawal Terms and Conditions
          </h4>
          <p className="text-center p-3">
            Please adhere to these terms and conditions
          </p>
        </header>
        <hr />
        <div>
          {termsLoading && <Spinner animation="border" />}
          {termsError && <Alert variant="danger">{termsError}</Alert>}
          {terms && terms.length > 0 ? (
            terms.map((term) => (
              <div key={term.id} className="mb-3">
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Minimum Withdrawal Amount:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {formatCurrency(
                          term.minimum_withdrawal_amount,
                          term.currency.symbol
                        )}
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawal Timeframe:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_timeframe_start} -{" "}
                        {term.withdrawal_timeframe_end}
                      </span>
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Processing Time:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_processing_time_min} to{" "}
                        {term.withdrawal_processing_time_max} hours
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawals Processed on Weekends:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawals_processed_on_weekends ? "Yes" : "No"}
                      </span>
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Withdrawal Tax Percentage:</strong>{" "}
                      <span style={{ color: "#DA9100" }}>
                        {term.withdrawal_tax_percentage}%
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <p>No withdrawal terms available.</p>
          )}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#03002e",
          borderRadius: "8px",
          border: "1px solid #DA9100",
        }}
        className="mt-5 p-3"
      >
        <header>
          <h4 className="text-center mt-4" style={{ color: "#DA9100" }}>
            Withdraw
          </h4>
          <p className="text-center text-light p-3">
            Please adhere to the above terms and conditions
          </p>
        </header>

        <Card className="mx-3 text-center bg-info">
          <Card.Body>
            <Row>
              <Col xs={12}>
                <Card.Text>
                  <span className="text-center">
                    Withdrawable Balance <br />
                    {formatCurrency(totalEarnings, currency.currency_code)}
                  </span>
                </Card.Text>
              </Col>
              <hr />
              <Col>
                <Card.Text>
                  Converts to:{" "}
                  <CurrencyConverter
                    amountInBaseCurrency={totalEarnings}
                    targetCurrency={target_currency}
                  />
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Form className="mb-4 p-3">
          <Form.Group>
            <Form.Label style={{ color: "#fafafa" }}>
              Amount to Withdraw
            </Form.Label>
            <Form.Control
              id="withdraw-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
              className="mb-3"
              disabled={loading}
              autoComplete="on"
            />
          </Form.Group>
          <WithdrawalButton amount={amount} />
        </Form>
      </div>
    </Container>
  );
};

export default Withdraw;
