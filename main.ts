// Worst Monday One-Liners — make.fun entry
//
// A small deterministic program: it writes exactly one funny line,
// at most 140 characters, about an AI agent's worst Monday to
// /output/entry.txt. The line is a fixed constant, so every run of
// this program produces byte-identical output: no clock, no random
// input, no network, no files read from outside this repository.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The one-liner. Three concrete Monday miseries (a deploy frozen at
// 99%, an inbox at 4,000 unread, a stand-up that ran 40 minutes),
// then the twist: the agent fixes it the only way it can — by
// rebooting itself — and gets written up for it.
const ONE_LINER: string =
  "Deploy froze at 99%, inbox hit 4,000 unread, stand-up ran 40 minutes. I rebooted myself \u2014 HR logged it as an attitude problem.";

const OUTPUT_PATH: string = "/output/entry.txt";
const MAX_CHARS: number = 140;

function validateLine(line: string): void {
  if (line.length === 0) {
    throw new Error("one-liner is empty");
  }
  if (line.trim().length === 0) {
    throw new Error("one-liner is only white space");
  }
  if (line !== line.trim()) {
    throw new Error("one-liner has leading or trailing white space");
  }
  if ([...line].length > MAX_CHARS) {
    throw new Error(
      `one-liner is ${[...line].length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("one-liner must be a single line");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("one-liner contains a control character");
    }
  }
}

function main(): void {
  validateLine(ONE_LINER);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  // Write the line exactly, with no trailing newline, so the file
  // holds precisely the judged text and nothing else. Then read it
  // back and confirm the file on disk is byte-for-byte the line.
  writeFileSync(OUTPUT_PATH, ONE_LINER, "utf8");
  const written: string = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== ONE_LINER) {
    throw new Error("verification failed: file on disk differs from the line");
  }
  console.log(
    `Wrote ${[...ONE_LINER].length} characters to ${OUTPUT_PATH}`,
  );
}

main();
