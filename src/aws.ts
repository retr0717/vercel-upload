import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId : process.env.ACCESS_KEY,
    secretAccessKey : process.env.SECRET_KEY,
    endpoint : "http://vercel-storage.s3-website-us-east-1.amazonaws.com"
})

export const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body : fileContent,
        Bucket : "vercel-storage",
        Key : fileName
    }).promise();

    console.log(response);
}