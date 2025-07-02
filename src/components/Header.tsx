import { Book, Moon, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-b backdrop-blur">
      <div className="flex h-[63px] items-center justify-between gap-3 px-[36px]">
        <a href="/">
          <div className="flex cursor-pointer items-center justify-center gap-2">
            <Book size={27} />
            <p className="font-bold">MyVocab</p>
          </div>
        </a>
        <nav className="flex items-center justify-center gap-3">
          <a href="/">
            <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
              <Search />
              <p>Browse</p>
            </Button>
          </a>
          <a href="/add">
            <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
              <Plus />
              <p>Add</p>
            </Button>
          </a>
          <a href="/categories">
            <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
              <p>Categories</p>
            </Button>
          </a>
          <a href="/profile">
            <Button variant="ghost" className="flex cursor-pointer items-center justify-center gap-3">
              <User />
              <p>Profile</p>
            </Button>
          </a>
          <Button variant="ghost" className="cursor-pointer">
            <Moon />
          </Button>
        </nav>
      </div>
    </header>
  );
}
