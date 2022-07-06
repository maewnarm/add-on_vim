import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./loadProjects";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    addedSignalText,
    deletedSignalText,
  }: { addedSignalText: number[][]; deletedSignalText: number[] } = JSON.parse(
    req.body
  );

  if (addedSignalText.length > 0) {
    // TODO modify to insert by loop
    addedSignalText.forEach(async (add) => {
      const createdMachineSignal =
        await prisma.$executeRaw`INSERT INTO machines_signals(machine_id,signal_id) VALUES (${add[0]},${add[1]});`
          .catch((e) =>
            res.status(400).json({
              message: "execute INSERT machines_signals error",
              error: e,
            })
          )
          .finally(async () => await prisma.$disconnect());
    });
  }
  if (deletedSignalText.length > 0) {
    const deletedMachineSignal =
      await prisma.$executeRaw`DELETE FROM machines_signals WHERE machine_signal_id IN (${Prisma.join(
        deletedSignalText
      )});`
        .catch((e) =>
          res.status(400).json({
            message: "execute DELETE machines_signals error",
            error: e,
          })
        )
        .finally(async () => await prisma.$disconnect());
  }
  res.status(200).json({ message: "succeed" });
}
