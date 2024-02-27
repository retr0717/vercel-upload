const express = require('express');
const dotenv = require('dotenv');
import {generate} from  './utils';
import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from './files';
import { uploadFile } from './aws';
import { createClient} from 'redis';

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/status', async (req:any , res : any) => {
    const id = req.query.id;
    const resposne = await subscriber.hGet("status", id as string);

    res.json({
        status : resposne
    })
})

app.post("/deploy", async (req : any, res : any) => {

    const repoUrl = req.body.repoUrl;
    console.log("repoUrl : ", repoUrl);
    console.log("id : ", generate());

    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname,`/repos/${id}`));

    //getting all the files from the given path.
    const files = getAllFiles(path.join(__dirname,  `/repos/${id}`));
    
    try
    {
        const uploadPromises = files.map(file => uploadFile(file.slice(__dirname.length + 1), file));

        await Promise.all(uploadPromises);

        //pushing the id to the queue.
        publisher.lPush('build-queue', id);

        //store the id with the current status in redis
        publisher.hSet("status", id, "uploaded");

        res.status(200).json({
            id : id
        })
    }
    catch(err)
    {
        console.log("upload : ", err);
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Started Server On Port ${process.env.PORT}`);
})
