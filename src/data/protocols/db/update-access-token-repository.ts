interface UpdateAccessTokenDTO {
  token: string;
  expireAt: Date;
  id: string;
}
interface UpdateAccessTokenRepository {
  update(args: UpdateAccessTokenDTO): Promise<void>;
}
export { UpdateAccessTokenRepository, UpdateAccessTokenDTO };
