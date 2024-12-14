import { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletStats } from "../../../store/slices/WalletSlice";
import { FaUserCircle } from "react-icons/fa";
import { fetchUser } from "../../../store/slices/UserSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const userInfo = userState.userInfo;
  const { balance, referral_commission, interest, currency, loading } =
    useSelector((state) => state.wallet);
  const userLoading = userState.loading;
  const userError = userState.error;

  useEffect(() => {
    dispatch(fetchWalletStats());
    dispatch(fetchUser());
  }, [dispatch]);

  if (userLoading || loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Container
      fluid
      style={{ padding: "20px", color: "#fafafa", backgroundColor: "#03002e" }}
    >
      <div className="text-center mt-3 mb-3">
        <p>
          <span style={{ color: "#004225", fontWeight: "bold" }}>
            Username:
          </span>{" "}
          {userInfo?.username || "Loading..."}
        </p>
        <p>
          <span style={{ color: "#004225", fontWeight: "bold" }}>
            User Email:
          </span>{" "}
          {userInfo?.email || "Loading..."}
        </p>
        <p>
          <span style={{ color: "#004225", fontWeight: "bold" }}>
            Phone Number:
          </span>{" "}
          {userInfo?.phone_number || "Loading..."}
        </p>
        <p>
          <span style={{ color: "#004225", fontWeight: "bold" }}>User ID:</span>{" "}
          {userInfo?.id || "Loading..."}{" "}
          <span
            style={{
              marginLeft: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "5px",
            }}
          >
            VIP0
          </span>
        </p>
        <p style={{ color: "#FF8C00", fontWeight: "bold" }}>
          {userInfo?.is_active ? "Account is Active" : "Account is Inactive"}
        </p>
        <a href="/account/user/profile/info" style={{ textDecoration: "none" }}>
          <FaUserCircle
            size={120}
            color="#004225"
            style={{
              borderRadius: "50%",
            }}
          />
        </a>
      </div>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Row className="text-center">
            <Col md={4} xs={12}>
              <a
                href="/account/user/balance"
                className="text-decoration-none text-dark"
              >
                <Row>
                  <Col md={12} xs={6}>
                    <h5 style={{ color: "#FF8C00" }}>
                      {currency.symbol} {balance.toFixed(2)}
                    </h5>
                  </Col>
                  <Col md={12} xs={6}>
                    <h6 style={{ color: "#004225" }}>Current Balance</h6>
                  </Col>
                </Row>
              </a>
            </Col>
            <Col md={4} xs={12}>
              <a
                href="/account/user/balance"
                className="text-decoration-none text-dark"
              >
                <Row>
                  <Col md={12} xs={6}>
                    <h4 style={{ color: "#FF8C00" }}>
                      {currency.symbol} {referral_commission.toFixed(2)}
                    </h4>
                  </Col>
                  <Col md={12} xs={6}>
                    <h6 style={{ color: "#004225" }}>Referral Income</h6>
                  </Col>
                </Row>
              </a>
            </Col>
            <Col md={4} xs={12}>
              <a
                href="/account/user/balance"
                className="text-decoration-none text-dark"
              >
                <Row>
                  <Col md={12} xs={6}>
                    <h4 style={{ color: "#FF8C00" }}>
                      {currency.symbol} {interest.toFixed(2)}
                    </h4>
                  </Col>
                  <Col>
                    <h6 style={{ color: "#004225" }}>Product Income</h6>
                  </Col>
                </Row>
              </a>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ListGroup>
        {[
          { label: "Profile Info", link: "/account/user/profile/info" },
          {
            label: "Withdrawal Account",
            link: "/account/user/withdrawal-details",
          },
          {
            label: "Update Password",
            link: "/account/user/profile/update-password",
          },
        ].map((item, index) => (
          <ListGroup.Item
            key={index}
            style={{ transition: "background-color 0.3s" }}
          >
            <a
              href={item.link}
              className="d-flex justify-content-between text-decoration-none text-dark"
              style={{ width: "100%", padding: "10px" }}
            >
              <span>{item.label}</span>
              <FaChevronRight />
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Profile;
