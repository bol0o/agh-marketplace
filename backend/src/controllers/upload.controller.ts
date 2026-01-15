import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const handleUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded (missing 'image' field)" });
  }

  res.status(200).json({
    message: "Upload successful",
    url: req.file.path,
  });
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (imageUrl: string) => {
  if (!imageUrl) return;

  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const folderName = parts[parts.length - 2];

    const publicIdWithExtension = `${folderName}/${fileName}`;
    const publicId = publicIdWithExtension.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
