"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SVGProps } from "react";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
  svgIcon?: React.ComponentType<SVGProps<SVGSVGElement>>; // Optional inline SVG
};

export const SideBarItem = ({ href, iconSrc, svgIcon: SvgIcon, label }: Props) => {
  const path = usePathname();
  const active = path === href;

  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={href}>
        <div className="flex items-center">
          {SvgIcon ? (
            <SvgIcon className="mr-5 w-8 h-8 text-muted-foreground" />
          ) : (
            <Image
              src={iconSrc}
              alt={label}
              className="mr-5"
              height={32}
              width={32}
            />
          )}
          <span className="hidden lg:block">{label}</span>
        </div>
      </Link>
    </Button>
  );
};
