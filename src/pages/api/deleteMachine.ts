// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { machine_id } = JSON.parse(req.body);

  const deletedMachine = await prisma.machines
    .delete({
      where: { machine_id: machine_id },
    })
    .catch((e) =>
      res.status(400).json({
        message: "query deleteMachine error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(deletedMachine);
}
