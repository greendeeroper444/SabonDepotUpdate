const nodemailer = require('nodemailer');
require('dotenv').config();

const SendPasswordResetEmail = async(emailAddress, newPassword) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `'Sabon Depot' <${process.env.EMAIL_USER}>`,
        to: emailAddress,
        subject: 'Your New Password',
        text: `Your password has been reset. Your new password is: ${newPassword}\n\nPlease change this password after logging in for better security.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    SendPasswordResetEmail,
};
