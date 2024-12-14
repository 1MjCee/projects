import React, { useEffect } from "react";
import { Row, Col, Container, Spinner, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletStats } from "../../store/slices/WalletSlice";
import { fetchUser } from "../../store/slices/UserSlice";
import CurrencyFormatter from "../../utils/formatCurrency";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import ActionNavbar from "../Home/ActionBar";
import Financials from "./Financials";
import CurrencyConverter from "../../utils/CurrencyConverter";

const BalanceInfo = () => {
  const dispatch = useDispatch();
  const {
    currency,
    balance,
    totalEarnings,
    deposit,
    withdrawal,
    interest,
    loading,
  } = useSelector((state) => state.wallet);
  const { userInfo, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchWalletStats());
    dispatch(fetchUser());
  }, [dispatch]);

  const target_currency = userInfo?.country?.currency;

  return (
    <Container
      style={{ backgroundColor: "#010048" }}
      fluid
      className="px-0 mt-3"
    >
      {loading ? (
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant="success"
            style={{ width: "3rem", height: "3rem", margin: "auto" }}
          />
        </div>
      ) : (
        <Card
          style={{
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#03002e",
          }}
        >
          <Card.Body>
            <Row className="text-center gx-2">
              <Col xs={12} className="mb-2">
                <Card style={{ border: "none" }}>
                  <Card.Body style={{ backgroundColor: "#010048" }}>
                    <div className="border-0">
                      <a href="#" className="text-decoration-none">
                        <h5
                          style={{ color: "#FF8C00", fontWeight: "bold" }}
                          className="mb-0"
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            {currency.currency_code} {deposit}
                          </span>
                        </h5>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#004225",
                            fontWeight: "bold",
                          }}
                          className="text-light"
                        >
                          Deposits
                        </span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} className="mb-2">
                <Card style={{ border: "none", borderRadius: "8px" }}>
                  <Card.Body
                    style={{
                      backgroundColor: "#010048",
                      border: "none",
                    }}
                  >
                    <div className="border-0 w-100">
                      <a href="#" className="text-decoration-none">
                        <h5 className="mb-1 text-success">
                          <span
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            <CurrencyConverter
                              amountInBaseCurrency={totalEarnings}
                              targetCurrency={target_currency}
                            />
                          </span>
                        </h5>

                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                          className="text-light"
                        >
                          Earnings
                        </span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} className="mb-2">
                <Card style={{ border: "none" }}>
                  <Card.Body style={{ backgroundColor: "#010048" }}>
                    <div className="border-0 w-100">
                      <a href="#" className="text-decoration-none">
                        <h5 className="mb-0 text-danger">
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            <CurrencyConverter
                              amountInBaseCurrency={withdrawal}
                              targetCurrency={target_currency}
                            />
                          </span>
                        </h5>{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#004225",
                          }}
                          className="text-light"
                        >
                          Withdrawals
                        </span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12}>
                <Card style={{ border: "none" }}>
                  <Card.Body style={{ backgroundColor: "#010048" }}>
                    <div className="border-0">
                      <a href="#" className="text-decoration-none">
                        <h5
                          style={{ color: "#FF8C00", fontWeight: "bold" }}
                          className="mb-0"
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            <CurrencyConverter
                              amountInBaseCurrency={balance}
                              targetCurrency={target_currency}
                            />
                          </span>
                        </h5>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#004225",
                            fontWeight: "bold",
                          }}
                          className="text-light"
                        >
                          Total Balance
                        </span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              {" "}
              <Financials />
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default BalanceInfo;
