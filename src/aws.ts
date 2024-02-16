const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
import fs from "fs";

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

export const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);

    const uploadParams = {
        Bucket: 'vercel-storage',
        Key: fileName,
        Body: fileContent,
    };

    try
    {
        const response = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("File uploaded successfully. Response:", response);
    }
    catch(err)
    {
        console.log(err);
    }
}