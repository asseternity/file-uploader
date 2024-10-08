const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

const postCreate = async (req, res, next) => {}

const getIndex = async (req, res, next) => {}

const putFolderID = async (req, res, next) => {}

const deleteFolderID = async (req, res, next) => {}

module.exports = { postCreate, getIndex, putFolderID, deleteFolderID }