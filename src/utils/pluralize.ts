/** "1 turn", "2 turns"; pass the plural for irregular nouns ("1 mouse", "3 mice") */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
