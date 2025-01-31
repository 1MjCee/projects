"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchReferralCode } from "@/reduxStore/slices/ReferralCodeSlice";

const InviteCode = () => {
  const siteUrl = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const { referralCode, loading } = useSelector((state) => state.referralCode);
  const inviteLink = referralCode
    ? `${siteUrl}/auth/register?inviteCode=${referralCode}`
    : "";

  const [copyMessage, setCopyMessage] = useState("");
  const [buttonText, setButtonText] = useState("Copy Invite Link");

  useEffect(() => {
    dispatch(fetchReferralCode());
  }, [dispatch]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setButtonText("Invite Link copied!");
        setTimeout(() => {
          setButtonText("Copy Invite Link");
        }, 2000);
      })
      .catch(() => {
        setCopyMessage("Failed to copy link.");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  };

  return (
    <Container fluid className=" px-0">
      <Card
        style={{ backgroundColor: "#03002e", color: "#fafafa" }}
        className="mt-2 mb-2"
      >
        <Card.Body>
          <Card.Title className="mb-3 text-center">
            My Invitation Code
          </Card.Title>
          <Row className="align-items-center">
            <Col xs={12}>
              {loading ? (
                <Spinner animation="border" variant="success" />
              ) : (
                <>
                  <h5 className="mb-0 text-center">
                    <b>{referralCode || "No code available"}</b>
                  </h5>
                  {inviteLink && (
                    <p
                      style={{ color: "#DA9100" }}
                      className="text-center mt-2"
                    >
                      {inviteLink}
                    </p>
                  )}
                </>
              )}
            </Col>
            <Col xs={12} className="text-center">
              <Button
                style={{ borderRadius: "20px", width: "200px", margin: "5px" }}
                variant="primary"
                onClick={handleCopy}
                disabled={loading || !referralCode}
              >
                {buttonText}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InviteCode;
