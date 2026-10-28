export interface Pronouns {
  subject: string;
  object: string;
  possessive: string;
}

/** Third-person pronouns for an animal: "she / her / her" or "he / him / his" */
export function pronounsFor(sex: 'male' | 'female'): Pronouns {
  return sex === 'female'
    ? { subject: 'she', object: 'her', possessive: 'her' }
    : { subject: 'he', object: 'him', possessive: 'his' };
}
