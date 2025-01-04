import Link from "next/link";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const PaymentGuide = () => {
  return (
    <Container fluid className="my-2">
      <Row className="justify-content-start">
        <Col xs={12}>
          <Card className="mb-4 p-4 bg-info">
            <h6>Step 1: Selecting Amount and Cryptocurrency</h6>
            <ul>
              <li>
                <strong>Amount and Cryptocurrency:</strong> Select the amount
                you wish to pay and choose the cryptocurrency from the provided
                lists then click proceed to pay
              </li>
              <li>
                <strong>Review teh details:</strong> You will be provided with
                details about the minimum acceptable amount of for the selected
                cryptocurrency and the amount of cryptoCurrency for for your
                selected amount
              </li>
              <li>
                <strong>Redirect to NowPayment:</strong> You'll be automatically
                redirected to the NowPayment page.
              </li>
            </ul>

            <h6>Step 2: Payment with Cryptocurrency</h6>
            <ul>
              <li>
                <strong>Unique Address:</strong> NowPayment will generate a
                unique address. <strong>Copy this address.</strong>
              </li>
              <li>
                <strong>Send Crypto:</strong> Use your cryptocurrency wallet to
                send the exact amount to this address.
              </li>
            </ul>

            <h6>Don't Have Cryptocurrency? Don't worry we have you covered</h6>
            <ul>
              <li>
                <strong>
                  Go to{" "}
                  <Link href={`https://alchemypay.org/`} passHref>
                    Alchemy Pay
                  </Link>
                  :{" "}
                </strong>{" "}
              </li>
              <li>
                <strong>Provide Details:</strong>
                <ul>
                  <li>
                    Provide the amount and cryptocurrency you wish to pay.
                  </li>
                  <li>
                    <strong>Provide Authorization:</strong> You will be asked to
                    login to you account or register if you don't have one
                  </li>
                  <li>
                    <strong>Enter Wallet Address:</strong>Provide the
                    verification code to complete authentication, then Paste the
                    unique NowPayment address into Alchemy Pay.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Fiat Payment:</strong>
                <ul>
                  <li>
                    <strong>Select Payment Method:</strong> Choose your payment
                    option (e.g., credit card).
                  </li>
                  <li>
                    <strong>Complete Payment:</strong> Follow the payment
                    prompts.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Conversion and Transfer:</strong> Alchemy Pay converts
                your payment to crypto and sends it to NowPayment.
              </li>
            </ul>

            <h6>Final Steps:</h6>
            <ul>
              <li>
                <strong>Confirmation:</strong> You'll get a confirmation once
                payment is processed.
              </li>
              <li>
                <strong>Transaction Time:</strong> Cryptocurrency transactions
                might take time to confirm.
              </li>
            </ul>

            <h6>Important Notes:</h6>
            <ul>
              <li>
                <strong>Fees:</strong> Be aware of transaction fees.
              </li>
              <li>
                <strong>Security:</strong> Keep your private keys secure.
              </li>
              <li>
                <strong>Support:</strong> Contact support for issues.
              </li>
            </ul>

            <h6>Need Help?</h6>
            <p>
              If you need assistance, please reach out to our support team at
              through the chat
            </p>

            <h6>Quick Tips:</h6>
            <ul>
              <li>Double-check the amount and crypto before confirming.</li>
              <li>Keep transaction receipts.</li>
              <li>If new to crypto, please contact us.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentGuide;
