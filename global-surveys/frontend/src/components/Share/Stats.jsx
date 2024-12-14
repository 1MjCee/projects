import { useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchReferralStats } from "../../store/slices/ReferralsSlice";
import { fetchWalletStats } from "../../store/slices/WalletSlice";
import { fetchUser } from "../../store/slices/UserSlice";
import CurrencyConverter from "../../utils/CurrencyConverter.jsx";

const Stats = () => {
  const dispatch = useDispatch();
  const totalReferrals = useSelector((state) => state.referral.totalReferrals);
  const totalEarnings = useSelector((state) => state.wallet.totalEarnings);
  const currency = useSelector((state) => state.wallet.currency);
  const { userInfo, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchReferralStats());
    dispatch(fetchWalletStats());
    dispatch(fetchUser());
  }, [dispatch]);

  const target_currency = userInfo?.country?.currency;

  return (
    <Container fluid className="mt-4">
      <Card
        className="mt-4 mb-2"
        style={{ height: "80px", backgroundColor: "#03002e" }}
      >
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Row className="text-center w-100">
            <Col
              lg={6}
              md={6}
              sm={6}
              xs={6}
              className="d-flex flex-column align-items-center"
            >
              <h5 className="mb-1" style={{ color: "#FFB000" }}>
                {totalReferrals}
              </h5>
              <hr
                style={{
                  width: "15%",
                  margin: "5px 0",
                  border: "1px solid #004225",
                }}
              />
              <p style={{ fontWeight: "bold", color: "#fafafa" }}>Team Size</p>
            </Col>
            <Col
              lg={6}
              md={6}
              sm={6}
              xs={6}
              className="d-flex flex-column align-items-center"
            >
              <h5 style={{ color: "#FFB000" }}>
                <CurrencyConverter
                  amountInBaseCurrency={totalEarnings}
                  targetCurrency={target_currency}
                />
              </h5>
              <hr
                style={{
                  width: "10%",
                  margin: "0",
                  border: "1px solid #004225",
                }}
              />
              <p style={{ fontWeight: "bold", color: "#fafafa" }}>
                Total Earnings
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Stats;
