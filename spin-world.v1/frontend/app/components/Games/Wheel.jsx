"use client";

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCopy, FaClipboardCheck } from "react-icons/fa";
import dynamic from "next/dynamic";
import {
  fetchPromoCodes,
  selectPromoCodes,
  selectLoading,
} from "@/reduxStore/slices/PromoCodesSlice";
import {
  fetchSpinnerData,
  selectSpinner,
  sendSpinData,
} from "@/reduxStore/slices/SpinnerSlice";
import { TbCopyCheckFilled } from "react-icons/tb";
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

const Roulette = () => {
  const dispatch = useDispatch();
  const promoCodes = useSelector(selectPromoCodes);
  const loading = useSelector(selectLoading);
  const { max_spins, spin_count, is_eligible } = useSelector(selectSpinner);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [rouletteData, setRouletteData] = useState([]);
  const [error, setError] = useState(null);
  const [showWinDetails, setShowWinDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchPromoCodes());
      dispatch(fetchSpinnerData());
    }
  }, [mounted, dispatch]);

  useEffect(() => {
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

  useEffect(() => {
    let interval;
    if (!mustSpin) {
      interval = setInterval(() => {
        dispatch(fetchSpinnerData())
          .unwrap()
          .then(() => {
            setError(null);
          })
          .catch((err) => {
            setError(err.message || "An error occurred");
          });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [dispatch, mustSpin]);

  const handleSpinClick = async () => {
    if (rouletteData.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * rouletteData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinCompletion = () => {
    setMustSpin(false);

    if (rouletteData[prizeNumber]) {
      const spinData = {
        code: rouletteData[prizeNumber].code,
        amount: rouletteData[prizeNumber].amount,
      };

      dispatch(sendSpinData(spinData))
        .unwrap()
        .then(() => {
          setError(null);
          setShowWinDetails(true);
          setTimeout(() => {
            setShowWinDetails(false);
          }, 20000);
        })
        .catch((err) => {
          setError(err.message || "An error occurred during spin");
        });
    }
  };

  const handleCopy = () => {
    const codeToCopy = rouletteData[prizeNumber].code;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Error copying text: ", err));
  };

  const remaining_spins = Math.max(max_spins - spin_count, 0);

  const isButtonDisabled =
    is_eligible === false ||
    max_spins === 0 ||
    remaining_spins <= 0 ||
    mustSpin ||
    rouletteData.length === 0;

  if (!mounted) {
    return null;
  }

  return (
    <Container
      fluid
      className="px-0 py-2"
      style={{
        backgroundColor: "#03002e",
        borderRadius: "8px",
      }}
    >
      <h5 className="text-center text-light mt-3">Spin and Win</h5>
      <p style={{ color: "#DA9100" }} className="text-center ">
        Spin World gives you an opportunity to win amazing prices. For every you
        spin the wheel, you win amazing rewards
      </p>
      <div align="center" className="roulette-container">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            {rouletteData.length > 0 ? (
              <Wheel
                mustStartSpinning={mustSpin}
                spinDuration={1}
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
            <div className="text-light">
              <span>Completed Spins: {spin_count}</span>
            </div>
            <div className="text-light">
              <span>Remaining Spins: {remaining_spins}</span>
            </div>
            <Button
              style={{ backgroundColor: "#FF8C00", width: "150px" }}
              className="p-2 mt-2 mb-2"
              onClick={handleSpinClick}
              disabled={isButtonDisabled}
            >
              {mustSpin ? "Spinning..." : "Spin"}
            </Button>
            {error ? (
              <div className="mt-3" style={{ color: "#f5f5f5" }}>
                <strong>Error:</strong> {error}
              </div>
            ) : (
              !mustSpin &&
              showWinDetails &&
              prizeNumber !== null && (
                <div className="mt-3" style={{ color: "#f5f5f5" }}>
                  <strong>Congratulations!</strong> You won:
                  <div>Amount: {rouletteData[prizeNumber].amount}</div>
                  <div>
                    Treasure Code: {rouletteData[prizeNumber].code}{" "}
                    <span>
                      {" "}
                      <button
                        onClick={handleCopy}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {copied ? (
                          <TbCopyCheckFilled size={15} color="#fafafa" />
                        ) : (
                          <FaRegCopy size={15} color="#fafafa" />
                        )}
                      </button>
                    </span>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Roulette;
