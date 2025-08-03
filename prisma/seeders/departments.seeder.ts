import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export default async function runDepartmentsSeeder(prisma: PrismaClient) {
  const filePath = path.join(__dirname, "../data/departments.csv");
  if (!fs.existsSync(filePath)) return;
  const csv = fs.readFileSync(filePath, "utf-8");
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  for (const dept of records) {
    const d = dept as any;
    await prisma.department.create({
      data: {
        name: d.name,
        description: d.description,
        status: d.status || undefined,
      },
    });
  }
}
