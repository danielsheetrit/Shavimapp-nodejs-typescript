"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const userRouter = (0, express_1.Router)();
userRouter.post('/register', users_controller_1.register).post('/login', users_controller_1.login);
exports.default = userRouter;
//# sourceMappingURL=users.route.js.map