import { databaseConnection } from '@/shared/databases/drizzle.config';
import {
  ADMIN_USER,
  DB_TBL_TENANT_USER,
  IMasterUser,
  USER_ACTIVE,
  USER_INACTIVE,
} from '../drizzle/masterUser.schema';
import { and, eq } from 'drizzle-orm';
import { EncryptionRepository } from './encryption.repository';

export class MasterUserRepository {
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
  public async getByEmail(email: string): Promise<IMasterUser[]> {
    const masterUser = await this.database
      .select()
      .from(DB_TBL_TENANT_USER)
      .where(
        and(
          eq(DB_TBL_TENANT_USER.userEmail, email),
          eq(DB_TBL_TENANT_USER.isActive, USER_ACTIVE),
        ),
      );
    return masterUser;
  }

  public async createInactiveUser(email: string): Promise<{
    USER: IMasterUser;
    CODE: string;
  }> {
    const ACCESS_CODE = crypto.randomUUID().slice(0, 6).toUpperCase();
    const TEN_MINUTES = 10 * 60 * 1000; // Why? 1000ms = 1s -> 60s = 1min -> 10min

    const newMasterUser: IMasterUser = {
      userUUID: crypto.randomUUID(),
      tenantUUID: crypto.randomUUID(),
      userEmail: email,
      isActive: USER_INACTIVE,
      userRole: ADMIN_USER,
      accessCode: this.hashEncrypt.encrypt(
        JSON.stringify({
          accessCode: ACCESS_CODE,
          expiration: new Date(Date.now() + TEN_MINUTES).toISOString(),
        }),
      ),
    };

    await this.database.insert(DB_TBL_TENANT_USER).values(newMasterUser);

    return {
      USER: newMasterUser,
      CODE: ACCESS_CODE,
    };
  }

  public async getByEmailInactiveUser(email: string): Promise<IMasterUser[]> {
    const masterUser = await this.database
      .select()
      .from(DB_TBL_TENANT_USER)
      .where(
        and(
          eq(DB_TBL_TENANT_USER.userEmail, email),
          eq(DB_TBL_TENANT_USER.isActive, USER_INACTIVE),
        ),
      );
    return masterUser;
  }

  public async activeUser(userUUID: string) {
    await this.database
      .update(DB_TBL_TENANT_USER)
      .set({ isActive: USER_ACTIVE })
      .where(eq(DB_TBL_TENANT_USER.userUUID, userUUID));
  }
}
