import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { fetchReferralStats } from "../../../store/slices/ReferralsSlice";
import SubHeader from "../../SubHeader";
import { fetchWalletStats } from "../../../store/slices/WalletSlice";
import CurrencyFormatter from "../../../utils/formatCurrency";

const MyTeam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { referralData, level_commision, levels, loading, error } = useSelector(
    (state) => state.referral
  );
  const { currency } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchReferralStats());
    dispatch(fetchWalletStats());
  }, [dispatch]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  if (!referralData || !referralData.levels)
    return <Alert variant="info">No data available</Alert>;

  const handleReadMore = (level) => {
    navigate(`/account/user/team/${level}`);
  };

  return (
    <Container fluid style={{ minHeight: "100vh" }}>
      <SubHeader title="My Team" />
      <div className="team_box">
        {referralData.levels.map((tier) => (
          <Card key={tier.level} className="mb-4 shadow-sm">
            <Card.Header>
              <h5 className="text-info text-center">
                {" "}
                -- Level {tier.level} --
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col>
                  <h5>{tier.count}</h5>
                  <h6>Users</h6>
                </Col>
                <Col>
                  <h5>
                    {currency.symbol}{" "}
                    <CurrencyFormatter value={level_commision[tier.level]} />
                  </h5>
                  <h6>Commission</h6>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                className="w-100"
                variant="outline-success"
                onClick={() => handleReadMore(tier.level)}
                aria-label={`Read more about Level ${tier.level}`}
              >
                Read more
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MyTeam;
