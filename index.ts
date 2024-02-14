const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req : any, res :any) => {

    const repoUrl = await req.body.repoUrl;
})

app.listen(process.env.PORT, () => {
    console.log(`Started Server On Port ${process.env.PORT}`);
})
