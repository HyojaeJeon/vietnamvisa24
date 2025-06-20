// Node.js v18+ 내장 fetch 사용

const query = `
  query {
    applications(page: 1, limit: 1) {
      applications {
        id
        applicationId
        documents {
          id
          type
          fileName
          fileUrl
          fileData
        }
      }
    }
  }
`;

async function testGraphQL() {
  try {
    const response = await fetch("http://localhost:5002/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    console.log("GraphQL Response:");
    console.log(JSON.stringify(result, null, 2));

    // Check if documents have fileUrl
    if (result.data?.applications?.applications?.length > 0) {
      const app = result.data.applications.applications[0];
      if (app.documents?.length > 0) {
        console.log("\n📄 Document Analysis:");
        app.documents.forEach((doc, index) => {
          console.log(`Document ${index + 1}:`);
          console.log(`  - Type: ${doc.type}`);
          console.log(`  - FileName: ${doc.fileName}`);
          console.log(`  - FileURL: ${doc.fileUrl}`);
          console.log(`  - Has FileData: ${!!doc.fileData}`);
          console.log("  ---");
        });
      } else {
        console.log("\n⚠️ No documents found in the application");
      }
    } else {
      console.log("\n⚠️ No applications found");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testGraphQL();
