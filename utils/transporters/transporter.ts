import nodemailer from "nodemailer"

const SENDER_EMAIL = process.env.SENDER_EMAIL as string
const PASS = process.env.PASS as string

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SENDER_EMAIL,
        pass: PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});