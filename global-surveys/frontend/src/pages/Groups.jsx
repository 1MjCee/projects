import { Container } from "react-bootstrap";
import SocialGroups from "../components/SocialGroups";

const Groups = () => {
  const telegramGroups = ["https://t.me/gracefarmcominvest"];
  const whatsappGroups = [
    "https://whatsapp.com/channel/0029VauEJkZEquiLM8Qf4N0W",
  ];

  return (
    <Container fluid className="p-0">
      <SocialGroups
        whatsappGroups={whatsappGroups}
        telegramGroups={telegramGroups}
      />
    </Container>
  );
};

export default Groups;
