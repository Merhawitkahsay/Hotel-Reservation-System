/**
 * paymentController.js - Payment controller
 * * Handles all payment-related operations including processing payments,
 * refunds, and payment status management.
 * * Dependencies:
 * - Payment model for database operations
 * - Reservation model for reservation validation
 */

import Payment from '../models/Payment.js';
import Reservation from '../models/Reservation.js';
import axios from 'axios'; 

class PaymentController {

  /**
   * Initialize Guest Payment (Chapa Integration)
   * This is triggered when the guest clicks the link in their email
   */
  static async initializeGuestPayment(req, res) {
    try {
      const { reservation_id } = req.body;

      // 1. Fetch reservation details to get the amount and guest email
      // Note: You might need to adjust your Reservation model to include guest info
      const reservation = await Reservation.findById(reservation_id); 
      if (!reservation) throw new Error('Reservation not found');

      // 2. Prepare Chapa Payload
      const tx_ref = `tx-hidmo-${reservation_id}-${Date.now()}`;
      
      const chapaPayload = {
        amount: reservation.total_amount,
        currency: 'ETB',
        email: reservation.guest_email || 'guest@example.com',
        first_name: reservation.first_name || 'Guest',
        last_name: reservation.last_name || 'User',
        tx_ref: tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/payments/verify/${tx_ref}`,
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        "customization[title]": "ህድሞ Hotel Stay",
        "customization[description]": `Payment for Room ${reservation.room_number}`
      };

      // 3. Call Chapa API
      const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaPayload, {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
      });

      if (response.data.status === 'success') {
        res.json({
          success: true,
          checkout_url: response.data.data.checkout_url
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }  /**
   * Create new payment
   */
  static async createPayment(req, res) {
    try {
      const {
        reservation_id,
        amount,
        payment_method,
        transaction_id,
        notes
      } = req.body;

      // Validate reservation exists
      const reservation = await Reservation.findById(reservation_id);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation not found'
        });
      }

      const paymentData = {
        reservation_id,
        amount,
        payment_method,
        transaction_id,
        notes,
        processed_by: req.user.id
      };

      const payment = await Payment.create(paymentData);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create payment'
      });
    }
  }

  /**
   * Get all payments with filters
   */
  static async getAllPayments(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20,
        reservation_id,
        payment_status,
        payment_method,
        start_date,
        end_date 
      } = req.query;

      const filters = {};
      if (reservation_id) filters.reservation_id = reservation_id;
      if (payment_status) filters.payment_status = payment_status;
      if (payment_method) filters.payment_method = payment_method;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;

      const result = await Payment.getAll(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payments'
      });
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment'
      });
    }
  }

  /**
   * Process payment (mark as completed)
   */
  static async processPayment(req, res) {
    try {
      const { id } = req.params;
      const { transaction_id } = req.body;

      const payment = await Payment.processPayment(id, req.user.id, transaction_id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process payment'
      });
    }
  }

  /**
   * Process refund
   */
  static async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { refund_amount, reason } = req.body;

      if (!refund_amount || refund_amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid refund amount is required'
        });
      }

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Refund reason is required'
        });
      }

      const payment = await Payment.processRefund(id, refund_amount, reason.trim());

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Process refund error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process refund'
      });
    }
  }

  /**
   * Get payment summary for reservation
   */
  static async getReservationPayments(req, res) {
    try {
      const { reservation_id } = req.params;
      const summary = await Payment.getReservationSummary(reservation_id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get reservation payments error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get reservation payments'
      });
    }
  }

  /**
   * Get financial report
   */
  static async getFinancialReport(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const report = await Payment.getFinancialReport(start_date, end_date);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Get financial report error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get financial report'
      });
    }
  }
}

export default PaymentController;
