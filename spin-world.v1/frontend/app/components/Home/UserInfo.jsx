"use client";

import React, { useEffect } from "react";
import { Image, Row, Col, Container, Spinner, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/reduxStore/slices/UserSlice";
import Link from "next/link";

const UserInfo = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  const image = "/assets/images/default.webp";

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
            <Link href="account/user/profile/info" className="d-block mb-3">
              <Image
                src={userInfo?.avatar || image}
                roundedCircle
                className="border border-success"
                style={{ width: "50px", height: "50px" }}
              />
            </Link>
          </Col>
          <Col className="">
            <Row>
              <Col>
                <p className="mb-0 text-sm text-center">
                  User ID:{" "}
                  <span style={{ color: "#FF8C00" }}>{userInfo?.id}</span>
                </p>
              </Col>
              <Col>
                {userInfo?.username && (
                  <p className="font-weight-bold  mb-1 text-center">
                    Username:{" "}
                    <span style={{ color: "#FF8C00" }}>
                      {userInfo?.username}
                    </span>
                  </p>
                )}
              </Col>
              <Col xs={12}>
                {userInfo?.email && (
                  <div className="font-weight-bold  mb-1 text-center">
                    <span style={{ color: "#FF8C00" }}>{userInfo?.email}</span>
                  </div>
                )}
              </Col>
            </Row>

            <hr />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UserInfo;
