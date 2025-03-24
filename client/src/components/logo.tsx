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
      {/* Stem */}
      <rect x="48" y="45" width="4" height="40" fill="#2E7D32" />
      
      {/* Left Leaf */}
      <path 
        d="M30 30C30 30 35 40 48 45C48 45 45 25 30 30Z" 
        fill="#4CAF50" 
      />
      
      {/* Right Leaf */}
      <path 
        d="M70 30C70 30 65 40 52 45C52 45 55 25 70 30Z" 
        fill="#4CAF50" 
      />
      
      {/* Small Left Leaf */}
      <path 
        d="M35 42C35 42 40 45 48 45C48 45 45 35 35 42Z" 
        fill="#66BB6A" 
      />
      
      {/* Small Right Leaf */}
      <path 
        d="M65 42C65 42 60 45 52 45C52 45 55 35 65 42Z" 
        fill="#66BB6A" 
      />
    </svg>
  );
}

export function LogoWithText({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Logo size={size} />
      <div className="flex flex-col">
        <span className={cn("ml-2 font-bold", {
          "text-xl": size === "sm",
          "text-2xl": size === "md",
          "text-3xl": size === "lg",
        })}>Cultivate</span>
        <span className={cn("ml-2 text-xs text-neutral-400", {
          "text-xs": size === "sm" || size === "md",
          "text-sm": size === "lg",
        })}>Excellence as the standard</span>
      </div>
    </div>
  );
}