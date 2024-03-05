import express from 'express'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
const router = express.Router();

import auth from '../../middleware/auth';
import user from '../../middleware/user';
import prisma from '../../client';



router.patch("/update", auth, user, async (request: Request, response: Response) => {
    try {

        const password = request.body.current_password
        const user = await prisma.user.findFirst({ where: { id: request.user.id } });

        const isMatch = await bcrypt.compare(password, user?.password as string)
        if (isMatch) {
            await prisma.user.update({
                where: { id: request.user.id },
                data: {
                    password: request.body.new_password,
                },
            });
            response.status(200).json({
                status: 200,
                message: "Password Updated Successfully..."
            });
        }
        else {
            response.status(500).json({
                status: 500,
                message: "Current Password is Incorrect..."
            });
        }

    }
    catch (error: any) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
})
module.exports = router;