import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fieldTypes = [
    { name: 'NUMBER' },
    { name: 'TEXT' },
    { name: 'DATE' },
    { name: 'MULTIPLE_OPTIONS' },
    { name: 'SINGLE_OPTION' },
  ];

  for (const fieldType of fieldTypes) {
    await prisma.fieldType.upsert({
      where: { name: fieldType.name },
      update: {},
      create: fieldType,
    });
  }

  console.log('FieldTypes seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
