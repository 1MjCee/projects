import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";

// Function to convert the rating number to stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
        ★
      </span>
    );
  }
  return stars;
};

const ReviewCard = ({ review }) => {
  const {
    id,
    username,
    review: reviewText,
    rating,
    currency,
    created_at,
  } = review;

  return (
    <Card
      style={{ backgroundColor: "#03002e", borderRadius: "8px" }}
      className="mb-3 text-light"
      key={id}
    >
      <Card.Body>
        <Row>
          <Col>
            <Card.Title style={{ color: "#DA9100" }}>{username}</Card.Title>
          </Col>
          <Col className="text-end">
            <div style={{ color: "#DA9100" }}>{renderStars(rating)}</div>
          </Col>
        </Row>

        <Card.Text className="my-3 text-center">{reviewText}</Card.Text>

        <Row>
          <Col>
            <Badge style={{ backgroundColor: "#DA9100", padding: "5px" }}>
              {currency?.currency_name} ({currency?.currency_code})
            </Badge>
          </Col>
          <Col className="text-end">
            <small>
              <strong style={{ color: "#DA9100" }}>Country:</strong>{" "}
              {currency?.country}
            </small>
            <br />
            <small>
              <strong style={{ color: "#DA9100" }}>Reviewed on:</strong>{" "}
              {new Date(created_at).toLocaleString()}
            </small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
