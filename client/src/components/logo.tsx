import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <svg 
      className={cn(sizeClasses[size], className)} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="45" y="40" width="10" height="60" fill="currentColor" />
      <path d="M38 35C38 40 45 40 50 30C55 40 62 40 62 35C62 20 50 15 50 15C50 15 38 20 38 35Z" fill="currentColor" />
      <path d="M38 35C38 30 45 30 50 20C55 30 62 30 62 35C62 50 50 45 50 45C50 45 38 50 38 35Z" fill="currentColor" className="text-primary-200" />
    </svg>
  );
}

export function LogoWithText({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Logo size={size} />
      <span className={cn("ml-2 font-bold", {
        "text-xl": size === "sm",
        "text-2xl": size === "md",
        "text-3xl": size === "lg",
      })}>Cultivate</span>
    </div>
  );
}