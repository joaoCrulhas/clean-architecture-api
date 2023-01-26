interface UpdateAccessTokenDTO {
  token: string;
  expireAt: Date;
  id: string;
}
interface UpdateAccessTokenRepository {
  update(args: UpdateAccessTokenDTO): Promise<any>;
}
export { UpdateAccessTokenRepository, UpdateAccessTokenDTO };
