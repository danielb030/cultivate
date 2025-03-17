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
      <path d="M30 35C30 25 45 15 50 15C55 15 70 25 70 35C70 45 55 40 50 40C45 40 30 45 30 35Z" fill="currentColor" />
      <path d="M30 35C30 45 45 35 50 35C55 35 70 45 70 35C70 25 55 30 50 30C45 30 30 25 30 35Z" fill="currentColor" className="text-primary-200" />
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