import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import { fetchUser } from "../../store/slices/UserSlice";
import CurrencyConverter from "../../utils/CurrencyConverter.jsx";
import { useDispatch, useSelector } from "react-redux";

const EarningsCard = ({ investment }) => {
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const target_currency = userInfo?.country?.currency;

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title className="text-center text-success mb-3 text-bold">
          {investment.investment_plan.name}
        </Card.Title>
        <Card.Text>
          <Row>
            <Col>
              <Row>
                <Col xs={12}>
                  <span style={{ color: "#FF8C00" }}>
                    <CurrencyConverter
                      amountInBaseCurrency={
                        investment.investment_plan.daily_income
                      }
                      targetCurrency={target_currency}
                    />
                    {formatCurrency(
                      investment.investment_plan.daily_income,
                      investment.investment_plan.currency.code
                    )}
                  </span>
                </Col>
                <Col>
                  <h6>Daily Income</h6>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col xs={12}>
                  <div style={{ color: "#FF8C00" }}>
                    {formatCurrency(
                      investment.investment_plan.total_income,
                      investment.investment_plan.currency.code
                    )}
                  </div>
                </Col>
                <Col>
                  <h6>Total Income</h6>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className="align-items-center">
          <Col>
            <Row className="justify-content-between">
              <Col xs="auto">
                <span>
                  Date Created:{" "}
                  {new Date(
                    investment.investment_plan.created_at
                  ).toLocaleString()}
                </span>
              </Col>
              <Col xs="auto">
                <span>Expired: {investment.expired ? "Yes" : "No"}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

EarningsCard.propTypes = {
  investment: PropTypes.shape({
    investment_plan: PropTypes.shape({
      name: PropTypes.string.isRequired,
      daily_income: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      total_income: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired,
      }).isRequired,
      image: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    }).isRequired,
    expired: PropTypes.bool.isRequired,
  }).isRequired,
};

export default EarningsCard;
