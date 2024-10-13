const nodemailer = require('nodemailer');
require('dotenv').config();


const SendOtpEmail = async(email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            pool: true, // enable connection pooling
            maxConnections: 5, // number of parallel connections to make
            maxMessages: 100, // max number of messages per connection
            rateLimit: 10 // number of emails per second
        });

        const mailOptions = {
            from: `'Sabon Depot' <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `${otp} is your Sabon Depot code.`,
            html: `
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2>OTP Verification</h2>
                    <p>Dear Customer,</p>
                    <p>Your OTP code is: <strong>${otp}</strong></p>
                    <p>Please use this code to complete your registration. The code is valid for 5 minutes.</p>
                    <p>Thank you for choosing Sabon Depot!</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
};

module.exports = SendOtpEmail




// const sgMail = require('@sendgrid/mail');
// require('dotenv').config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const SendOtpEmail = async (email, otp) => {
//     const msg = {
//         to: email,
//         from: process.env.EMAIL_USER, // Use the email address or domain you verified with SendGrid
//         subject: 'Your OTP Code',
//         text: `${otp} is your Sabon Depot code.`,
//     };

//     try {
//         await sgMail.send(msg);
//         console.log('Email sent');
//     } catch (error) {
//         console.error('Error sending email: ', error);
//     }
// };

// module.exports = SendOtpEmail;
