import { FirstMate } from "@/components/FirstMate";
import { SHIPS } from "@/content/ships";

export default function Home() {
  return (
    <main className="flex-1">
      <FirstMate ships={SHIPS} />
    </main>
  );
}
