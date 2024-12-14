import React from "react";
import { Row, Col } from "react-bootstrap";

const StepProgress = () => {
  // Steps with names and descriptions
  const steps = [
    {
      name: "Login",
      description: "Login into your account.",
    },
    { name: "Spin", description: "Spin the wheel to get treasure code." },
    { name: "Redeem", description: "Redeem treasure code to get rewards." },
    { name: "Withdraw", description: "Withdraw your earned rewards." },
  ];

  const stepStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px",
  };

  const circleStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DA9100",
    color: "white",
    fontWeight: "bold",
  };

  const labelStyle = {
    marginTop: "8px",
    fontSize: "16px",
    textAlign: "center",
    color: "#DA9100",
  };

  const descriptionStyle = {
    fontSize: "14px",
    color: "#fafafa",
    marginTop: "4px",
    textAlign: "center",
  };

  return (
    <div className="mt-5 mb-5" style={{ margin: "20px" }}>
      <hr style={{ border: "1px solid #DA9100" }} />
      <header className="text-center">
        <h5 className="display-6" style={{ color: "#DA9100" }}>
          How to Win
        </h5>
        <p className="text-light lead">
          Follow these simple steps to unlock and claim your rewards!
        </p>
      </header>
      <Row className="justify-content-center">
        {steps.map((step, index) => (
          <Col
            key={index}
            xs={12}
            sm={6}
            lg={3}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Row>
              <Col xs={12}>
                {" "}
                <div style={stepStyle}>
                  <div style={circleStyle}>{index + 1}</div>
                  <div style={labelStyle}>{step.name}</div>
                </div>
              </Col>

              <Col>
                {" "}
                <div style={descriptionStyle}>{step.description}</div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <hr style={{ border: "1px solid #DA9100" }} />
    </div>
  );
};

export default StepProgress;
