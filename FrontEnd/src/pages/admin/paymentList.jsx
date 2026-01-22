import React, { useEffect, useState } from 'react';
import { getAllPayments, processRefund } from '../../services/paymentService';
import { formatCurrency, formatDateTime } from '../../utils/formatter';
import { isAdmin } from '../../utils/helpers';
import Button from '../../components/button';
import LoadingSpinner from '../../components/loadingSpinner';
import { CreditCard, RefreshCcw, CheckCircle2, AlertCircle, Search } from 'lucide-react';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments(); // Maps to GET /api/payments
      setPayments(data);
    } catch (err) {
      console.error("Payment fetch error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId, amount) => {
    const reason = window.prompt("Enter reason for refund:");
    if (reason) {
      try {
        // Maps to PUT /api/payments/:id/refund
        await processRefund(paymentId, { refund_amount: amount, refund_reason: reason });
        alert("Refund processed successfully");
        fetchPayments();
      } catch (err) {
        alert("Refund failed: " + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    };
    return `px-2 py-1 rounded text-[10px] font-bold uppercase ${styles[status]}`;
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Financial Transactions</h2>
        <div className="flex gap-2">
           <Button variant="outline" className="text-xs">Download Statement</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => (
              <tr key={p.payment_id} className="hover:bg-background/30 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {p.transaction_id || `INT-${p.payment_id}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDateTime(p.payment_date)}
                </td>
                <td className="px-6 py-4 text-sm capitalize flex items-center gap-2">
                  <CreditCard size={14} className="text-gray-400" /> {p.payment_method}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-primary">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(p.payment_status)}>
                    {p.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Refund is only available for completed payments and only for Admins */}
                  {p.payment_status === 'completed' && isAdmin(user) && (
                    <button 
                      onClick={() => handleRefund(p.payment_id, p.amount)}
                      className="text-text-secondary hover:text-primary transition-colors text-xs font-bold flex items-center gap-1 justify-end w-full"
                    >
                      <RefreshCcw size={14} /> REFUND
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;