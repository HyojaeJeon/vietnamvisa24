"use client";

import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { getStepTitle } from "./utils";

const ProgressIndicator = ({ currentStep, totalSteps = 7 }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step < currentStep ? "bg-green-500 border-green-500 text-white" : step === currentStep ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-6 h-6" /> : <span className="text-sm font-semibold">{step}</span>}
              </div>
              <div className="mt-2 text-xs text-center max-w-20">
                <div className={`font-medium ${step <= currentStep ? "text-gray-900" : "text-gray-400"}`}>{getStepTitle(step)}</div>
              </div>
            </div>
            {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
