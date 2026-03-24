import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-lys-blå px-[60px] py-[39px]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Meland design logo" width={62} height={62} />
          <span className="font-semibold text-[19px] text-blå">
            Meland design
          </span>
        </Link>
        <div className="flex items-center gap-[25px]">
          <Link
            href="/prosjekter"
            className="bg-mellomblå text-blå text-[20px] px-[15px] py-[3px] rounded-full hover:opacity-80 transition-opacity"
          >
            Prosjekter
          </Link>
          <Link
            href="/om-meg"
            className="text-blå text-[20px] px-[15px] py-[3px] rounded-full hover:bg-mellomblå/30 transition-colors"
          >
            Om meg
          </Link>
          <Link
            href="/cv"
            className="text-blå text-[20px] px-[15px] py-[3px] rounded-full hover:bg-mellomblå/30 transition-colors"
          >
            CV
          </Link>
        </div>
      </div>
    </nav>
  );
}
