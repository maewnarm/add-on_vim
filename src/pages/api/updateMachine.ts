// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { machine_id, machine_name } = JSON.parse(req.body);

  const updatedMachine = await prisma.machines
    .update({
      where: { machine_id: machine_id },
      data: { machine_name: machine_name },
    })
    .catch((e) =>
      res.status(400).json({
        message: "query updateMachine error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(updatedMachine);
}
