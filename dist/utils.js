"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const LEN = 7;
const generate = () => {
    const subset = "PASDFGHJKqwerty3456uiomQWERTYUIOLZXCpasdfghjklzxcvbnVBNM127890";
    let id = "";
    for (let i = 0; i < LEN; i++)
        id += subset[Math.floor(Math.random() * subset.length)];
    return id;
};
exports.generate = generate;
//# sourceMappingURL=utils.js.map