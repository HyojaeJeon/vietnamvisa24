import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image, File, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { GET_DOCUMENT_TYPES } from "@/lib/graphql/query/documents";

const FileUpload = ({ applicationId, onUploadSuccess, onUploadError, multiple = true, acceptedTypes = "image/*,.pdf,.doc,.docx", maxSizeInMB = 10, className = "" }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 문서 타입 목록 가져오기
  const { data: documentTypesData } = useQuery(GET_DOCUMENT_TYPES);
  const documentTypes = documentTypesData?.getDocumentTypes || [];

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addFiles(selectedFiles);
  };

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  // 파일 추가 로직
  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      // 파일 크기 검증
      if (file.size > maxSizeInMB * 1024 * 1024) {
        onUploadError && onUploadError(`${file.name}은 ${maxSizeInMB}MB를 초과합니다.`);
        return false;
      }

      // 파일 타입 검증
      const allowedTypes = acceptedTypes.split(",").map((type) => type.trim());
      const isValidType = allowedTypes.some((type) => {
        if (type === "image/*") return file.type.startsWith("image/");
        if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
        return file.type === type;
      });

      if (!isValidType) {
        onUploadError && onUploadError(`${file.name}은 지원되지 않는 파일 형식입니다.`);
        return false;
      }

      return true;
    });

    if (!multiple && validFiles.length > 1) {
      onUploadError && onUploadError("한 번에 하나의 파일만 업로드할 수 있습니다.");
      return;
    }

    const filesWithMetadata = validFiles.map((file) => ({
      file,
      id: Date.now() + Math.random(),
      documentType: "other",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setFiles((prev) => (multiple ? [...prev, ...filesWithMetadata] : filesWithMetadata));
  };

  // 파일 제거
  const removeFile = (fileId) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      // URL 정리
      const removedFile = prev.find((f) => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  // 문서 타입 변경
  const updateDocumentType = (fileId, documentType) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, documentType } : f)));
  };

  // 파일 업로드 실행
  const uploadFiles = async () => {
    if (!applicationId) {
      onUploadError && onUploadError("신청 ID가 필요합니다.");
      return;
    }

    if (files.length === 0) {
      onUploadError && onUploadError("업로드할 파일을 선택해주세요.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("application_id", applicationId);

      if (multiple) {
        // 다중 파일 업로드
        files.forEach(({ file }) => {
          formData.append("documents", file);
        });

        const documentTypes = files.map((f) => f.documentType);
        formData.append("document_types", JSON.stringify(documentTypes));

        const response = await fetch("/api/documents/upload-multiple", {
          method: "POST",
          body: formData,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });

        const result = await response.json();

        if (result.success) {
          onUploadSuccess && onUploadSuccess(result.documents);
          setFiles([]);
        } else {
          throw new Error(result.message || "업로드 실패");
        }
      } else {
        // 단일 파일 업로드
        const fileData = files[0];
        formData.append("document", fileData.file);
        formData.append("document_type", fileData.documentType);

        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          onUploadSuccess && onUploadSuccess([result.document]);
          setFiles([]);
        } else {
          throw new Error(result.message || "업로드 실패");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError && onUploadError(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 파일 아이콘 결정
  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <Image className="h-6 w-6" />;
    if (file.type === "application/pdf") return <FileText className="h-6 w-6 text-red-500" />;
    return <File className="h-6 w-6" />;
  };

  // 파일 크기 포맷
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          문서 업로드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 드래그 앤 드롭 영역 */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">파일을 드래그하거나 클릭하여 선택</p>
          <p className="text-sm text-gray-500">
            {acceptedTypes.includes("image/*") && "JPG, PNG, "}
            {acceptedTypes.includes(".pdf") && "PDF, "}
            {acceptedTypes.includes(".doc") && "DOC, "}
            {acceptedTypes.includes(".docx") && "DOCX "}
            파일 (최대 {maxSizeInMB}MB)
          </p>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input ref={fileInputRef} type="file" multiple={multiple} accept={acceptedTypes} onChange={handleFileSelect} className="hidden" />

        {/* 선택된 파일 목록 */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">선택된 파일</h4>
            {files.map((fileData) => (
              <div key={fileData.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {/* 파일 미리보기/아이콘 */}
                <div className="flex-shrink-0">{fileData.preview ? <img src={fileData.preview} alt="preview" className="w-12 h-12 object-cover rounded" /> : getFileIcon(fileData.file)}</div>

                {/* 파일 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{fileData.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(fileData.file.size)}</p>
                </div>

                {/* 문서 타입 선택 */}
                <select value={fileData.documentType} onChange={(e) => updateDocumentType(fileData.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {/* 제거 버튼 */}
                <Button variant="ghost" size="sm" onClick={() => removeFile(fileData.id)} className="text-red-500 hover:text-red-700">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드 진행률 */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>업로드 중...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* 업로드 버튼 */}
        {files.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={uploadFiles} disabled={uploading} className="flex-1">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {files.length}개 파일 업로드
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>
              취소
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
