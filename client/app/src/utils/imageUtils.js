/**
 * 서버에서 받은 상대 경로를 완전한 이미지 URL로 변환
 * @param {string|null} fileUrl - 서버에서 받은 상대 경로 (예: "/uploads/2/image.jpg")
 * @returns {string|null} - 완전한 이미지 URL 또는 null
 */
export const getImageUrl = (fileUrl) => {
  if (!fileUrl) return null;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5002";

  // 이미 완전한 URL인 경우 (http로 시작) 그대로 반환
  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  // 상대 경로인 경우 서버 URL과 합치기
  // fileUrl이 /로 시작하지 않는 경우 /를 추가
  const normalizedPath = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;

  return `${serverUrl}${normalizedPath}`;
};

/**
 * 문서 객체에서 사용할 이미지 URL을 반환
 * fileUrl을 우선 사용하고, 없으면 fileData(base64) 사용
 * @param {object} document - 문서 객체
 * @returns {string|null} - 사용할 이미지 URL
 */
export const getDocumentImageUrl = (document) => {
  if (!document) return null;

  // fileUrl이 있는 경우 완전한 URL로 변환
  if (document.fileUrl) {
    return getImageUrl(document.fileUrl);
  }

  // fileUrl이 없고 fileData(base64)가 있는 경우 그대로 사용
  if (document.fileData) {
    return document.fileData;
  }

  return null;
};
