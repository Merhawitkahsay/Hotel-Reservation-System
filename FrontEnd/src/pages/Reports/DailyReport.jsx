import React from 'react';
import ReportTable from '../../components/reportTable';

const DailyReport = () => {
  const dailyData = [
    { id: '101', guest: 'John Wick', room: '204', revenue: 450, status: 'Completed' },
    { id: '102', guest: 'Wanda M.', room: '101', revenue: 200, status: 'Active' },
  ];

  const columns = [
    { header: 'Trans. ID', key: 'id' },
    { header: 'Guest Name', key: 'guest' },
    { header: 'Room', key: 'room' },
    { 
      header: 'Revenue', 
      key: 'revenue', 
      render: (val) => <span className="font-bold text-primary">£{val.toFixed(2)}</span> 
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${val === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {val}
        </span>
      )
    },
  ];

  return <ReportTable title="Daily Financial Summary" timeframe="Today, Oct 24" data={dailyData} columns={columns} />;
};

export default DailyReport;