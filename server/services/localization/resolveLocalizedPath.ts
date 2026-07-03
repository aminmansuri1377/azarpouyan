type ResolveParams = {
  prisma: any;

  translationModel: any;

  entityIdField: string;

  slug: string;

  currentLocale: string;

  targetLocale: string;
};

export async function resolveLocalizedSlug({
  translationModel,
  entityIdField,
  slug,
  currentLocale,
  targetLocale,
}: ResolveParams) {
  const currentTranslation = await translationModel.findFirst({
    where: {
      slug,

      language: {
        code: currentLocale,
      },
    },
  });

  if (!currentTranslation) {
    return null;
  }

  const entityId =
    currentTranslation[entityIdField as keyof typeof currentTranslation];

  const targetTranslation = await translationModel.findFirst({
    where: {
      [entityIdField]: entityId,

      language: {
        code: targetLocale,
      },
    },
  });

  if (!targetTranslation) {
    return null;
  }

  return targetTranslation;
}
