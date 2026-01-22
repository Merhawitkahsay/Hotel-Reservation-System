import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class EmailService {
    static async sendVerificationEmail(email, firstName) {
        const mailOptions = {
            from: `"LuxHotel Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to LuxHotel - Verify Your Account',
            html: `
                <div style="font-family: serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #1a1a1a;">Welcome to LuxHotel, ${firstName}!</h2>
                    <p>Thank you for registering. Your account has been created successfully.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/verify?email=${email}" 
                           style="background: #1a1a1a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                           Verify Account
                        </a>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    }

    static async sendBookingConfirmation(to, name, details) {
        console.log(`Attempting to send booking email to: ${to}`);
        const mailOptions = {
            from: `"LuxHotel" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Finalize Your Stay - Room ${details.room_number}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #c5a059;">Reservation Confirmed!</h2>
                    <p>Dear ${name}, your booking is currently <strong>Pending Payment</strong>.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Ref:</strong> #LUX-${details.reservation_id}</p>
                        <p><strong>Dates:</strong> ${details.check_in} to ${details.check_out}</p>
                        <p><strong>Total:</strong> ${details.amount} ETB</p>
                    </div>
                    <h3>Choose Your Payment Method:</h3>
                    <div style="margin-bottom: 20px; border-left: 4px solid #c5a059; padding-left: 15px;">
                        <h4 style="color: #666; margin-bottom: 5px;">1. Local Bank Transfer</h4>
                        <p style="font-size: 13px; margin: 0;"><strong>CBE Account:</strong> 1000123456789 <br/>
                        <span style="color: #d9534f;">*Use Reference #LUX-${details.reservation_id}</span></p>
                    </div>
                    <div style="border-left: 4px solid #1a1a1a; padding-left: 15px;">
                        <h4 style="color: #666; margin-bottom: 10px;">2. International Online Payment</h4>
                        <a href="http://localhost:5173/payment?ref=${details.reservation_id}&amount=${details.amount}" 
                           style="background: #c5a059; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                           Pay via Credit Card / PayPal
                        </a>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    }
}
export default EmailService;