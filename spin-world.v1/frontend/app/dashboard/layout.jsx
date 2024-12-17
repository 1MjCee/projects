"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import Footer from "../components/Footer";

const DashboardLayout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <Container fluid className="p-0">
      <Container fluid>{children}</Container>
      <Footer />
    </Container>
  );
};

export default DashboardLayout;
