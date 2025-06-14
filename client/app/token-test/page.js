"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { USER_LOGIN_MUTATION } from "../src/lib/graphql";
import { gql } from "@apollo/client";

// getAdminMe 쿼리
const GET_ADMIN_ME_QUERY = gql`
  query GetAdminMe {
    getAdminMe {
      id
      email
      name
      role
      is_active
    }
  }
`;

export default function TokenRefreshTest() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [adminLoginData, setAdminLoginData] = useState({ email: "", password: "" });
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [userLogin] = useMutation(USER_LOGIN_MUTATION);
  const [adminLogin] = useMutation(gql`
    mutation AdminLogin($input: AdminLoginInput!) {
      adminLogin(input: $input) {
        token
        refreshToken
        admin {
          id
          email
          name
          role
        }
      }
    }
  `);
  const {
    data: adminData,
    error: adminError,
    refetch: refetchAdmin,
  } = useQuery(GET_ADMIN_ME_QUERY, {
    skip: !isClient || !localStorage.getItem("adminToken"),
    errorPolicy: "all",
  });
  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!isClient) return;

    try {
      const result = await userLogin({
        variables: {
          input: loginData,
        },
      });

      const { token, refreshToken } = result.data.userLogin;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      alert("User logged in successfully!");
    } catch (error) {
      alert(`Login error: ${error.message}`);
    }
  };
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!isClient) return;

    try {
      const result = await adminLogin({
        variables: {
          input: adminLoginData,
        },
      });

      const { token, refreshToken } = result.data.adminLogin;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminRefreshToken", refreshToken);

      alert("Admin logged in successfully!");
      // Auto refetch admin data after login
      refetchAdmin();
    } catch (error) {
      alert(`Admin login error: ${error.message}`);
    }
  };

  const testTokenExpiry = () => {
    // Manually trigger admin query to test token expiry
    refetchAdmin();
  };
  const clearTokens = () => {
    if (!isClient) return;

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    alert("All tokens cleared");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Token Refresh Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Login */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Login</h2>
          <form onSubmit={handleUserLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="w-full p-2 border rounded" />
            <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Login as User
            </button>
          </form>
        </div>

        {/* Admin Login */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={adminLoginData.email}
              onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={adminLoginData.password}
              onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Login as Admin
            </button>
          </form>{" "}
          <div className="mt-4 text-sm text-gray-600">
            <p>Default admin credentials:</p>
            <p>Email: admin@vietnamvisa.com</p>
            <p>Password: admin123!</p>
          </div>
        </div>
      </div>

      {/* Admin Data Display */}
      <div className="mt-8 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Admin Data (Tests Token Refresh)</h2>

        {adminError && <div className="text-red-500 mb-4">Error: {adminError.message}</div>}

        {adminData && (
          <div className="bg-green-50 p-4 rounded mb-4">
            <h3 className="font-semibold">Admin Info:</h3>
            <pre>{JSON.stringify(adminData.getAdminMe, null, 2)}</pre>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={testTokenExpiry} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Test Token Expiry (Call getAdminMe)
          </button>

          <button onClick={clearTokens} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Clear All Tokens
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>First, login as admin using the default credentials</li>
          <li>Wait 30+ seconds for the token to expire</li>
          <li>Click "Test Token Expiry" to trigger a GraphQL query</li>
          <li>Check the browser console and network tab to see the automatic token refresh</li>
          <li>The admin data should load successfully after automatic token refresh</li>
        </ol>

        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <p className="font-semibold">Note:</p>
          <p>Tokens are set to expire in 30 seconds for testing purposes. In production, they would last 15 minutes for users and 2 hours for admins.</p>
        </div>
      </div>
    </div>
  );
}
