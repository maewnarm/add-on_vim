import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { machine_id } = req.query;

  const projects = await prisma.machines_signals
    .findMany({
      where: {
        machine_id: parseInt(
          Array.isArray(machine_id) ? machine_id[0] : machine_id
        ),
      },
      include: {
        machine: true,
        signal: { include: { signal_category: true } },
      },
    })
    .catch((e) =>
      res.status(400).json({
        message: "query loadMachinesSignals error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(projects);
}
