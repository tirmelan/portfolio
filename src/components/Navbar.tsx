"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-lys-bla px-4 md:px-[60px] py-4 md:py-[39px]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Meland design logo" width={62} height={62} loading="eager" />
          <span className="hidden md:inline font-semibold text-[19px] text-bla">
            Meland design
          </span>
        </Link>
        <div className="flex items-center gap-[4px] md:gap-[8px]">
          {pathname !== "/" && (
            <Link
              href="/"
              className="text-bla text-[15px] md:text-[18px] px-[10px] md:px-[15px] py-[6px] md:py-[8px] rounded-full hover:bg-gul transition-colors"
            >
              Prosjekter
            </Link>
          )}
          <Link
            href="/om-meg"
            className="text-bla text-[15px] md:text-[18px] px-[10px] md:px-[15px] py-[6px] md:py-[8px] rounded-full hover:bg-rosa transition-colors"
          >
            Om meg
          </Link>
          <Link
            href="/kontakt"
            className="bg-mellombla text-bla text-[15px] md:text-[18px] px-[10px] md:px-[15px] py-[6px] md:py-[8px] rounded-full hover:bg-bla hover:text-lys-bla transition-colors ml-[8px] md:ml-[16px]"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </nav>
  );
}
