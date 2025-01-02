"use client";

import { Col, Row, Card, Container } from "react-bootstrap";
import {
  FaChevronRight,
  FaUser,
  FaMoneyCheckAlt,
  FaLock,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QuickLinks = () => {
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/");
  };

  return (
    <Container className="mb-3">
      <Card style={{ border: "none" }} className=" my-3">
        <Card.Header
          style={{
            backgroundColor: "#010048",
            color: "#fafafa",
            border: "none",
          }}
          className="text-center"
        >
          Quick Links
        </Card.Header>
        <Card.Body
          style={{
            backgroundColor: "#010048",
            color: "#fafafa",
            border: "none",
          }}
        >
          {/* Update Profile Link */}
          <Link
            href="/dashboard/account/user/profile"
            passHref
            className="text-decoration-none"
          >
            <Row
              style={{ border: "none" }}
              className="align-items-center border rounded quick-link mb-2 py-1"
            >
              <Col xs={2} sm={1} className="text-center">
                <FaUser color="#DA9100" size={18} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-light">Update Profile</p>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>

          {/* Withdrawal Account Link */}
          <Link
            href="/dashboard/account/user/withdrawal-details"
            passHref
            className="text-decoration-none"
          >
            <Row
              style={{ border: "none" }}
              className="align-items-center border rounded quick-link mb-2 py-1"
            >
              <Col xs={2} sm={1} className="text-center">
                <FaMoneyCheckAlt color="#DA9100" size={18} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-light">Withdrawal Account</p>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>

          {/* Reviews Page */}
          <Link
            href="/dashboard/reviews/"
            passHref
            className="text-decoration-none"
          >
            <Row
              style={{ border: "none" }}
              className="align-items-center border rounded quick-link mb-2 py-1"
            >
              <Col xs={2} sm={1} className="text-center">
                <FaMoneyCheckAlt color="#DA9100" size={18} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-light">Reviews</p>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>

          {/* User Rankings Link */}
          <Link
            href="/dashboard/account/user/rankings"
            passHref
            className="text-decoration-none"
          >
            <Row
              style={{ border: "none" }}
              className="align-items-center border rounded quick-link mb-2 py-1"
            >
              <Col xs={2} sm={1} className="text-center">
                <FaRankingStar color="#DA9100" size={18} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-light">User Rankings</p>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>

          {/* Change Password Link */}
          <Link
            href="/dashboard/account/user/password-update"
            passHref
            className="text-decoration-none"
          >
            <Row
              style={{ border: "none" }}
              className="align-items-center border rounded quick-link mb-2 py-1"
            >
              <Col xs={2} sm={1} className="text-center">
                <FaLock color="#DA9100" size={18} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-light">Change Password</p>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>

          {/* Logout Link */}
          <Link
            href="/"
            onClick={handleLogout}
            passHref
            className="text-decoration-none"
          >
            <Row className="align-items-center border rounded quick-link mb-2 py-1 hover-bg-light">
              <Col xs={2} sm={1} className="text-center">
                <IoIosLogOut color="#DA9100" size={20} />
              </Col>
              <Col className="d-flex justify-content-between align-items-center">
                <span className="mb-0 text-light">Logout</span>
                <FaChevronRight color="#DA9100" size={20} />
              </Col>
            </Row>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuickLinks;
