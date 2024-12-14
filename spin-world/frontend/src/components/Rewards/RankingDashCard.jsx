import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRankings } from "../../store/slices/RankingSlice";
import {
  fetchUserInvestments,
  selectUserInvestmentPlans,
  selectUserInvestmentsLoading,
  selectUserInvestmentsError,
} from "../../store/slices/UserInvestmentSlice";
import {
  Row,
  Col,
  Card,
  Button,
  Alert,
  Container,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchUser } from "../../store/slices/UserSlice";
import CurrencyConverter from "../../utils/CurrencyConverter.jsx";

const RankingDashCard = () => {
  const dispatch = useDispatch();
  const { userRanking = [], status } = useSelector((state) => state.ranking);
  const plans = useSelector(selectUserInvestmentPlans);
  const user_loading = useSelector(selectUserInvestmentsLoading);
  const user_error = useSelector(selectUserInvestmentsError);
  const { userInfo, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserRankings());
    dispatch(fetchUserInvestments());
    dispatch(fetchUser());
  }, [dispatch]);

  if (user_loading) {
    return (
      <Container fluid className="p-0">
        <Row className="justify-content-center mt-5">
          <Spinner animation="border" variant="primary" />
        </Row>
      </Container>
    );
  }

  const target_currency = userInfo?.country?.currency;

  return (
    <div className="user-rankings mb-3 px-0">
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={8}>
          <Card
            style={{
              backgroundColor: "#03002e",
              borderRadius: "8px",
              margin: "auto",
              color: "#fff",
            }}
            className="p-4"
          >
            {userRanking && userRanking.length > 0 && plans.length > 0 ? (
              <>
                <h5 className="mb-2 text-center">
                  <Row>
                    <Col xs={12}>
                      <span>
                        You are a{" "}
                        <span>
                          <Link to={`/dashboard/account/user/ranking`}>
                            <Button
                              style={{ fontWeight: "bold" }}
                              variant="info"
                            >
                              {userRanking[0].ranking
                                ? userRanking[0].ranking.name
                                : "N/A"}
                            </Button>
                          </Link>
                        </span>
                      </span>
                      <span className="text-center">
                        <span className="mb-3"> on a </span>
                        <Link to={`/dashboard/plans`}>
                          <Button style={{ fontWeight: "bold" }} variant="info">
                            {" "}
                            {plans[0].investment_plan.name}
                          </Button>
                        </Link>
                      </span>
                    </Col>
                  </Row>
                </h5>
                <hr style={{ border: "1px solid #DA9100" }} />

                <p className="mb-1 text-center">
                  Daily Spins:{" "}
                  <span style={{ color: "#DA9100" }}>
                    ({userRanking[0].ranking.max_spins}){" "}
                  </span>
                </p>
                <p className="mb-1 text-center">
                  Daily Withdrawal Limit:{" "}
                  <span style={{ color: "#DA9100" }}>
                    <span>
                      {plans[0].investment_plan.currency.currency_code}{" "}
                      {plans[0].investment_plan.daily_withdraw_limit}
                    </span>{" "}
                  </span>
                </p>

                <p className="text-center">
                  Prize Multiplier{" "}
                  <span style={{ color: "#DA9100" }}>
                    ({plans[0].investment_plan.prize_multiplier})
                  </span>
                </p>
              </>
            ) : (
              <p>Loading your rank and Subscription Details...</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RankingDashCard;
