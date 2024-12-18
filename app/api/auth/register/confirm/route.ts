import { NextResponse } from "next/server";

import mongoose from "mongoose";

import { dbConnect } from "@/database/connections/connection";
import { Users } from "@/database/models/userModel";

import { sendMail } from "@/lib/sendMail";
import { transporter } from "@/utils/transporters/transporter";

const SENDER_EMAIL = process.env.SENDER_EMAIL as string

export async function PUT(request: Request) {

    try {

        const { _id } = await request.json();

        if (!_id || typeof _id !== "string") {
            return NextResponse.json(
                { message: "Invalid request. Please ensure all required information is provided and try again." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json(
                { message: "Invalid user ID. Please check the ID and try again." },
                { status: 422, statusText: "Unprocessable Content" }
            );
        }

        await dbConnect();

        const user = await Users.findById(_id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found. Please register before attempting verification." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        if (user.verified) {
            return NextResponse.json(
                { message: "Your account is already verified." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        user.verified = true;
        await user.save();

        try {

            await sendMail({
                to: user.email,
                from: {
                    name: "Persephone Stephenson from Thwackey",
                    email: SENDER_EMAIL
                },
                subject: "Your Account Has Been Verified!",
                text: `Hello ${user.username},\n\nCongratulations! Your account has been successfully verified. You can now access all features of our service.\n\nThank you for registering with us!`,
                html: `<p>Hello ${user.username},</p><p>Congratulations! Your account has been successfully verified. You can now access all features of our service.</p><p>Thank you for registering with us!</p>`,
            });

        } catch (error) {

            try {

                await transporter.sendMail({
                    to: user.email,
                    from: SENDER_EMAIL,
                    subject: "Your Account Has Been Verified!",
                    text: `Hello ${user.username},\n\nCongratulations! Your account has been successfully verified. You can now access all features of our service.\n\nThank you for registering with us!`,
                    html: `<p>Hello ${user.username},</p><p>Congratulations! Your account has been successfully verified. You can now access all features of our service.</p><p>Thank you for registering with us!</p>`,
                })

            } catch (error) {

                return NextResponse.json(
                    { message: "Oops! Something went wrong while trying to send your email. Please try again later.", },
                    { status: 502, statusText: "Bad Gateway", }
                );

            }

        }

        return NextResponse.json(
            { message: "Success! Your account has been verified. Please check your email for confirmation." },
            { status: 202, statusText: "Accepted" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}
