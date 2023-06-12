"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.Document = exports.Schema = exports.mongoose = void 0;
require("dotenv/config");
const mongoose_1 = __importStar(require("mongoose"));
exports.mongoose = mongoose_1.default;
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return mongoose_1.Schema; } });
Object.defineProperty(exports, "Document", { enumerable: true, get: function () { return mongoose_1.Document; } });
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return mongoose_1.Model; } });
mongoose_1.default.connect(process.env.MONGO_URI).catch((err) => {
    console.error(`Failed to connect MongoDB: ${err}`);
});
mongoose_1.default.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});
//# sourceMappingURL=mongoose.js.map