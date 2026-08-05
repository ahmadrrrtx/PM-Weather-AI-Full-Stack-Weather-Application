import { AuroraBackground } from "@/components/layout/aurora-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MissionControl } from "@/components/dashboard";
import { LocationSearch } from "@/components/search/location-search";
import { UnitToggle } from "@/components/unit-toggle";

/* ─────────────────────────────
   Home page.
   ───────────────────────────── */

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />

      <Header>
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="w-full max-w-sm sm:w-auto sm:min-w-[280px]">
            <LocationSearch />
          </div>
          <UnitToggle />
        </div>
      </Header>

      <main id="main" className="relative z-10">
        <MissionControl />
      </main>

      <Footer />
    </div>
  );
}
