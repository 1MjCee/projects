import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Table,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchReferralStats } from "../../../store/slices/ReferralsSlice";
import { fetchWalletStats } from "../../../store/slices/WalletSlice";
import SubHeader from "../../SubHeader";
import CurrencyFormatter from "../../../utils/formatCurrency";

const TeamLevel = () => {
  const { level } = useParams();
  const dispatch = useDispatch();
  const { loading, error, levels, referral_commission_total, level_commision } =
    useSelector((state) => state.referral);
  const { currency } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchReferralStats());
    dispatch(fetchWalletStats());
  }, [dispatch]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  // Find the specific level data
  const levelData = levels.find((l) => l.level === parseInt(level));

  return (
    <Container fluid className="bg-light">
      <SubHeader title={`My Level ${level} Statistics`} />

      <div>
        {levelData ? (
          <>
            <Row className="mb-4">
              <Col>
                <Card
                  style={{ backgroundColor: "#F5F5DC" }}
                  className="text-center mb-3"
                >
                  <div>
                    <Row>
                      <h5 className="mb-4 mt-3 text-success">Team Overview</h5>
                    </Row>
                    <Row className="mb-4">
                      <Col xs={12}>
                        <Row>
                          <Col xs={12}>
                            <h5 style={{ color: "#FF8C00" }}>
                              {levelData.count}
                            </h5>
                          </Col>
                          <Col>
                            <h6>Total Users</h6>
                          </Col>
                        </Row>
                      </Col>
                      <hr
                        style={{
                          width: "60%",
                          margin: "auto",
                          marginBottom: "10px",
                          marginTop: "10px",
                          color: "#004225",
                        }}
                      />
                      <Col xs={6}>
                        <Row>
                          <Col xs={12}>
                            <h5 style={{ color: "#FF8C00" }}>
                              {
                                levelData.referrals.filter(
                                  (user) => !user.completed
                                ).length
                              }
                            </h5>
                          </Col>
                          <Col>
                            <h6>Pending Referrals</h6>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={6}>
                        <Row>
                          <Col xs={12}>
                            <h5 style={{ color: "#FF8C00" }}>
                              {
                                levelData.referrals.filter(
                                  (user) => user.completed
                                ).length
                              }
                            </h5>
                          </Col>
                          <Col>
                            <h6>Completed Referrals</h6>
                          </Col>
                        </Row>
                      </Col>
                      <hr
                        style={{
                          width: "60%",
                          margin: "auto",
                          marginBottom: "10px",
                          marginTop: "10px",
                          color: "#004225",
                        }}
                      />
                      <Col xs={12}>
                        <Row>
                          <Col xs={12}>
                            <h5 style={{ color: "#FF8C00" }}>
                              {currency.symbol}{" "}
                              <CurrencyFormatter
                                value={level_commision[level]}
                              />
                            </h5>
                          </Col>
                          <Col>
                            <h6>Total Level Commission</h6>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row className="g-3">
              <Col xs={12}>
                <h5 className="text-center text-success">Team Members</h5>
                <p className="text-center">
                  Here are all your referrals, both pending and completed
                </p>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User Id</th>
                      <th>Mobile</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelData.referrals.map((user) => (
                      <tr key={user.referrer}>
                        <td>{user.referred.id}</td>
                        <td>{user.referred.phone_number}</td>
                        <td>{user.completed ? "Completed" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-center text-muted">
            <h6>No Data Available for this Level</h6>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TeamLevel;
