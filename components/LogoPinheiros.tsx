"use client";

import Image from "next/image";

type Props = {
  className?: string;
  width?: number;
  height?: number;
  /** Mantido por compatibilidade */
  treeColor?: string;
};

/** Logo: 5 pinheiros em SVG com fundo transparente */
export default function LogoPinheiros({
  className = "",
  width = 120,
  height = 56,
}: Props) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={width}
      height={height}
      className={className}
      aria-hidden
      style={{ objectFit: "contain" }}
      priority
    />
  );
}
