import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// NOTE: placeholder schema — you mentioned this isn't final yet.
// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Company services / offerings (rendered on the site)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});
