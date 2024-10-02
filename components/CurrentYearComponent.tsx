"use client";

import React from "react";
import { useEffect, useState } from "react";

const CurrentYear = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (year !== currentYear) {
      setYear(currentYear);
    }
  }, [year]);

  return <>{year}</>;
};

export default CurrentYear;
