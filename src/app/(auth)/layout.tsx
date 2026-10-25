import { BrandPanel } from "@/components/auth/brand-panel";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
      <BrandPanel />
      <div className="flex min-w-0 flex-col">
        <header className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="lg:invisible">
            <Logo />
          </div>
          <ThemeToggle />
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
