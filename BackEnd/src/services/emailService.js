/**
 * emailService.js - Handles sending transactional emails
 */
import nodemailer from 'nodemailer';

class EmailService {
  /**
   * Sends a verification email to a new user
   * @param {string} email - Recipient's email address
   * @param {string} firstName - User's first name for personalization
   * @param {string} token - The unique verification token generated in the controller
   */
  static async sendVerificationEmail(email, firstName, token) {
    // 1. Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    // 2. Define the verification link pointing to your React Frontend
    // We use /verify/ to match your App.jsx route: <Route path="/verify/:token" ... />
    const verificationLink = `http://localhost:5173/verify/${token}`;

    // 3. Define the email content with a professional HTML template
    const mailOptions = {
      from: `"Reserve-Better Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Reserve-Better Hotel Reservation System - Verify Your Account',
      html: `
        <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; letter-spacing: 2px;">LUX<span style="color: #c5a059;">HOTEL</span></h1>
          </div>
          
          <h2 style="color: #c5a059; text-align: center; font-size: 22px;">Welcome, ${firstName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; text-align: center; color: #374151;">
            Thank you for choosing us for your luxury stay. To complete your registration and secure your account, please verify your email address below.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationLink}" 
               style="background-color: #1a1a1a; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; letter-spacing: 2px; font-size: 14px;">
               VERIFY ACCOUNT
            </a>
          </div>
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
            If the button above doesn't work, copy and paste this link into your browser: <br/>
            <a href="${verificationLink}" style="color: #c5a059; word-break: break-all;">${verificationLink}</a>
          </p>
          
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
          
          <p style="font-size: 11px; color: #6b7280; text-align: center;">
            This link will expire in 24 hours. If you did not create an account with LuxHotel, please ignore this email.
          </p>
        </div>
      `
    };

    // 4. Send the mail
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully to:', email);
      return info;
    } catch (error) {
      console.error(' Nodemailer error:', error.message);
      throw new Error('Failed to send verification email');
    }
  }
}

export default EmailService;