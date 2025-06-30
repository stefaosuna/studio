
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const logoUrl = "https://drive.google.com/uc?export=view&id=1-8OTlmJXFZdgOjuHu4vYMqPIw5BDRsRM";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-start">
        <Link href="/" className="flex items-center">
          <Image src={logoUrl} alt="Cardify Logo" width={120} height={25} className="object-contain" />
        </Link>
      </div>
    </header>
  );
}
