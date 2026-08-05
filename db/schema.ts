import { pgTable, text, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table (Admin authentication & tenant identification)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin_mempelai"), // "superadmin" | "admin_mempelai"
  weddingSlug: text("wedding_slug").unique(), // Unique URL identifier e.g. "ahmad-nabila"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Guests Table
export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  phone: text("phone"),
  category: text("category").notNull().default("Lainnya"), // Keluarga, Teman, Kampus, Organisasi, Rekan Kerja, Lainnya
  invitationStatus: text("invitation_status").notNull().default("unopened"), // unopened, opened
  openedAt: timestamp("opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. RSVPs Table
export const rsvps = pgTable("rsvps", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: uuid("guest_id").notNull().unique().references(() => guests.id, { onDelete: "cascade" }),
  attendanceStatus: text("attendance_status").notNull(), // attending, declined
  guestCount: integer("guest_count").notNull().default(1),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Wedding Settings Table
export const weddingSettings = pgTable("wedding_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  
  // Groom Info
  groomName: text("groom_name").notNull(),
  groomFullName: text("groom_full_name").notNull(),
  groomFather: text("groom_father").notNull(),
  groomMother: text("groom_mother").notNull(),
  groomInstagram: text("groom_instagram"),
  groomPhotoUrl: text("groom_photo_url"),

  // Bride Info
  brideName: text("bride_name").notNull(),
  brideFullName: text("bride_full_name").notNull(),
  brideFather: text("bride_father").notNull(),
  brideMother: text("bride_mother").notNull(),
  brideInstagram: text("bride_instagram"),
  bridePhotoUrl: text("bride_photo_url"),

  // Wedding General Info
  weddingDate: text("wedding_date").notNull(), // e.g. "2026-12-20"
  heroPhotoUrl: text("hero_photo_url"),
  musicUrl: text("music_url"),
  quoteText: text("quote_text"),
  
  // Gift & Physical Gift Destination Info
  giftRecipient: text("gift_recipient"),
  giftPhone: text("gift_phone"),
  giftAddress: text("gift_address"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Events Table (Akad Nikah, Resepsi)
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // akad, reception
  title: text("title").notNull(),
  date: text("date").notNull(), // e.g. "Minggu, 20 Desember 2026"
  startTime: text("start_time").notNull(), // e.g. "08.00"
  endTime: text("end_time").notNull(), // e.g. "10.00 WIB"
  venueName: text("venue_name").notNull(),
  venueAddress: text("venue_address").notNull(),
  mapsUrl: text("maps_url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Bank Accounts Table
export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  bankName: text("bank_name").notNull(), // e.g. BCA, Mandiri, QRIS
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Love Stories Table
export const loveStories = pgTable("love_stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  year: text("year").notNull(), // e.g. "2021"
  title: text("title").notNull(),
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Gallery Table
export const gallery = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const guestsRelations = relations(guests, ({ one }) => ({
  rsvp: one(rsvps, {
    fields: [guests.id],
    references: [rsvps.guestId],
  }),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  guest: one(guests, {
    fields: [rsvps.guestId],
    references: [guests.id],
  }),
}));
