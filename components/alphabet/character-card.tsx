"use client"

import { cn } from "@/lib/utils"

interface CharacterCardProps {
  char: string;
  romaji: string;
  className?: string;
  onClick?: () => void;
}

export function CharacterCard({ char, romaji, className, onClick }: CharacterCardProps) {
  if (!char) return <div className={cn("aspect-square border-r border-b border-foreground/5 bg-foreground/2", className)} />;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative aspect-square flex flex-col items-center justify-center p-2 border-r border-b border-foreground/10 transition-all hover:bg-primary/5 cursor-pointer",
        className
      )}
    >
      <span className="text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
        {char}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {romaji}
      </span>
      {/* Subtle indicator */}
      <div className="absolute top-1 right-1 w-1 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
