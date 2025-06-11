
const reportsResolvers = {
  Query: {
    reportsData: async (_, { dateRange }) => {
      // Mock data for now - replace with actual database queries
      return {
        overviewStats: {
          totalApplications: 150,
          approvalRate: 85.5,
          averageProcessingTime: 7.2,
          totalRevenue: 45000.0
        },
        visaTypeStats: [
          {
            type: "E-Visa",
            count: 80,
            percentage: 53.3,
            revenue: 24000.0
          },
          {
            type: "Business Visa",
            count: 45,
            percentage: 30.0,
            revenue: 15000.0
          },
          {
            type: "Tourist Visa",
            count: 25,
            percentage: 16.7,
            revenue: 6000.0
          }
        ],
        monthlyTrends: [
          {
            month: "2024-01",
            applications: 120,
            revenue: 36000.0
          },
          {
            month: "2024-02",
            applications: 135,
            revenue: 40500.0
          },
          {
            month: "2024-03",
            applications: 150,
            revenue: 45000.0
          }
        ]
      };
    }
  }
};

module.exports = reportsResolvers;
