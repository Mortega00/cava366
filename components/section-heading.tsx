import Link from "next/link";

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: { href: string; label: string } }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <Link className="text-link" href={action.href}>{action.label} <span aria-hidden="true">→</span></Link>}</div>;
}
