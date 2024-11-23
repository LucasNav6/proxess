import { createClient } from '@tursodatabase/api';

const tursoConfig = createClient({
  org: process.env.TURSO_API_ORG,
  token: process.env.TURSO_API_TOKEN,
});

export class TursoDatabase {
  public async createDatabase(tenantUUID: string) {
    const tursoRes = await tursoConfig.databases.create(tenantUUID, {
      group: process.env.TURSO_API_GROUP,
    });

    return tursoRes;
  }

  public async createTemporaryToken(tenantUUID: string) {
    const token = await tursoConfig.databases.createToken(tenantUUID, {
      expiration: '1d',
      authorization: 'full-access',
    });

    return token.jwt;
  }

  public async revokeTemporaryToken(token: string) {
    await tursoConfig.databases.rotateTokens(token);
  }
}
