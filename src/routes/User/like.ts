import express from 'express'
import { Request, Response } from 'express'
const router = express.Router();

import auth from '../../middleware/auth';
import user from '../../middleware/user';
import prisma from '../../client';



router.get("/:post_id", auth, user, async (request: Request, response: Response) => {
    const { post_id } = request.params;
    await prisma.like.create({
        data: {
            user_id: request.user.id,
            post_id: post_id,
        },
    });
    response.status(200).json({
        status: 200,
        message: "Like Successfully..."
    })
});



router.get("/remove/:id", auth, user, async (request: Request, response: Response) => {
    const { id } = request.params;
    await prisma.like.delete({ where: { id } });
    response.status(200).json({
        status: 200,
        message: "Unlike Successfully..."
    })

});

module.exports = router;