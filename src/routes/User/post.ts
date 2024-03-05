import express from 'express'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
const router = express.Router();

import auth from '../../middleware/auth';
import user from '../../middleware/user';
import prisma from '../../client';

import multer from 'multer';
import fs from "fs"
import path from "path"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/post')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];

        cb(null, "post" + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
router.get("/", auth, user, async (request: Request, response: Response) => {
    try {
        // Pagination
        let page = Number(request.query.page) || 1;
        let limit = Number(request.query.limit) || 2;
        if (page < 0) { page = 1 }
        if (limit < 0 || limit > 100) { limit = 2 }
        let skip = (page - 1) * limit;
        const totalPosts = await prisma.post.count();
        const totalPages = Math.ceil(totalPosts / limit);


        const posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                user: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                likes: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                },
            }
        });

        response.status(200).json({
            status: 200,
            posts: posts,
            currentPage: page,
            limit: limit,
            totalPages: totalPages,
        });
    }
    catch (error: any) {
        response.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

// router.get("/search", auth, user, async (request: Request, response: Response) => {
//     try {
//         const { keyword } = request.query;
//         const posts = await prisma.post.findMany({
//             where: {
//                 OR: [
//                     { title: { search: keyword } },
//                     { description: { search: keyword } },
//                 ],
//             },
//         });

//         response.status(200).json({
//             status: 200,
//             posts: posts
//         });
//     }
//     catch (error: any) {
//         response.status(500).json({
//             status: 500,
//             message: error.message
//         });
//     }
// });

router.post("/store", auth, user, upload.single('image'), async (request: Request, response: Response) => {
    if (request.file) {
        request.body.image = `/images/post/${request.file.filename}`;
    }
    const { title, description, image } = request.body;
    await prisma.post.create({
        data: {
            user_id: request.user.id,
            title,
            description,
            image,
        },
    });
    response.status(200).json({
        status: 200,
        message: "Post Create Successfully..."
    })
});

router.get("/:id", auth, user, async (request: Request, response: Response) => {
    const { id } = request.params;
    const post = await prisma.post.findUnique({
        where: { id }, include: {
            user: true,
            comments: true,
            likes: true
        }
    });
    response.status(200).json({
        status: 200,
        post: post
    })

});
router.patch("/update/:id", auth, user, upload.single('image'), async (request: Request, response: Response) => {

    const { id } = request.params;
    const post = await prisma.post.findFirst({ where: { id } });
    if (request.file) {
        if (post?.image && post.image.length > 0) {
            const oldImage = `images${post.image.split("/images")[1]}`
            fs.unlinkSync(path.join(__dirname, "../../../public/" + oldImage))
        }
        request.body.image = `/images/post/${request.file.filename}`;
    } else {
        request.body.image = post?.image

    }

    const { title, description, image } = request.body;

    await prisma.post.update({
        where: { id },
        data: {
            title,
            description,
            image
        },
    });
    response.status(200).json({
        status: 200,
        message: "Post Update Successfully..."
    })

});
router.delete("/delete/:id", auth, user, async (request: Request, response: Response) => {
    const { id } = request.params;

    const post = await prisma.post.findFirst({ where: { id } });
    if (post?.image && post.image.length > 0) {
        const oldImage = `images${post.image.split("/images")[1]}`
        fs.unlinkSync(path.join(__dirname, "../../../public/" + oldImage))
    }

    await prisma.post.delete({ where: { id } });
    response.status(200).json({
        status: 200,
        message: "Post Delete Successfully..."
    })

});

module.exports = router;