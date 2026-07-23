"use server";

import { db } from "@/server/db";
import { contacts } from "@/server/db/schema";

export async function submitContact(formData: FormData) {
  await db.insert(contacts).values({
    name: String(formData.get("name")),
    email: String(formData.get("email")),
    message: String(formData.get("message")),
  });
}
