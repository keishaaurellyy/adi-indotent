"use server";

import { db } from "@/db";
import { contacts } from "@/db/schema";

export async function submitContact(formData: FormData) {
  await db.insert(contacts).values({
    name: String(formData.get("name")),
    email: String(formData.get("email")),
    message: String(formData.get("message")),
  });
}
