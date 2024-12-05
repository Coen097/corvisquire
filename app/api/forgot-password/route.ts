import { NextResponse } from "next/server";

import { dbConnect } from "@/database/connections/connection";
import { Users } from "@/database/models/userModel";

import { sendMail } from "@/lib/sendMail";
import { transporter } from "@/utils/transporters/transporter";

const DOMAIN = process.env.DOMAIN as string
const SENDER_EMAIL = process.env.SENDER_EMAIL as string

export async function POST(request: Request) {


    try {

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Oops! It looks like you're missing some information. Please provide your email" },
                { status: 400, statusText: "Bad Request" }
            );
        }

        await dbConnect();

        const user = await Users.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: "We couldn't find an account with that email. Please make sure you're registered first." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        if (!user.verified) {
            return NextResponse.json(
                { message: "Please verify your email address by clicking the link we sent to your inbox." },
                { status: 403, statusText: "Forbidden" }
            );
        }

        if (user.resetPasswordCounter > 5) {

            try {

                await sendMail({
                    to: email,
                    from: {
                        name: 'Persephone Stephenson from Thwackey',
                        email: SENDER_EMAIL
                    },
                    subject: "Password Reset Attempts Exceeded",
                    html: `
                    <p>You've exceeded the maximum number of password reset attempts.</p>
                    <p>If you need further assistance, please contact our support team.</p>
                    `
                });

            } catch (error) {

                try {

                    await transporter.sendMail({
                        to: email,
                        from: SENDER_EMAIL,
                        subject: "Password Reset Attempts Exceeded",
                        html: `
                        <p>You've exceeded the maximum number of password reset attempts.</p>
                        <p>If you need further assistance, please contact our support team.</p>
                        `
                    })

                } catch (error) {

                    return NextResponse.json(
                        { message: "Oops! Something went wrong while trying to send your confirmation email. Please try again later." },
                        { status: 502, statusText: "Bad Gateway" }
                    );

                }

            }

            return NextResponse.json(
                { message: "You've reached the maximum number of password reset attempts. Please contact support for further help." },
                { status: 418, statusText: "I'm a teapot" }
            );
        }

        const resetUrl = `${DOMAIN}/api/forgot-password/change-your-password/${user._id}`;

        try {

            await sendMail({
                to: email,
                from: {
                    name: 'Persephone Stephenson from Thwackey',
                    email: SENDER_EMAIL
                },
                subject: "Password Reset Request",
                html: `
                <h3>Password Reset Request</h3>
                <p>We received a request to reset your password.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
                `
            });

        } catch (error) {

            try {

                await transporter.sendMail({
                    to: email,
                    from: SENDER_EMAIL,
                    subject: "Password Reset Request",
                    html: `
                    <h3>Password Reset Request</h3>
                    <p>We received a request to reset your password.</p>
                    <p>Please click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                    `
                })

            } catch (error) {

                return NextResponse.json(
                    { message: "Oops! Something went wrong while trying to send your email. Please try again later." },
                    { status: 502, statusText: "Bad Gateway" }
                );

            }

        }

        user.resettingExpiresIn = Date.now() + 5 * 60 * 1000;
        await user.save();

        return NextResponse.json(
            { message: "We've sent a link to your email to reset your password. Please check your inbox." },
            { status: 200, statusText: "OK" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}
