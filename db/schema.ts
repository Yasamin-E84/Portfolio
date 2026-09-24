import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    locale: text("locale", { enum: ["en", "fa"] }).notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("contact_created_idx").on(table.createdAt)],
);

export const contactRateEvents = sqliteTable(
  "contact_rate_events",
  {
    id: text("id").primaryKey(),
    rateKey: text("rate_key").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("contact_rate_key_time_idx").on(table.rateKey, table.createdAt),
    index("contact_rate_time_idx").on(table.createdAt),
  ],
);

export const analyticsDaily = sqliteTable(
  "analytics_daily",
  {
    day: text("day").notNull(),
    path: text("path").notNull(),
    locale: text("locale", { enum: ["en", "fa"] }).notNull(),
    views: integer("views").notNull().default(0),
    minuteStart: integer("minute_start").notNull(),
    minuteViews: integer("minute_views").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.day, table.path, table.locale] })],
);
