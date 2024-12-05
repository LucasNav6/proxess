import { databaseConnection } from '@/shared/databases/drizzle.config';
import {
  EncryptionRepository,
  RSAEncryptionRepository,
} from './encryption.repository';
import {
  DB_TBL_TENANT_SESSION,
  SESSION_ACTIVE,
  SESSION_INACTIVE,
} from '../drizzle/masterSession.schema';
import { and, eq } from 'drizzle-orm';

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

  public async getInactiveSession(userUUID: string) {
    const sessions = await this.database
      .select()
      .from(DB_TBL_TENANT_SESSION)
      .where(eq(DB_TBL_TENANT_SESSION.userUUID, userUUID))
      .where(eq(DB_TBL_TENANT_SESSION.isActive, SESSION_INACTIVE));

    return sessions;
  }

  public async activeSession(sessionUUID: string) {
    await this.database
      .update(DB_TBL_TENANT_SESSION)
      .set({ isActive: 1 })
      .where(eq(DB_TBL_TENANT_SESSION.sessionUUID, sessionUUID));
  }

  public async assignRSASessionKeys(sessionUUID: string) {
    const rsa = new RSAEncryptionRepository();
    const KEY_PAIR = rsa.generateAndGetKeys();
    console.log(KEY_PAIR);
    this.database
      .update(DB_TBL_TENANT_SESSION)
      .set({ privateServiceKey: this.hashEncrypt.encrypt(KEY_PAIR.privateKey) })
      .where(
        and(
          eq(DB_TBL_TENANT_SESSION.sessionUUID, sessionUUID),
          eq(DB_TBL_TENANT_SESSION.isActive, SESSION_ACTIVE),
        ),
      );

    return {
      publicServiceKey: KEY_PAIR.publicKey,
    };
  }
}
