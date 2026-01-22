import React from 'react';
import ReportTable from '../../components/reportTable';

const WeeklyReport = () => {
  const weeklyData = [
    { week: 'Week 42', occupancy: '88%', revenue: 12400, bookings: 45, cancellations: 2 },
    { week: 'Week 41', occupancy: '75%', revenue: 9800, bookings: 38, cancellations: 5 },
  ];

  const columns = [
    { header: 'Week Period', key: 'week' },
    { header: 'Avg. Occupancy', key: 'occupancy' },
    { header: 'Total Bookings', key: 'bookings' },
    { 
      header: 'Gross Revenue', 
      key: 'revenue', 
      render: (val) => <span className="font-bold text-primary">£{val.toLocaleString()}</span> 
    },
    { 
      header: 'Cancellations', 
      key: 'cancellations',
      render: (val) => <span className={val > 4 ? "text-red-500 font-medium" : "text-gray-600"}>{val}</span>
    },
  ];

  return (
    <ReportTable 
      title="Weekly Performance Analytics" 
      timeframe="Last 4 Weeks" 
      data={weeklyData} 
      columns={columns} 
    />
  );
};

export default WeeklyReport;