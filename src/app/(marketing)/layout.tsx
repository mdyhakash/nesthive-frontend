import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
