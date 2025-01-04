"use client";

import React, { useEffect } from "react";
import { Image, Row, Col, Container, Spinner, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import CenteredSpinner from "../CenteredSpinner";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return <CenteredSpinner />;
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center mt-3 px-0"
    >
      <Card
        style={{ backgroundColor: "#03002e" }}
        className="w-100 p-2 mx-0 shadow-sm rounded text-light"
      >
        <Row className="align-items-center">
          <Col xs="12" className="text-center">
            <a href="account/user/profile/info" className="d-block mb-3">
              <Image
                src={userInfo?.avatar || "/media/uploads/avatars/default.png"}
                roundedCircle
                className="border border-success"
                style={{ width: "50px", height: "50px" }}
              />
            </a>
          </Col>
          <Col>
            <Row>
              <Col>
                <p className="mb-0 text-sm text-center">
                  User ID:{" "}
                  <span style={{ color: "#FF8C00" }}>{userInfo?.id}</span>
                </p>
              </Col>
              <Col>
                <p>
                  {userInfo?.username && (
                    <p className="font-weight-bold  mb-1 text-center">
                      Username:{" "}
                      <span style={{ color: "#FF8C00" }}>
                        {userInfo?.username}
                      </span>
                    </p>
                  )}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  {userInfo?.email && (
                    <p className="font-weight-bold text-center">
                      <span style={{ color: "#FF8C00" }}>
                        {userInfo?.email}
                      </span>
                    </p>
                  )}
                </p>
              </Col>
              <Col className="mb-0" xs={12}>
                {userInfo?.country && (
                  <p className="font-weight-bold text-center">
                    Location:{" "}
                    <span style={{ color: "#FF8C00" }}>
                      {userInfo?.country.city}, {userInfo?.country.country}
                    </span>
                  </p>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UserProfile;
