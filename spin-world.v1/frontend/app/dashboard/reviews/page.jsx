"use client";

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Pagination,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReviewCard from "@/app/components/Reviews/ReviewCard";
import { fetchReviews } from "@/reduxStore/slices/reviewSlice";

const Reviews = () => {
  const dispatch = useDispatch();

  // Get all reviews, loading, and error state from Redux store
  const { reviews, loading, error } = useSelector((state) => state.reviews);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [paginatedReviews, setPaginatedReviews] = useState([]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Fetch all reviews when the component mounts
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // Update paginated reviews when the reviews or current page changes
  useEffect(() => {
    // Slice the reviews array based on the current page and reviewsPerPage
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    setPaginatedReviews(currentReviews);
  }, [reviews, currentPage, reviewsPerPage]);

  // Handle page change (pagination)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle fast navigation (previous/next)
  const handleFastNavigation = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Container fluid className="px-0 mt-4" style={{ marginBottom: "100px" }}>
      {/* Review Cards */}
      <header className="mt-5">
        <h5
          style={{ color: "#DA9100", fontWeight: "bold" }}
          className="text-center"
        >
          All Reviews
        </h5>
        <p className="text-center">
          -- You will find all your customer reviews in this page --
        </p>
      </header>
      <hr />
      {!loading && !error && reviews.length === 0 && (
        <div className="d-flex justify-content-center mt-3">
          <Alert variant="info">No reviews available.</Alert>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <Row>
          {paginatedReviews.map((review) => (
            <Col key={review.id} xs={12} sm={6} md={4} lg={3}>
              <ReviewCard review={review} />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3 mb-5">
        <Pagination>
          <Pagination.Prev onClick={() => handleFastNavigation("prev")} />
          <Pagination.First onClick={() => setCurrentPage(1)} />
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
          <Pagination.Next onClick={() => handleFastNavigation("next")} />
        </Pagination>
      </div>
    </Container>
  );
};

export default Reviews;
