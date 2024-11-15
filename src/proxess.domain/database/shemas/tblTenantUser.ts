import { object, string } from 'yup';
import * as s from 'drizzle-orm/sqlite-core';

export const SCHEMA_TBL_TENANT_USER = object({
  email: string()
    .email('The email is not valid')
    .required('The email is required'),
});

export const DB_TBL_TENANT_USER = s.sqliteTable('tbl_tenant_users', {
  userUUID: s.text('user_uuid').primaryKey(),
  tenantUUID: s.text('tenant_uuid').notNull().unique(),
  adminUser: s.text('admin_user').notNull().unique(),
  active: s.integer('active_bit').notNull(),
  accessCode: s.text('access_code').notNull(),
});

export const USER_ACTIVE = 1;
export const USER_INACTIVE = 0;

export interface ITblTenantUser {
  userUUID: string;
  tenantUUID: string;
  adminUser: string;
  active: number;
  accessCode: string;
}
