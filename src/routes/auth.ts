import express from 'express'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import JWT from "jsonwebtoken";
import prisma from '../client';
const router = express.Router();

router.post("/register", async (request: Request, response: Response) => {
    const { name, email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        response.status(500).json({
            status: 500,
            message: "Email is already taken, Please use another email...",
        });
    } else {

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        response.status(200).json({
            status: 200,
            message: "Registration Successfully..."
        })
    }

});


router.post("/login", async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        response.status(500).json({
            status: 500,
            message: "Invalid Email OR Password..."
        });
    }

    const isMatch = await bcrypt.compare(password, user?.password as string);
    if (!isMatch) {
        response.status(500).json({
            status: 500,
            message: "Invalid Email OR Password..."
        })
    };

    // Generate JsonWebToken
    const token = await JWT.sign({ id: user?.id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE
    });

    response.status(200).json({
        status: 200,
        message: "Login Successfully...",
        token: token,
        user: user,
    })



})

module.exports = router;