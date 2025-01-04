"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserRankings,
  fetchAllRankings,
} from "@/reduxStore/slices/RankingSlice";
import { Row, Col, Card, Container } from "react-bootstrap";
import SubHeader from "../SubHeader";
import { GiLevelFour } from "react-icons/gi";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import CurrencyConverter from "@/app/utils/CurrencyConverter";
import { fetchWalletStats } from "@/reduxStore/slices/WalletSlice";

const UserRanking = () => {
  const dispatch = useDispatch();
  const {
    allRankings = [],
    userRanking = [],
    status,
  } = useSelector((state) => state.ranking);
  const { userInfo, error } = useSelector((state) => state.user);
  const { currency } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchUserRankings());
    dispatch(fetchAllRankings());
    dispatch(fetchUser());
    dispatch(fetchWalletStats());
  }, [dispatch]);

  const target_currency = userInfo?.country?.currency;

  return (
    <Container className="user-rankings px-0 mt-3">
      <SubHeader title="User Ranking" />
      <p className="text-center text-light">
        Your level based on the ranking scheme
      </p>
      <hr />
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "auto px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
          }}
          className="text-center text-light mt-2"
        >
          <Card
            style={{ backgroundColor: "#03002e", borderRadius: "15px" }}
            className="py-3 px-0 text-light w-100"
          >
            {userRanking && userRanking.length > 0 ? (
              <div>
                <h5 className="mb-3 font-weight-bold">
                  <Row>
                    <Col xs={12}>
                      <span>Your Current Level is:</span>
                    </Col>
                    <Col className="mt-2">
                      <span
                        className="mt-5"
                        style={{
                          color: "#FF8C00",
                          fontWeight: "bold",
                        }}
                      >
                        <GiLevelFour size={20} color="#DA9100" />{" "}
                        {userRanking[0].ranking
                          ? userRanking[0].ranking.name
                          : "N/A"}{" "}
                        <GiLevelFour size={20} color="#DA9100" />
                      </span>
                    </Col>
                  </Row>
                </h5>
              </div>
            ) : (
              <p>Loading your rank...</p>
            )}
          </Card>
        </div>
      </Row>
      <hr style={{ color: "#fafafa" }} />
      <h5 className="text-center text-light mt-3">Available Levels</h5>
      <p style={{ color: "#DA9100", padding: "5px" }} className="text-center">
        Available Ranking Levels, requirements for reaching each level, and
        benefits per level{" "}
      </p>
      <Row className="justify-content-center mt-4 mb-4">
        {allRankings.length === 0 ? (
          // Fallback message if there are no rankings
          <Col xs={12} className="text-center">
            <p style={{ color: "#FF8C00", fontWeight: "bold" }}>
              No ranking levels available yet.
            </p>
          </Col>
        ) : (
          // Render the rankings only if they meet the conditions
          allRankings.map((ranking, index) => {
            return (
              (ranking.minimum_referrals >= 0 ||
                ranking.minimum_spending >= 0) && (
                <Col xs={12} md={4} key={ranking.ranking}>
                  <Card
                    style={{
                      backgroundColor: "#03002e",
                      color: "#fafafa",
                      borderRadius: "15px",
                    }}
                    className="p-3"
                  >
                    <Row className="align-items-center">
                      <Col xs={12} className="mb-2">
                        <div className="ranking-circle">{index + 1}</div>
                      </Col>
                      <Col>
                        <div style={{ fontWeight: "bold" }} className="mt-2">
                          <GiLevelFour size={20} color="#DA9100" />{" "}
                          {ranking.name}{" "}
                          <GiLevelFour size={20} color="#DA9100" />
                        </div>
                        <hr />

                        <div className="text-light">
                          {/* Conditional rendering for Requirements Section */}
                          {(ranking.minimum_referrals >= 0 ||
                            ranking.minimum_spending >= 0) && (
                            <div>
                              <h6
                                className="mt-3 text-start"
                                style={{ color: "#FF8C00", fontWeight: "bold" }}
                              >
                                Requirements{" "}
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    fontSize: "11px",
                                  }}
                                  className="text-info"
                                >
                                  {" "}
                                  - You must achieve one of the following
                                </span>
                              </h6>
                              <ul
                                style={{
                                  fontStyle: "italic",
                                  fontSize: "12px",
                                }}
                                className="text-start"
                              >
                                {ranking.minimum_referrals >= 0 && (
                                  <li>
                                    <strong>Total Referrals:</strong>{" "}
                                    {ranking?.minimum_referrals}
                                  </li>
                                )}
                                {ranking.minimum_spending >= 0 && (
                                  <li>
                                    <strong>Minimum Spending: </strong>{" "}
                                    {currency.currency_code}{" "}
                                    {ranking?.minimum_spending}
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Conditional rendering for Benefits Section */}
                          {ranking.max_spins > 0 && (
                            <div>
                              <h6
                                className="mt-3 text-start"
                                style={{ color: "#FF8C00", fontWeight: "bold" }}
                              >
                                Benefits
                              </h6>
                              <ul
                                style={{
                                  fontStyle: "italic",
                                  fontSize: "12px",
                                }}
                                className="text-start"
                              >
                                <li>
                                  <strong>Daily Max Spins:</strong>{" "}
                                  {ranking.max_spins} spins
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )
            );
          })
        )}
      </Row>

      <style jsx>{`
        .user-rankings {
          font-family: "Arial", sans-serif;
          color: #333;
        }
        .ranking-circle {
          border-radius: 50%;
          border: 2px solid blue;
          padding: 15px;
          background-color: #010048;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        .requirements,
        .benefits {
          font-size: 12px;
        }
        .step {
          transition: transform 0.3s;
        }
        .step.completed {
          transform: scale(1.05);
        }
        .step.current {
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
        }
      `}</style>
    </Container>
  );
};

export default UserRanking;
