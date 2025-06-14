import React from "react";

const PerformanceMonitor = ({ data }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">성능 모니터</h4>
      <div className="text-sm text-gray-600">
        <p>템플릿 수: {data?.length || 0}</p>
        <p>평균 처리 시간: 2.3일</p>
        <p>성공률: 98.5%</p>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
