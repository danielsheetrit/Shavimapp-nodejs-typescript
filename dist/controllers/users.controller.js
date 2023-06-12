"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
require("dotenv/config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils");
const register = async (req, res) => {
    const { username, first_name, last_name, user_type, password } = req.body;
    if ((0, utils_1.isEmpty)([username, first_name, last_name, user_type, password])) {
        return res
            .status(400)
            .json({ message: 'One or more of the fields are empty' });
    }
    const validPassowrd = /^[a-zA-Z0-9]{8,}$/;
    if (!validPassowrd.test(password)) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const userExists = await user_model_1.User.exists({ username });
    if (userExists !== null) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPw = await bcryptjs_1.default.hash(password, 8);
    try {
        const user = new user_model_1.User({
            username,
            first_name,
            last_name,
            user_type,
            password: hashedPw,
        });
        await user.save();
        res.status(201).json({ message: 'User created' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to register' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    if ((0, utils_1.isEmpty)([username, password])) {
        return res
            .status(400)
            .json({ message: 'One or more of the fields are empty' });
    }
    try {
        const user = await user_model_1.User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }
        const acsessToken = jsonwebtoken_1.default.sign({
            _id: user.id.toString(),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
        }, process.env.JWT_SECRET);
        user.password = '';
        return res.status(200).json({ acsessToken, user });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to login' });
    }
};
exports.login = login;
//# sourceMappingURL=users.controller.js.map