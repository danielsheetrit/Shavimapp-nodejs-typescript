"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("../db/mongoose");
const userSchema = new mongoose_1.mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must include at least 8 characters.'],
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'chief'],
        default: 'user',
    },
    created_at: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
});
const User = mongoose_1.mongoose.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.model.js.map