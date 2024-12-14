import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { Wheel } from "react-custom-roulette";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCopy, FaClipboardCheck } from "react-icons/fa";
import { TbCopyCheckFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  selectPromoCodes,
  selectLoading,
  fetchPromoCodes,
} from "../../store/slices/PromoCodesSlice";

const LandingRoulette = () => {
  const dispatch = useDispatch();
  const promoCodes = useSelector(selectPromoCodes);
  const loading = useSelector(selectLoading);
  const [mustSpin, setMustSpin] = useState(false);

  const [prizeNumber, setPrizeNumber] = useState(null);
  const [rouletteData, setRouletteData] = useState([]);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPromoCodes());
  }, [dispatch]);

  useEffect(() => {
    // Filter promo codes that are unused and format them for the roulette
    if (promoCodes.length > 0) {
      const addShortString = promoCodes
        .filter((item) => !item.used)
        .map((item) => ({
          code: item.code || "",
          amount: item.amount || 0,
          option: item.amount.toString() || "No Amount",
        }));
      setRouletteData(addShortString);
    }
  }, [promoCodes]);

  // Handle Spin Click - Redirect to login page instead of spinning
  const handleSpinClick = async () => {
    if (rouletteData.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * rouletteData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
    setShowMessage(false);
  };

  // Handle spin completion
  const handleSpinCompletion = () => {
    setShowMessage(true);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <Container
      fluid
      className="px-0 py-2 mt-5"
      style={{
        backgroundColor: "#03002e",
        borderRadius: "8px",
      }}
    >
      <h5 className="text-center text-light mt-3">Spin to Win</h5>
      <p style={{ color: "#DA9100" }} className="text-center px-2">
        Spin World gives you an opportunity to win amazing prizes. For every
        spin, you win fantastic rewards! Prizes are in US Dollars $$
      </p>

      <div align="center" className="roulette-container">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            {rouletteData.length > 0 ? (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber !== null ? prizeNumber : 0}
                data={rouletteData.map((item) => ({ option: item.option }))}
                outerBorderColor={["#FF8C00"]}
                outerBorderWidth={[9]}
                innerBorderColor={["#f2f2f2"]}
                radiusLineColor={["transparent"]}
                radiusLineWidth={[1]}
                textColors={["#f5f5f5"]}
                textDistance={55}
                fontSize={[10]}
                backgroundColors={[
                  "#3f297e",
                  "#175fa9",
                  "#169ed8",
                  "#239b63",
                  "#64b031",
                  "#efe61f",
                  "#f7a416",
                  "#e6471d",
                  "#dc0936",
                  "#e5177b",
                  "#be1180",
                  "#871f7f",
                ]}
                onStopSpinning={handleSpinCompletion}
              />
            ) : (
              <div>No promo codes available</div>
            )}
            {/* Display login message after spin completes */}
            {showMessage && (
              <div className="text-info text-center mt-3">
                <strong>You must be logged in to win!</strong>
              </div>
            )}
            <Button
              style={{ backgroundColor: "#FF8C00", width: "150px" }}
              className="p-2 mt-2 mb-2"
              onClick={handleSpinClick}
            >
              Spin to Win
            </Button>
            {error && (
              <div className="mt-3" style={{ color: "#f5f5f5" }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default LandingRoulette;
