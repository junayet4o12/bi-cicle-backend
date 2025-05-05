import nodemailer from 'nodemailer'
import config from '../config';
export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
        auth: {
            user: "muhammadjunayetmaruf@gmail.com",
            pass: "dqcx abdu ebat otbh",
        },
    });

    try {
        await transporter.sendMail({
            from: 'muhammadjunayetmaruf@gmail.com',
            to,
            subject,
            text: '',
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
}