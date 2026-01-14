import { Request, Response } from "express";

export const handleUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Nie przesłano pliku (brak pola 'image')" });
  }

  res.status(200).json({
    message: "Upload udany",
    url: req.file.path,
  });
};
