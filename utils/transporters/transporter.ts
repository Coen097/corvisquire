import nodemailer from "nodemailer"

const USER = process.env.NODEMAILER_USER as string
const PASS = process.env.NODEMAILER_PASS as string

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: USER,
        pass: PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});