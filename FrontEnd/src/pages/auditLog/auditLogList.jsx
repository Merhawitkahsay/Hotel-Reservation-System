import React from 'react';
import { formatDateTime } from '../../utils/formatter'; // Integrated

const AuditLogList = ({ logs }) => {
  return (
    // ... table code
    <td className="px-6 py-4">
      {/* Formats timestamps like "2023-11-20T14:30:00Z" to "20 Nov 2023, 14:30" */}
      {formatDateTime(log.timestamp)}
    </td>
  );
};

export default AuditLogList;