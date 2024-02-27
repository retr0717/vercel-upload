const dotenv = require('dotenv');
dotenv.config();

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
import fs from 'fs/promises';

const s3Client = new S3Client({
    endpoint: process.env.ENDPOINT, // Replace with your region
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: process.env.REGION, // Set your desired region here
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
    try {
        const fileContent = await fs.readFile(localFilePath);

        const uploadParams = {
            Bucket: "vercel-storage",
            Key: fileName,
            Body: fileContent,
        };

        const response = await s3Client.send(new PutObjectCommand(uploadParams));

        console.log("File uploaded successfully. Response:", response);
        return response;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err; // Re-throw to handle errors appropriately
    }
};