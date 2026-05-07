import Link from "next/link";

export function TopNav() {
  return (
    <header
      data-app-header
      className="sticky top-0 z-40 border-b border-ink bg-paper/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Bizroast - accueil"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center border border-ink bg-ink text-xs font-bold tracking-widest text-paper transition-colors group-hover:bg-gold group-hover:text-ink"
          >
            BR
          </span>
          <span className="text-sm font-bold uppercase tracking-normal text-ink">
            Bizroast
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 sm:gap-8">
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
