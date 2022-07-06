import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { project_id } = req.query;

  const projectSignals =
    await prisma.$queryRaw`SELECT * FROM projects INNER JOIN machines USING (project_id) INNER JOIN machines_signals USING (machine_id) INNER JOIN signals USING (signal_id) INNER join signal_categories USING(signal_category_id) WHERE project_id = ${project_id}`
      .catch((e) =>
        res.status(400).json({
          message: "query loadProjectSignals error",
          error: e,
        })
      )
      .finally(async () => await prisma.$disconnect());

  res.status(200).json(projectSignals);
}
