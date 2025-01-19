import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

// export async function createSubscription({
//   stripeCustomerId,
// }: {
//   stripeCustomerId: string;
// }) {
//   await db
//     .update(users)
//     .set({
//       subscribed: true,
//     })
//     .where(eq(users.stripeCustomerId, stripeCustomerId));
// }

// export async function deleteSubscription({
//   stripeCustomerId,
// }: {
//   stripeCustomerId: string;
// }) {
//   await db
//     .update(users)
//     .set({
//       subscribed: false,
//     })
//     .where(eq(users.stripeCustomerId, stripeCustomerId));
// }

export async function getUserSubscription() {
	const currentUser = await supabase.auth.getUser();

	if (currentUser.error) throw new Error(currentUser.error.message);

	const user = await db.query.users.findFirst({
		where: eq(users.id, currentUser.data.user?.id),
	});

	return user?.planType;
}
