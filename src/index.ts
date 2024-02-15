const express = require('express');
const dotenv = require('dotenv');
import {generate} from  './utils';
import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from './files';
import { uploadFile } from './aws';

dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

console.log(__dirname+"name");

app.post("/deploy", async (req : any, res : any) => {

    const repoUrl = req.body.repoUrl;
    console.log("repoUrl : ", repoUrl);
    console.log("id : ", generate());

    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname,`/repos/${id}`));

    //getting all the files from the given path.
    const files = getAllFiles(path.join(__dirname,  `/repos/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })


    res.status(200).json({
        id : id
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Started Server On Port ${process.env.PORT}`);
})
