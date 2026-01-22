import React from 'react';
import ReportTable from '../../components/reportTable';

const MonthlyReport = () => {
  const monthlyData = [
    { month: 'October 2023', net: 45000, tax: 9000, total: 54000, topRoom: 'Presidential Suite' },
    { month: 'September 2023', net: 42000, tax: 8400, total: 50400, topRoom: 'Deluxe Executive' },
  ];

  const columns = [
    { header: 'Month', key: 'month' },
    { header: 'Most Popular Room', key: 'topRoom' },
    { 
      header: 'Net Revenue', 
      key: 'net', 
      render: (val) => `£${val.toLocaleString()}` 
    },
    { header: 'Tax (20%)', key: 'tax', render: (val) => `£${val.toLocaleString()}` },
    { 
      header: 'Total Earnings', 
      key: 'total', 
      render: (val) => (
        <span className="text-lg font-bold text-text-secondary">
          £{val.toLocaleString()}
        </span>
      ) 
    },
  ];

  return (
    <ReportTable 
      title="Monthly Financial Statement" 
      timeframe="Current Fiscal Year" 
      data={monthlyData} 
      columns={columns} 
    />
  );
};

export default MonthlyReport;