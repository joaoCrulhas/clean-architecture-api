interface LoggerErrorRepository {
  log(stack: string): Promise<void>;
}
export { LoggerErrorRepository };
