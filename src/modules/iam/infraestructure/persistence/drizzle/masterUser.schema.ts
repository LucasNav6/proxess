import * as s from 'drizzle-orm/sqlite-core';

export interface IMasterUser {
  userUUID: string;
  tenantUUID: string;
  userEmail: string;
  isActive: number;
  accessCode: string;
  userRole: number;
}

export const USER_ACTIVE = 1;
export const USER_INACTIVE = 0;
export const ADMIN_USER = 0;

export const DB_TBL_TENANT_USER = s.sqliteTable('tbl_tenant_users', {
  userUUID: s.text('user_uuid').primaryKey(),
  tenantUUID: s.text('tenant_uuid').notNull().unique(),
  userEmail: s.text('admin_user').notNull().unique(),
  isActive: s.integer('active_bit').notNull(),
  accessCode: s.text('access_code').notNull(),
  userRole: s.integer('role').notNull(),
});
