import { Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header({ showCreateButton = false }: { showCreateButton?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Cardify</h1>
        </Link>
        {showCreateButton && (
          <Button asChild>
            <Link href="/create">Create New Card</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
