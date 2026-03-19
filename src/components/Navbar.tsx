import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg hover:opacity-70 transition-opacity">
          Portfolio
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/prosjekter" className="hover:opacity-70 transition-opacity">
            Prosjekter
          </Link>
          <Link href="/om-meg" className="hover:opacity-70 transition-opacity">
            Om meg
          </Link>
        </div>
      </div>
    </nav>
  );
}
