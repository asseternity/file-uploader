const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

const postCreate = async (req, res, next) => {}

const getIndex = async (req, res, next) => {}

const putFileID = async (req, res, next) => {}

const deleteFileID = async (req, res, next) => {}

module.exports = { postCreate, getIndex, putFileID, deleteFileID }