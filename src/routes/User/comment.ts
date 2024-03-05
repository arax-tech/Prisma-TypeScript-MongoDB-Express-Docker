import express from 'express'
import { Request, Response } from 'express'
const router = express.Router();

import auth from '../../middleware/auth';
import user from '../../middleware/user';
import prisma from '../../client';



router.post("/store", auth, user, async (request: Request, response: Response) => {
    const { post_id, comment } = request.body;
    await prisma.comment.create({
        data: {
            user_id: request.user.id,
            post_id: post_id,
            comment
        },
    });
    response.status(200).json({
        status: 200,
        message: "Comment Create Successfully..."
    })
});

router.patch("/update/:id", auth, user, async (request: Request, response: Response) => {
    const { comment } = request.body;
    const { id } = request.params;
    await prisma.comment.update({
        where: { id },
        data: {
            comment,
        },
    });
    response.status(200).json({
        status: 200,
        message: "Comment Update Successfully..."
    })

});
router.delete("/delete/:id", auth, user, async (request: Request, response: Response) => {
    const { id } = request.params;
    await prisma.comment.delete({ where: { id } });
    response.status(200).json({
        status: 200,
        message: "Comment Delete Successfully..."
    })

});

module.exports = router;