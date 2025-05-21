"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="my-8 flex justify-center items-center">
      <Link
        href="/"
        className={pathname === "/" ? "font-bold mr-4" : "mr-4 text-blue-500"}
      >
        Home
      </Link>
      <Link
        href="/secondView"
        className={
          pathname === "/secondView" ? "font-bold mr-4" : "mr-4 text-blue-500"
        }
      >
        Second View
      </Link>
      <Link
        href="/thirdView"
        className={
          pathname === "/thirdView" ? "font-bold mr-4" : "mr-4 text-blue-500"
        }
      >
        Third View
      </Link>
    </nav>
  );
}
