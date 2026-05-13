import Module from "node:module";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function resolveAlias(request: string, parent: unknown, isMain: boolean, options: unknown) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(this, join(process.cwd(), request.slice(2)), parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const { seedQuestions } = require("./seedQuestions");
const { seedSpecialties } = require("./seedSpecialties");
const { seedTraits } = require("./seedTraits");
const { MOCK_RESULTS, MOCK_USERS } = require("@/data/mock");

const outputDir = join(process.cwd(), "data", "seeds");

writeFileSync(join(outputDir, "traits.json"), `${JSON.stringify(seedTraits, null, 2)}\n`);
writeFileSync(join(outputDir, "questions.json"), `${JSON.stringify(seedQuestions, null, 2)}\n`);
writeFileSync(join(outputDir, "specialties.json"), `${JSON.stringify(seedSpecialties, null, 2)}\n`);
writeFileSync(join(outputDir, "mock-users.json"), `${JSON.stringify(MOCK_USERS, null, 2)}\n`);
writeFileSync(join(outputDir, "mock-results.json"), `${JSON.stringify(MOCK_RESULTS, null, 2)}\n`);

console.log("Generated JSON seed files in data/seeds");
