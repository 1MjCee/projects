import SocialGroups from "@/app/components/SocialGroups";
import React from "react";
import { Container } from "react-bootstrap";

const Groups = () => {
  const telegramGroups = ["https://t.me/+Eb5QJUFR-IpmNWRk"];
  const whatsappGroups = [];

  return (
    <Container fluid className="px-0">
      <SocialGroups
        whatsappGroups={whatsappGroups}
        telegramGroups={telegramGroups}
      />
    </Container>
  );
};

export default Groups;
