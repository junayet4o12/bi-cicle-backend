import nodemailer from 'nodemailer'
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
        auth: {
            user: "muhammadjunayetmaruf@gmail.com",
            pass: "dqcx abdu ebat otbh",
        },
    });

    await transporter.sendMail({
        from: 'muhammadjunayetmaruf@gmail.com', // sender address
        to: to, // list of receivers
        subject: `Reset your password within 10 mins`, // Subject line
        text: '', // plain text body
        html: html, // html body
    });
}