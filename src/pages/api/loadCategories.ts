import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const projects = await prisma.signal_categories
    .findMany()
    .catch((e) =>
      res.status(400).json({
        message: "query loadCategories error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(projects);
}
