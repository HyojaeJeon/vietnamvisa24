import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// 실제 서버 스키마에 맞는 테스트 쿼리
const GET_APPLICATIONS = gql`
  query GetVisaApplications {
    getVisaApplications {
      id
      application_number
      visa_type
      full_name
      passport_number
      nationality
      phone
      email
      status
      created_at
      updated_at
    }
  }
`;

// 간단한 헬스체크 쿼리 (토큰 없이도 가능)
const GET_VISA_TYPES = gql`
  query GetVisaTypes {
    getVisaTypes
  }
`;

// 실제 서버 스키마에 맞는 테스트 뮤테이션
const CREATE_APPLICATION = gql`
  mutation CreateVisaApplication($input: VisaApplicationInput!) {
    createVisaApplication(input: $input) {
      id
      application_number
      visa_type
      full_name
      passport_number
      email
      status
      created_at
    }
  }
`;

const GraphQLTest = () => {
  const [mounted, setMounted] = useState(false);
  const [testResult, setTestResult] = useState("");

  // Check if component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_APPLICATIONS, {
    errorPolicy: "all",
  });

  const [createApplication] = useMutation(CREATE_APPLICATION, {
    errorPolicy: "all",
  });

  // 헬스체크용 쿼리 (토큰 없이도 작동)
  const { data: visaTypesData, loading: visaTypesLoading } = useQuery(GET_VISA_TYPES, {
    errorPolicy: "all",
  });

  // 연결 상태 계산
  const getConnectionStatus = () => {
    const isHealthy = visaTypesData?.getVisaTypes?.length > 0;
    if (visaTypesLoading) return { color: "bg-yellow-500", text: "text-yellow-600", label: "Connecting..." };
    if (isHealthy) return { color: "bg-green-500", text: "text-green-600", label: "Connected" };
    if (error || !isHealthy) return { color: "bg-red-500", text: "text-red-600", label: "Disconnected" };
    return { color: "bg-gray-400", text: "text-gray-600", label: "Unknown" };
  };

  const connectionStatus = getConnectionStatus();

  const testConnection = async () => {
    try {
      setTestResult("Testing GraphQL connection...");

      // 단순한 refetch로 연결 테스트
      const result = await refetch();

      if (result.data) {
        setTestResult("✅ GraphQL connection successful!");
      } else if (result.error) {
        setTestResult(`❌ GraphQL error: ${result.error.message}`);
      }
    } catch (err) {
      setTestResult(`❌ Connection failed: ${err.message}`);
    }
  };

  const testMutation = async () => {
    try {
      setTestResult("Testing GraphQL mutation...");
      const result = await createApplication({
        variables: {
          input: {
            visa_type: "E-visa",
            full_name: "Test User",
            passport_number: "TEST123456",
            nationality: "Test Country",
            birth_date: "1990-01-01",
            phone: "123-456-7890",
            email: "test@example.com",
            arrival_date: "2024-12-31",
            departure_date: "2025-01-07",
            purpose: "Tourism",
          },
        },
      });

      if (result.data) {
        setTestResult("✅ GraphQL mutation successful!");
        refetch(); // 새로고침
      }
    } catch (err) {
      setTestResult(`❌ Mutation failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">GraphQL Connection Test</h2>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${connectionStatus.color}`}></div>
          <span className={`text-sm font-medium ${connectionStatus.text}`}>{connectionStatus.label}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <button onClick={testConnection} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400" disabled={loading}>
            {loading ? "Testing..." : "Test GraphQL Query"}
          </button>

          <button onClick={testMutation} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
            Test GraphQL Mutation
          </button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded">
            <p className="font-mono text-sm">{testResult}</p>
          </div>
        )}

        {/* Connection Status */}
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">🔗 Connection Status</h3>
          {visaTypesLoading && <p className="text-blue-600">⏳ Checking server connection...</p>}

          {visaTypesData && (
            <div className="mb-4 text-green-600">
              <p className="font-semibold">✅ GraphQL Server is responding</p>
              <p className="text-sm">Available visa types: {visaTypesData.getVisaTypes?.join(", ")}</p>
              <p className="mt-1 text-xs text-gray-500">Server endpoint: /graphql (via Next.js proxy)</p>
            </div>
          )}

          {loading && <p className="text-blue-600">⏳ Loading user applications...</p>}
          {error && (
            <div className="text-red-600">
              <p className="font-semibold">❌ Error loading applications: {error.message}</p>
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">Error Details</summary>
                <pre className="p-2 mt-2 overflow-auto text-xs rounded bg-red-50">{JSON.stringify(error, null, 2)}</pre>
              </details>
            </div>
          )}
          {data && (
            <div className="text-green-600">
              <p className="font-semibold">✅ User applications loaded successfully</p>
              <p className="text-sm">Applications count: {data.getVisaApplications?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Data Preview */}
        {data?.getVisaApplications?.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">📊 Data Preview</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Latest applications:</p>
              {data.getVisaApplications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-2 text-xs rounded bg-gray-50">
                  <div className="font-semibold">{app.full_name}</div>
                  <div className="text-gray-600">
                    {app.visa_type} - {app.status} - {app.application_number}
                  </div>
                </div>
              ))}
              {data.getVisaApplications.length > 3 && <p className="text-xs text-gray-500">... and {data.getVisaApplications.length - 3} more</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLTest;
