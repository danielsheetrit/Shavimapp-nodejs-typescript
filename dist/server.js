"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpTerminator = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_terminator_1 = require("http-terminator");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
require("./db/mongoose");
const users_route_1 = __importDefault(require("./routes/users.route"));
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/users', users_route_1.default);
exports.server = http_1.default.createServer(app);
exports.httpTerminator = (0, http_terminator_1.createHttpTerminator)({
    server: exports.server,
});
app.use('*', (_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map