"use client";

import React from "react";
import { Image, ListGroup, Container, Row, Col } from "react-bootstrap";

const SocialGroups = ({ whatsappGroups = [], telegramGroups = [] }) => {
  return (
    <Container fluid className="group-list mt-5">
      <h4
        className="text-center"
        style={{ color: "#FF8C00", fontWeight: "bold" }}
      >
        Join Groups
      </h4>
      <p className="text-center">
        We have both whatsapp and telegram groups here. You can join choose the
        one's you wish to join.{" "}
      </p>

      <hr />

      {/* Telegram Groups Section */}
      {telegramGroups.length > 0 && (
        <>
          <h5 className="text-success mt-3">Telegram Groups</h5>
          <p>Here is a list of available telegram groups</p>
          <ListGroup>
            {telegramGroups.map((group, index) => (
              <ListGroup.Item
                key={index}
                action
                href={group}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Group Telegram ${group}`}
                className="d-flex align-items-center border-0 mb-2"
                style={{ backgroundColor: "#F5F5DC" }}
              >
                <Image
                  src="/assets/images/telegram.png"
                  alt="Telegram"
                  roundedCircle
                  width={24}
                  height={24}
                  className="me-2"
                />
                <span>Telegram {index + 1}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}

      <hr />

      {/* WhatsApp Groups Section */}
      {whatsappGroups.length > 0 && (
        <>
          <h5 className="text-success mt-4">Whatsapp Groups</h5>
          <p>Here is a list of available Whatsapp groups</p>
          <ListGroup>
            {whatsappGroups.map((group, index) => (
              <ListGroup.Item
                key={index}
                action
                href={group}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Group WhatsApp ${group}`}
                className="d-flex align-items-center text-dark border-0 mb-2"
                style={{ backgroundColor: "#F5F5DC" }}
              >
                <Image
                  src="/assets/images/whatsapp.png"
                  alt="WhatsApp"
                  roundedCircle
                  width={24}
                  height={24}
                  className="me-2"
                />
                <span>WhatsApp {index + 1}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
      <hr />

      {/* If no groups are available */}
      {telegramGroups.length === 0 && whatsappGroups.length === 0 && (
        <p className="text-light">No Groups Available</p>
      )}
    </Container>
  );
};

export default SocialGroups;
