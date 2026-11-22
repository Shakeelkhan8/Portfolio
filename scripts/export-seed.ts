import { getSeedPayload } from "../src/lib/seed/content-data";
import { seedJson } from "./seed-json";

/**
 * Prints the seed as JSON. The content sync workflow copies this file and
 * seed-json.ts into checkouts of recent commits and runs them there, to get
 * the versions for the drift check (`content:sync --baseline=FILE ...`).
 */
process.stdout.write(seedJson(getSeedPayload()));
