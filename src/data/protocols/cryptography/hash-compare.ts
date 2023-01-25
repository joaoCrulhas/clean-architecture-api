interface HashCompare {
  compare(value: string, hashedValue: string): Promise<boolean>;
}
export { HashCompare };
