import ProfileUpdate from "@/app/components/Account/Profile/ProfileDetails";
import React from "react";
import { Container } from "react-bootstrap";

const ProfileInfo = () => {
  return (
    <Container fluid className="px-0">
      <ProfileUpdate />
    </Container>
  );
};

export default ProfileInfo;
