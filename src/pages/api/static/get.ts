import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // query separate by underscore "_"
  const filePath = (req.query.filePath as string).split("_").join("/");
  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContent = await fs.readFile(
    jsonDirectory + "/" + filePath,
    "utf-8"
  );
  res.status(200).json(fileContent);
}
