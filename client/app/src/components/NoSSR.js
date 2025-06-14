// "use client";

// import { useEffect, useState } from "react";
// import PropTypes from "prop-types";

// /**
//  * NoSSR 컴포넌트 - 클라이언트 사이드에서만 렌더링
//  * 하이드레이션 오류를 방지하기 위해 사용
//  */
// export default function NoSSR({ children, fallback = null }) {
//   const [hasMounted, setHasMounted] = useState(false);

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   if (!hasMounted) {
//     return fallback;
//   }

//   return children;
// }

// NoSSR.propTypes = {
//   children: PropTypes.node.isRequired,
//   fallback: PropTypes.node,
// };

"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * NoSSR 컴포넌트 - 클라이언트 사이드에서만 렌더링
 * 하이드레이션 오류를 방지하기 위해 사용
 */
function NoSSR({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
}

NoSSR.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

// 반드시 default export 사용
export default NoSSR;
