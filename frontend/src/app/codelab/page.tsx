import { CodelabBrowser } from "@/components/codelab-browser";
import { SiteHeader } from "@/components/site-header";
import { days } from "@/data/codelabs";

export default function CodelabsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-260 px-6 py-10 pb-24">
        <CodelabBrowser days={days} />
      </main>
    </>
  );
}
