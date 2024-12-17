"use client";

import React from "react";

const CurrencyFormatter = ({ value, symbol }) => {
  const formatCurrencyValue = (value) => {
    // Check if the value is a valid number
    if (typeof value !== "number" || isNaN(value)) {
      console.error("Invalid value: expected a number", value);
      return 0.0;
    }

    // Format the number with commas and no decimals
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  };

  return (
    <span>
      {symbol} {formatCurrencyValue(value)}
    </span>
  );
};

export default CurrencyFormatter;
