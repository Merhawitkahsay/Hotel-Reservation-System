
import { Download, Printer, FileText } from 'lucide-react';
import Button from './button';

/**
 * ReportTable Component
 * @param {string} title - The heading for the report
 * @param {string} timeframe - Display text for the period (e.g., "Oct 2023")
 * @param {Array} data - The raw array of objects from the database
 * @param {Array} columns - Config array: { header: string, key: string, render?: func }
 */
const ReportTable = ({ title, timeframe, data = [], columns = [] }) => {

  // Function to handle CSV Export (Service integration placeholder)
  const handleExportCSV = () => {
    console.log(`Exporting ${title} to CSV...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <div>
          <h3 className="text-xl font-serif font-bold text-primary">{title}</h3>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">
            Reporting Period: <span className="text-text-secondary">{timeframe}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="p-2.5 text-gray-500 hover:bg-white rounded-lg border border-gray-200 transition-all shadow-sm hover:text-primary"
            title="Print Report"
          >
            <Printer size={18} />
          </button>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs py-2 px-4 border-primary/20"
          >
            <Download size={14} /> EXPORT DATA
          </Button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-background/40 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={40} className="text-gray-200" />
                    <p className="text-gray-400 italic">
                      No historical records found for this period.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Summary Footer (optional) */}
      <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-right">
        Total Records: {data.length}
      </div>

    </div>
  );
};

export default ReportTable;
