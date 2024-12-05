import { databaseConnection } from '@/shared/databases/drizzle.config';
import { EncryptionRepository } from './encryption.repository';
import {
  DB_TBL_TENANT_SESSION,
  SESSION_INACTIVE,
} from '../drizzle/masterSession.schema';

export class MasterSessionRepository {
  private readonly database = null;
  constructor(
    private readonly master_db_name = process.env.DATABASE_MASTER_NAME,
    private readonly master_db_token = process.env.DATABASE_MASTER_TOKEN,
    private readonly hashEncrypt = new EncryptionRepository(),
  ) {
    this.database = databaseConnection(
      this.master_db_name,
      this.master_db_token,
    );
  }
  public async createInactiveSession(userUUID: string, userAgent: string) {
    const ACCESS_CODE = crypto.randomUUID().slice(0, 6).toUpperCase();
    const TEN_MINUTES = 10 * 60 * 1000; // Why? 1000ms = 1s -> 60s = 1min -> 10min
    await this.database.insert(DB_TBL_TENANT_SESSION).values({
      sessionUUID: crypto.randomUUID(),
      userUUID: userUUID,
      privateServiceKey: crypto.randomUUID(),
      publicClientKey: crypto.randomUUID(),
      accessCode: this.hashEncrypt.encrypt(
        JSON.stringify({
          accessCode: ACCESS_CODE,
          expiration: new Date(Date.now() + TEN_MINUTES).toISOString(),
        }),
      ),
      isActive: SESSION_INACTIVE,
      locationDevice: userAgent,
      createdAt: new Date().toISOString(),
    });

    return {
      ACCESS_CODE,
    };
  }
}
