"use client";

import React, { useEffect } from "react";
import { Container, Col, Row, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InvestmentCard from "./InvestmentCard";
import { toWords } from "number-to-words";
import {
  fetchInvestments,
  selectInvestments,
  selectLoading,
} from "@/reduxStore/slices/InvestmentsSlice";
import {
  fetchUserInvestments,
  selectUserInvestmentPlans,
  selectUserInvestmentsLoading,
  selectUserInvestmentsError,
} from "@/reduxStore/slices/UserInvestmentSlice";
import CurrencyConverter from "@/app/utils/CurrencyConverter";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import { TbArrowsExchange2 } from "react-icons/tb";

const Investments = () => {
  const dispatch = useDispatch();

  // Select investments data and loading state
  const investments = useSelector(selectInvestments);
  const loading = useSelector(selectLoading);

  // Select user plans, loading, and error state from the userInvestmentSlice
  const plans = useSelector(selectUserInvestmentPlans);
  const user_loading = useSelector(selectUserInvestmentsLoading);
  const user_error = useSelector(selectUserInvestmentsError);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dispatch(fetchInvestments());
    dispatch(fetchUserInvestments());
    dispatch(fetchUser());
  }, [dispatch]);

  // If no available subscription plans
  if (!Array.isArray(investments) || investments.length === 0) {
    return (
      <Container fluid className="p-0">
        <Row className="justify-content-center mt-5">
          <Alert variant="info">
            No subscriptions available at the moment.
          </Alert>
        </Row>
      </Container>
    );
  }

  const target_currency = userInfo?.country?.currency;

  return (
    <Container fluid className="p-0 mt-5">
      {plans.length > 0 ? (
        <Row style={{ margin: "auto" }} className="mb-4">
          <Col>
            <div
              className="p-4 text-light"
              style={{
                padding: "15px",
                backgroundColor: "#03002e",
                borderRadius: "8px",
              }}
            >
              <h4 className="mb-4 text-center">
                <div>
                  Current Plan:
                  <div
                    className="text-center"
                    style={{
                      backgroundColor: "#FF8C00",
                      color: "#FFFFFF",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    {plans[0].investment_plan.name}
                  </div>
                </div>
              </h4>
              <hr />
              <h5 className="text-center">Your Benefits</h5>
              <hr />
              <p>
                Duration:{" "}
                <span style={{ color: "#DA9100" }}>
                  {toWords(plans[0].investment_plan.duration_in_months)} (
                  {plans[0].investment_plan.duration_in_months}) months
                </span>
              </p>
              <p>
                Daily Withdrawal Limit:{" "}
                <span>
                  {" "}
                  {plans[0].investment_plan.currency.currency_code}
                  <span style={{ color: "#DA9100" }}>
                    {" "}
                    {plans[0].investment_plan.daily_withdraw_limit}
                  </span>
                </span>{" "}
                <TbArrowsExchange2 size={18} />{" "}
                <span>
                  {" "}
                  <CurrencyConverter
                    amountInBaseCurrency={
                      plans[0].investment_plan.daily_withdraw_limit
                    }
                    targetCurrency={target_currency}
                  />
                </span>
              </p>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="mb-4">
          <Col>
            <Alert variant="info">No Data Yet, Please reload this Page</Alert>
          </Col>
        </Row>
      )}

      <hr style={{ border: "1px solid #fafafa" }} />
      <h5
        className="text-center"
        style={{ color: "#DA9100", fontWeight: "bold" }}
      >
        Available Subscription Plans
      </h5>
      <Row style={{ margin: "auto" }}>
        {investments.map((investment) => (
          <Col key={investment.id} xs={12} md={3}>
            <InvestmentCard
              name={investment.name}
              durationInMonths={investment.duration_in_months}
              prizeMultiplier={investment.prize_multiplier}
              dailyWithdrawLimit={investment.daily_withdraw_limit}
              investmentPrice={investment.price}
              investmentId={String(investment.id)}
              currency={investment.currency}
              description={investment.description}
              isFirstPlan={investment.number === 1}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Investments;
