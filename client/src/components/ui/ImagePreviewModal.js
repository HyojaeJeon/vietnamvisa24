"use client";

import React from "react";
import { X, Download } from "lucide-react";
import { Button } from "../../../app/src/components/ui/button";

const ImagePreviewModal = ({ isOpen, onClose, imageSrc, fileName, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <div className="flex items-center space-x-2">
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="p-4 overflow-auto max-h-[80vh]">
          <img src={imageSrc} alt={fileName} className="max-w-full max-h-full mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
