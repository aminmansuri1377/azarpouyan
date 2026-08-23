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

  const faLang = await prisma.language.findUnique({ where: { code: "fa" } });
  const enLang = await prisma.language.findUnique({ where: { code: "en" } });

  if (faLang && enLang) {
    await prisma.project.upsert({
      where: { slug: "pardis-pouyan" },
      update: {},
      create: {
        slug: "pardis-pouyan",
        imageUrl: "/images/project1.png",
        images: [
          "/images/project1.png",
          "/images/project2.png",
          "/images/office.jpg",
          "/images/hands.jpg",
        ],
        published: true,
        translations: {
          create: [
            {
              languageId: faLang.id,
              name: "پردیس پویان",
              slug: "pardis-pouyan",
              summary:
                "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
              specifications:
                "نام پروژه: پردیس پویان\nموقعیت پروژه: مشکین‌دشت، استان البرز\nتعداد واحدهای مسکونی: ۲۴۵ واحد\nتعداد بلوک‌های مسکونی: ۷ بلوک\nمساحت زمین پروژه: ۷۶۰۰ مترمربع\nمساحت واحدهای خدماتی: ۵۰۰۰ مترمربع\nمساحت فضای سبز هم‌سطح: ۱۰۰۰ مترمربع\nمساحت فضای سبز غیرهم‌سطح: ۵۵۰۰ مترمربع (روف‌گاردن)\nمتراژ واحدهای مسکونی: از ۸۰ تا ۱۴۰ مترمربع\nکاربری پروژه: مسکونی، تجاری، خدماتی و رفاهی",
              description:
                "<p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. طراحان گرافیک از این متن برای نمایش فرم و چیدمان محتوا استفاده می‌کنند. هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی است. و چیدمان محتوا استفاده می‌کنند.</p><h2>اولین مقاله نوشته شده :</h2><p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. طراحان گرافیک از این متن برای نمایش فرم و چیدمان محتوا استفاده می‌کنند. هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی است.</p><h2>اولین مقاله نوشته شده :</h2><p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. طراحان گرافیک از این متن برای نمایش فرم و چیدمان محتوا استفاده می‌کنند. هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی است.</p>",
              seoTitle: "پروژه پردیس پویان | شرکت ساختمانی و بازرگانی پویان",
              seoDescription:
                "پروژه ساختمانی پردیس پویان با امکانات رفاهی و استانداردهای نوین ساخت",
              seoKeywords: "پردیس پویان, پروژه ساختمانی, مسکونی, املاک",
            },
            {
              languageId: enLang.id,
              name: "Pardis Pouyan",
              slug: "pardis-pouyan-en",
              summary:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              specifications:
                "Project Name: Pardis Pouyan\nLocation: Meshkindasht, Alborz Province\nResidential Units: 245 Units\nResidential Blocks: 7 Blocks\nLand Area: 7600 sqm\nCommercial & Service Area: 5000 sqm\nGreen Space: 6500 sqm\nUnit Sizes: 80 to 140 sqm\nUsage: Residential, Commercial, Recreational",
              description:
                "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><h2>Project Overview</h2><p>Modern luxury residential project with state-of-the-art facilities and green architecture.</p>",
              seoTitle: "Pardis Pouyan Project | Pouyan Development",
              seoDescription: "Pardis Pouyan luxury residential project",
              seoKeywords: "Pardis Pouyan, real estate, residential project",
            },
          ],
        },
      },
    });
    console.log("Sample project seeded");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
