import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExchangeRates } from "../store/slices/CurrencyRates";
import { Card, Row, Col } from "react-bootstrap";

const CurrencyConverter = ({ amountInBaseCurrency, targetCurrency }) => {
  const dispatch = useDispatch();

  const { rates, loading, error } = useSelector((state) => state.currency);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    if (!rates) {
      dispatch(fetchExchangeRates());
    }
  }, [dispatch, rates]);

  useEffect(() => {
    if (rates && targetCurrency && amountInBaseCurrency) {
      const rateObject = rates.find(
        (rate) => rate.target_currency === targetCurrency
      );

      if (rateObject) {
        const rate = parseFloat(rateObject.rate);
        setConvertedAmount(amountInBaseCurrency * rate);
      } else {
        setConvertedAmount(amountInBaseCurrency);
      }
    }
  }, [rates, targetCurrency, amountInBaseCurrency]);

  const formatAmount = (amount, currency) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="mt-2">
      {targetCurrency !== null ? (
        <h6>
          <span>{targetCurrency}: </span>
          <span style={{ color: "#DA9100", fontWeight: "bold" }}>
            {formatAmount(convertedAmount, targetCurrency)}
          </span>
        </h6>
      ) : (
        <h6>
          <span>USD: </span>
          <span style={{ color: "#DA9100", fontWeight: "bold" }}>
            {formatAmount(amountInBaseCurrency, "USD")}
          </span>
        </h6>
      )}
    </div>
  );
};

export default CurrencyConverter;
