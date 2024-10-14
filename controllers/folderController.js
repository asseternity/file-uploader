const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

const postCreate = async (req, res, next) => {
    const userId = req.user.id;
    const { name } = req.body;
    
    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.send(400).json({ error: "Folder name is required." });
    }

    try {
        const newFolder = await prisma.folder.create({
            data: {
                name: name,
                userId: userId,
            }
        });
        res.redirect('/folder');
    } catch(err) {
        return res.status(500).json({ error: "An error occurred when creating the folder."})
    }
}

const getIndex = async (req, res, next) => {
    const userWithFolders = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { folders: { include: { files: true }}}
    });
    res.render('folder', { user: userWithFolders });
}

const getEdit = async (req, res, next) => {
    const param = req.params.id;
    const folderId = parseInt(param);
    const correctFolder = await prisma.folder.findUnique({
        where: { id: folderId },
    });
    res.render('edit_folder', { folder: correctFolder });
}

const postEdit = async (req, res, next) => {
    const param = req.params.id;
    const folderId = parseInt(param);
    const newName = req.body.name;

    try {
        const correctFolder = await prisma.folder.update({
            where: { id: folderId },
            data: {
                name: newName
            }
        });
        res.redirect('/folder');

    } catch(err) {
        return res.status(500).json({ error: "An error occurred when renaming the folder." })
    }
}

module.exports = { postCreate, getIndex, getEdit, postEdit }