import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

const YOUTUBE_IDS = [
  "dQw4w9WgXcQ",
  "jNQXAC9IVRw",
  "9bZkp7q19f0",
  "M7lc1UVf-VE",
  "ZXsQAXx_ao0",
];

type CourseSeed = {
  slug: string;
  title: string;
  language: string;
  description: string;
  moduleTitles: string[];
};

const courses: CourseSeed[] = [
  {
    slug: "java-fundamentals",
    title: "Curso de Java",
    language: "Java",
    description:
      "Aprenda os fundamentos da linguagem Java: sintaxe, orientação a objetos, coleções e boas práticas.",
    moduleTitles: [
      "Introdução ao Java",
      "Orientação a Objetos",
      "Coleções e Generics",
      "Tratamento de Exceções",
    ],
  },
  {
    slug: "cpp-fundamentals",
    title: "Curso de C++",
    language: "C++",
    description:
      "Domine C++ do zero: ponteiros, memória, STL e programação orientada a objetos.",
    moduleTitles: [
      "Introdução ao C++",
      "Ponteiros e Referências",
      "STL na Prática",
      "Orientação a Objetos em C++",
    ],
  },
  {
    slug: "python-fundamentals",
    title: "Curso de Python",
    language: "Python",
    description:
      "Fundamentos de Python para automação, scripts e desenvolvimento web.",
    moduleTitles: [
      "Introdução ao Python",
      "Estruturas de Dados",
      "Funções e Módulos",
      "Programação Orientada a Objetos",
    ],
  },
  {
    slug: "javascript-fundamentals",
    title: "Curso de JavaScript",
    language: "JavaScript",
    description:
      "Da sintaxe básica ao assíncrono: tudo que você precisa para começar com JavaScript.",
    moduleTitles: [
      "Introdução ao JavaScript",
      "Funções e Escopo",
      "Assincronismo e Promises",
    ],
  },
  {
    slug: "sql-fundamentals",
    title: "Curso de SQL",
    language: "SQL",
    description:
      "Aprenda a consultar e modelar bancos de dados relacionais com SQL.",
    moduleTitles: [
      "Introdução ao SQL",
      "Joins e Subqueries",
      "Modelagem de Dados",
    ],
  },
];

async function main() {
  for (const course of courses) {
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        language: course.language,
        description: course.description,
      },
      create: {
        slug: course.slug,
        title: course.title,
        language: course.language,
        description: course.description,
      },
    });

    for (const [index, title] of course.moduleTitles.entries()) {
      const order = index + 1;
      await prisma.module.upsert({
        where: { courseId_order: { courseId: createdCourse.id, order } },
        update: {
          title,
          youtubeId: YOUTUBE_IDS[index % YOUTUBE_IDS.length],
        },
        create: {
          courseId: createdCourse.id,
          title,
          order,
          youtubeId: YOUTUBE_IDS[index % YOUTUBE_IDS.length],
        },
      });
    }
  }

  const demoEmail = "demo@example.com";
  const demoPasswordHash = await hashPassword("Password123!");
  await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      name: "Usuário Demo",
      email: demoEmail,
      passwordHash: demoPasswordHash,
    },
  });

  console.log("Seed concluído.");
  console.log(`Usuário demo: ${demoEmail} / Password123!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
