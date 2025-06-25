import Image from "next/image";
import Link from "next/link";

export function Header() {
  const logoUrl = "https://cdn.prod.website-files.com/68521b10d2ddd4340d19900c/68521c1afc95e0d7fae75898_Recurso%202%404x-p-500.png";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-start">
        <Link href="/" className="flex items-center">
          <Image src={logoUrl} alt="Cardify Logo" width={120} height={25} className="object-contain invert dark:invert-0" />
        </Link>
      </div>
    </header>
  );
}
