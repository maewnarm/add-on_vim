import React from "react";

const Result = () => {
  return (
    <div className="result">
      <p>Result</p>
      <div className="result__mor">
        <p>MOR</p>
        <div className="result__mor__value">
          <p>100.0</p>
          <p>%</p>
        </div>
      </div>
      <div className="result__loss">
        <p>Loss</p>
        <div className="result__loss__value">
          <p>100.0</p>
          <p>%</p>
        </div>
      </div>
      <div className="result__ct">
        <p>CT</p>
        <div className="result__mor__value">
          <p>12.3</p>
          <p>s.</p>
        </div>
      </div>
    </div>
  );
};

export default Result;
