import Link from "next/link";
import { BackButton } from "@/components/shared/back-button";

type StubLink = { href: string; label: string };

type StubScreenProps = {
  title: string;
  backHref?: string;
  body?: string;
  links?: StubLink[];
  note: string;
};

export function StubScreen({
  title,
  backHref,
  body,
  links = [],
  note,
}: StubScreenProps) {
  return (
    <div className="flex flex-col px-5 py-6">
      {backHref ? (
        <div className="mb-3">
          <BackButton href={backHref} />
        </div>
      ) : null}

      <h1 className="text-2xl font-bold leading-snug text-olive-dark">
        {title}
      </h1>

      {body ? <p className="mt-3 text-text">{body}</p> : null}

      {links.length > 0 ? (
        <nav className="mt-6 flex flex-col items-start gap-3">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-olive underline underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <p className="mt-16 text-xs text-text-muted">{note}</p>
    </div>
  );
}
