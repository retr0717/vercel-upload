"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const dotenv = require('dotenv');
const utils_1 = require("./utils");
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const files_1 = require("./files");
const aws_1 = require("./aws");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
dotenv.config();
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    console.log("repoUrl : ", repoUrl);
    console.log("id : ", (0, utils_1.generate)());
    const id = (0, utils_1.generate)();
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `/repos/${id}`));
    //getting all the files from the given path.
    const files = (0, files_1.getAllFiles)(path_1.default.join(__dirname, `/repos/${id}`));
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
    }));
    //pushing the id to the queue.
    publisher.lPush('build-queue', id);
    //
    res.status(200).json({
        id: id
    });
}));
app.listen(process.env.PORT, () => {
    console.log(`Started Server On Port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map