"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "@/reduxStore/slices/reviewSlice";
import { Row, Col, Carousel } from "react-bootstrap";
import ReviewCard from "./ReviewCard";

const ReviewsList = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);

  // State for reviews in the past 24 hours
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  useEffect(() => {
    // Filter reviews from the past 24 hours
    const filterRecentReviews = () => {
      const now = new Date();
      const recent = reviews.filter((review) => {
        const reviewDate = new Date(review.created_at);
        return (now - reviewDate) / (1000 * 60 * 60) <= 24; // 24 hours
      });
      setRecentReviews(recent);
    };
    filterRecentReviews();
  }, [reviews]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalReviews = reviews.length;
  const totalRecentReviews = recentReviews.length;

  return (
    <div className="mt-5 mb-5">
      {/* Display stats for total reviews and reviews in the last 24 hours */}
      <div className="reviews-header text-center mb-4">
        <h5 style={{ color: "#DA9100", fontWeight: "bold" }}>
          Customer Reviews
        </h5>
        <p style={{ color: "#d1d1d1" }}>
          -- What our customers are saying about us --
        </p>
      </div>
      <hr style={{ border: "1px solid #DA9100" }} />

      <div
        className="mb-4 d-flex justify-content-between"
        style={{ color: "#f8f9fa" }}
      >
        <span>Total Reviews: {totalReviews}</span>
        <span>Last 24 hours: {totalRecentReviews}</span>
      </div>

      {/* Horizontal scroll carousel (slider) for reviews */}
      <Carousel
        interval={2000}
        indicators={false}
        controls={true}
        pause="hover"
      >
        {/* Generate Carousel Item for each batch of reviews */}
        {[...Array(Math.ceil(reviews.length / 4))].map((_, index) => (
          <Carousel.Item key={index}>
            <Row
              style={{
                display: "flex", // Use flexbox
                flexWrap: "nowrap", // Prevent wrapping
                overflowX: "auto", // Enable horizontal scrolling
                padding: "5px 0",
                margin: 0,
              }}
            >
              {reviews.slice(index * 4, (index + 1) * 4).map((review) => (
                <Col
                  key={review.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    flexShrink: 0,
                    paddingRight: "15px",
                  }}
                >
                  <ReviewCard
                    review={review}
                    totalReviews={totalReviews}
                    totalRecentReviews={totalRecentReviews}
                  />
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ReviewsList;
