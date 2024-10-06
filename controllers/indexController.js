const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getIndex = async (req, res, next) => {
    res.render('index', { user: req.user });
}

const postIndex = async (req, res, next) => {
    try {
        if (req.body.password !== req.body.cpassword) {
            return res.status(400).send('Passwords do not match');
        }
        bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
            await prisma.user.create({
                data: {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                }
            });
            res.redirect('/');
        });
    } catch(err) {
        return next(err);
    }
}

module.exports = { getIndex, postIndex };