const value = (name: string) => process.env[name] ?? "";

export const ENV = {
  databaseUrl: value("DATABASE_URL"),
  ownerOpenId: value("OWNER_OPEN_ID"),
  forgeApiUrl: value("BUILT_IN_FORGE_API_URL"),
  forgeApiKey: value("BUILT_IN_FORGE_API_KEY"),
};
