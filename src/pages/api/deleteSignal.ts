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

  const { signal_id } = JSON.parse(req.body);

  const deletedSignal = await prisma.signals
    .delete({
      where: { signal_id: signal_id },
    })
    .catch((e) =>
      res.status(400).json({
        message: "query deleteSignal error",
        error: e,
      })
    )
    .finally(async () => await prisma.$disconnect());

  res.status(200).json(deletedSignal);
}
