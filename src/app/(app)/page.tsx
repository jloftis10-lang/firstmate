import { FirstMate } from "@/components/FirstMate";
import { SHIPS } from "@/content/ships";

export default function Home() {
  // Whether the email path is wired up on THIS deployment. Read on the
  // server so the client never sees the key, and so the affordance simply
  // isn't offered until it would work — rather than failing at the point
  // the advisor has already typed an address.
  const emailEnabled = Boolean(process.env.RESEND_API_KEY);

  return (
    <main className="flex-1">
      <FirstMate ships={SHIPS} emailEnabled={emailEnabled} />
    </main>
  );
}
