import type { ReplacementRule } from "./types";

export function processHp001Text(
  text: string,
  rules: ReplacementRule[] | null
): string {
  if (!rules || rules.length === 0) return text;

  let result = ` ${text} `;
  for (const [from, to] of rules) {
    result = result.replaceAll(from, to);
  }
  return result.trim();
}
