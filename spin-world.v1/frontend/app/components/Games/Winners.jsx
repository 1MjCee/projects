"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromoCodes,
  selectPromoCodes,
} from "@/reduxStore/slices/PromoCodesSlice";

const Winners = () => {
  const dispatch = useDispatch();
  const promoCodes = useSelector(selectPromoCodes);
  const [visibleWinners, setVisibleWinners] = useState([]);

  useEffect(() => {
    dispatch(fetchPromoCodes());
  }, [dispatch]);

  useEffect(() => {
    const usedPromoCodes = promoCodes.filter((promo) => promo.used === true);
    const winners = usedPromoCodes.map((promo) => ({
      user: promo.won_by?.email,
      amount: promo.adjusted_amount,
      currency: promo.won_by?.country?.currency,
    }));
    setVisibleWinners(winners);
  }, [promoCodes]);

  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let currentScroll = 0;

    const scroll = () => {
      currentScroll += 1;
      scrollContainer.scrollTo(0, currentScroll);

      if (
        currentScroll >=
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        currentScroll = 0;
      }
    };

    const intervalId = setInterval(scroll, 50);

    return () => clearInterval(intervalId);
  }, [visibleWinners]);

  return (
    <Container className="mt-4">
      <hr />
      <h5 className="text-center text-light">Our Previous Winners</h5>
      <p style={{ color: "#DA9100" }} className="text-center">
        Here are our previous and happy winners and their prizes
      </p>
      <Container
        style={{
          backgroundColor: "#03002e",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "300px",
          height: "200px",
          overflowY: "hidden",
          color: "#fafafa",
          margin: "auto",
        }}
        className="billboard text-light"
        ref={scrollContainerRef}
      >
        <div style={{ height: "max-content" }}>
          {visibleWinners.length === 0 ? (
            <p>No winners yet!</p>
          ) : (
            visibleWinners.map((winner, index) => (
              <Container
                key={index}
                className="winner-item justify-content-between"
              >
                <div className="text-center">
                  {winner.user} received USD {winner.amount}
                </div>
              </Container>
            ))
          )}
        </div>
      </Container>
    </Container>
  );
};

export default Winners;
