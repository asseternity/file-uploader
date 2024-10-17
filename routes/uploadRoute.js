const express = require('express');
const uploadRoute = express.Router();
const multer  = require('multer')
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v2 } = require('cloudinary'); 

// configure multer's storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// apply storage to multer
const upload = multer({ storage: storage });

uploadRoute.get('/', async (req, res, next) => {
    const userWithFolders = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { folders: { include: { files: true }}}
    });
    res.render('upload', { user: userWithFolders });
});

// configure cloudinary
v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// cloudinary's upload function
cloudUpload = async (req, res, next) => {
    const folderId = parseInt(req.body.uploadDBFolder);
    const fileSizeString = String(req.file.size);

    try {
        const result = await v2.uploader.upload(
            req.file.path
        )
        await prisma.file.create({
            data: {
                filename: req.file.filename,
                filepath: result.secure_url,
                filesize: fileSizeString,
                folderId: folderId,
            }
        });
        const userWithFolders = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { folders: { include: { files: true }}}
        });
        res.render('folder', { user: userWithFolders });
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "An error occurred while uploading the file to the cloud." })
    }
}

uploadRoute.post('/profile', upload.single('avatar'), cloudUpload);


// uploadRoute.post('/profile', upload.single('avatar'), async function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded." });
//     }
//     const folderId = parseInt(req.body.uploadDBFolder);
//     const fileSizeString = String(req.file.size);
//     try {
//         await prisma.file.create({
//             data: {
//                 filename: req.file.filename,
//                 filepath: path.join('uploads', req.file.filename),
//                 filesize: fileSizeString,
//                 folderId: folderId,
//             }
//         });
//         const userWithFolders = await prisma.user.findUnique({
//             where: { id: req.user.id },
//             include: { folders: { include: { files: true }}}
//         });
//         res.render('folder', { user: userWithFolders });
//     } catch(err) {
//         console.error(err);
//         return res.status(500).json({ error: "An error occurred while saving the file data." })
//     }
// });

uploadRoute.post('/download/:fileId', async function (req, res, next) {
    const fileId = parseInt(req.params.fileId);

    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });
        res.download(file.filepath, (err) => {
            if (err) {
                console.log(err);
                return res.status(404).json({ error: "File not found." });
            }
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while downloading the file." });
    }
});
  
uploadRoute.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
});
  
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
uploadRoute.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
    //
    // req.body will contain the text fields, if there were any
});

module.exports = uploadRoute;