import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || "public_geSeO/rlqaQXLVN/gNKBHRR7KxY=";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_GU3aLztW0DjdFfSzTtp8btjJ7vw=";
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/zp0tch54w";

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint
});

export default imagekit;
