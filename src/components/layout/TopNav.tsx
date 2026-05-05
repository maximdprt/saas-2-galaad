import Link from "next/link";

export function TopNav() {
  return (
    <header
      data-app-header
      className="sticky top-0 z-40 border-b border-sand bg-paper/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-14">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Bizroast — accueil"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center border border-sand bg-shell text-xs font-bold tracking-widest text-ink transition-colors group-hover:bg-ink group-hover:text-paper"
          >
            BR
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">
            Bizroast
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-8">
          <Link
            href="/"
            className="label-uppercase text-muted transition-colors hover:text-ink"
          >
            Analyser
          </Link>
          <Link
            href="/history"
            className="label-uppercase text-muted transition-colors hover:text-ink"
          >
            Historique
          </Link>
        </nav>
      </div>
    </header>
  );
}
