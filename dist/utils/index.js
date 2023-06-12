"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
const isEmpty = (props) => {
    return props.some((prop) => !prop || !prop.trim().length);
};
exports.isEmpty = isEmpty;
//# sourceMappingURL=index.js.map