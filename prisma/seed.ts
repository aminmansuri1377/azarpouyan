import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const languages = [
    {
      code: "fa",
      name: "فارسی",
      sortOrder: 1,
    },
    {
      code: "en",
      name: "English",
      sortOrder: 2,
    },
    {
      code: "ar",
      name: "العربية",
      sortOrder: 3,
    },
    {
      code: "tr",
      name: "Türkçe",
      sortOrder: 4,
    },
  ];

  for (const language of languages) {
    await prisma.language.upsert({
      where: {
        code: language.code,
      },
      update: {},
      create: language,
    });
  }

  console.log("Languages seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
