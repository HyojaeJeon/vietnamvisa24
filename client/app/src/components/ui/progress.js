"use client";

import React from "react";
import PropTypes from "prop-types";

const Progress = ({ value, max = 100, className, indicatorClassName }) => {
  const percent = max === 0 ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max} className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className || ""}`}>
      <div className={`bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out ${indicatorClassName || ""}`} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  className: PropTypes.string,
  indicatorClassName: PropTypes.string,
};

export { Progress };
