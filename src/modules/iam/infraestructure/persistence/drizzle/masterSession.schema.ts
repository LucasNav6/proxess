import * as s from 'drizzle-orm/sqlite-core';

export interface IMasterSession {
  sessionUUID: string;
  userUUID: string;
  privateServiceKey: string;
  publicClientKey: string;
  accessCode: string;
  isActive: number;
  locationDevice: string;
  createdAt: string;
}

export const SESSION_ACTIVE = 1;
export const SESSION_INACTIVE = 0;

export const DB_TBL_TENANT_SESSION = s.sqliteTable('tbl_tenant_users', {
  sessionUUID: s.text('session_uuid').primaryKey(),
  userUUID: s.text('user_uuid').notNull().unique(),
  privateServiceKey: s.text('private_key').notNull().unique(),
  publicClientKey: s.text('public_client_key').notNull().unique(),
  accessCode: s.text('access_code').notNull(),
  isActive: s.integer('activated').notNull(),
  locationDevice: s.text('location_device').notNull(),
  createdAt: s.text('create_time').notNull(),
});
