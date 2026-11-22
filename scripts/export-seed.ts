import { getSeedPayload } from "../src/lib/seed/content-data";

/**
 * Prints the seed as JSON. The content sync workflow copies this file into a
 * checkout of the previous commit and runs it there, to get the baseline for
 * the drift check (`content:sync --baseline=FILE`).
 */
process.stdout.write(JSON.stringify(getSeedPayload()));
