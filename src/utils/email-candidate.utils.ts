export function emailCandidate(email: string) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
