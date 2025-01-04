"use client";

import React, { useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import InvestButton from "./InvestButton";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import CurrencyConverter from "@/app/utils/CurrencyConverter";

const InvestmentCard = ({
  name,
  durationInMonths,
  prizeMultiplier,
  dailyWithdrawLimit,
  investmentPrice,
  currency,
  investmentId,
  description,
  isFirstPlan,
}) => {
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const target_currency = userInfo?.country?.currency;
  return (
    <Card
      className="my-3"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        width: "100%",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#03002e",
        border: "1px solid #DA9100",
      }}
    >
      <Row className="g-0">
        {/* Left column with Plan Type */}
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center mb-3"
        >
          <div
            className="text-center"
            style={{
              backgroundColor: "#FF8C00",
              color: "#FFFFFF",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {name}
          </div>
        </Col>
        <hr style={{ border: "1px solid #fafafa" }} />

        {/* Right column with Plan Details */}
        <Col xs={12}>
          <Card.Body>
            {/* Duration */}
            <Card.Text
              className="text-center text-light"
              style={{
                color: "#FF8C00",

                fontSize: "12px",
              }}
            >
              {investmentPrice === "0.00" ||
              parseFloat(investmentPrice) === 0 ? (
                <span>Expires: Never</span>
              ) : (
                <span>
                  Expires: After {durationInMonths} month
                  {durationInMonths > 1 ? "s" : ""}
                </span>
              )}
            </Card.Text>

            {/* Investment Price */}
            <Card.Text
              className="text-center text-light"
              style={{ fontSize: "12px" }}
            >
              <span>Price: </span>
              {investmentPrice === "0.00" ||
              parseFloat(investmentPrice) === 0 ? (
                <span>Free Forever</span>
              ) : (
                <span>
                  {currency.currency_code}{" "}
                  <span style={{ color: "#DA9100" }}>{investmentPrice}</span> ||{" "}
                  <CurrencyConverter
                    amountInBaseCurrency={investmentPrice}
                    targetCurrency={target_currency}
                  />
                </span>
              )}
            </Card.Text>

            {/* Extra Spins */}
            <Card.Text
              className="text-center"
              style={{
                fontSize: "12px",
                color: "#FF8C00",
              }}
            >
              Prize Multiplier: {prizeMultiplier} <br />
              <span className="text-light">
                For every prize, we multiply the price by {prizeMultiplier}
              </span>
            </Card.Text>

            {/* Daily Withdrawal Limit */}
            <Card.Text
              className="text-center"
              style={{
                fontSize: "12px",
                color: "#FF8C00",
              }}
            >
              Daily Withdrawal Limit: {currency.currency_code}{" "}
              {dailyWithdrawLimit} ||{" "}
              <CurrencyConverter
                amountInBaseCurrency={dailyWithdrawLimit}
                targetCurrency={target_currency}
              />
            </Card.Text>
            <Card.Text
              className="text-center text-light"
              style={{
                fontSize: "12px",
              }}
            >
              {description}
            </Card.Text>
          </Card.Body>
        </Col>
        <hr style={{ border: "1px solid #fafafa" }} />

        {/* Invest Button */}
        <Col xs={12} className="justify-content-center mt-3">
          <InvestButton investmentId={investmentId} disabled={isFirstPlan} />
        </Col>
      </Row>
    </Card>
  );
};

// Prop Types for validation
InvestmentCard.propTypes = {
  name: PropTypes.string.isRequired,
  durationInMonths: PropTypes.number.isRequired,
  extraDailySpins: PropTypes.number.isRequired,
  dailyWithdrawLimit: PropTypes.number.isRequired,
  investmentPrice: PropTypes.string.isRequired,
  investmentId: PropTypes.string.isRequired,
  currency: PropTypes.object.isRequired,
};

export default InvestmentCard;
