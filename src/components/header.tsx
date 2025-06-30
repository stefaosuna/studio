
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const logoUrl = "https://storage.googleapis.com/studioprod-53303.appspot.com/667c4f803c73797669b7c844/667c4f803c73797669b7c844_9f5c4046-5e55-46f5-b384-9199a57173e4.png";
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
