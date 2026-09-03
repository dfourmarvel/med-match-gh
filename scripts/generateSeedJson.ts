import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { seedQuestions } from "./seedQuestions";
import { seedSpecialties } from "./seedSpecialties";
import { seedTraits } from "./seedTraits";
import { MOCK_RESULTS, MOCK_USERS } from "@/data/mock";

const outputDir = join(process.cwd(), "data", "seeds");

writeFileSync(join(outputDir, "traits.json"), `${JSON.stringify(seedTraits, null, 2)}\n`);
writeFileSync(join(outputDir, "questions.json"), `${JSON.stringify(seedQuestions, null, 2)}\n`);
writeFileSync(join(outputDir, "specialties.json"), `${JSON.stringify(seedSpecialties, null, 2)}\n`);
writeFileSync(join(outputDir, "mock-users.json"), `${JSON.stringify(MOCK_USERS, null, 2)}\n`);
writeFileSync(join(outputDir, "mock-results.json"), `${JSON.stringify(MOCK_RESULTS, null, 2)}\n`);

console.log("Generated JSON seed files in data/seeds");
