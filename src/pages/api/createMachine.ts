// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const machineData = JSON.parse(req.body);

  const createdMachine = await prisma.machines
    .create({
      data: machineData,
    })
    .catch((e) =>
      res.status(400).json({
        message: "query createMachine error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(createdMachine);
}
