import logoSrc from "@/assets/logo-pynmotools.png";

interface PynmoLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: "h-7 w-7", text: "text-sm", logo: "h-7" },
  md: { icon: "h-9 w-9", text: "text-lg", logo: "h-9" },
  lg: { icon: "h-10 w-10", text: "text-xl", logo: "h-10" },
};

const PynmoLogo = ({ size = "md", showText = true, className = "" }: PynmoLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoSrc} alt="Pynmotools" className={`${s.logo} w-auto object-contain`} />
      {showText && (
        <span className={`${s.text} font-bold tracking-tight`}>
          <span className="text-foreground">Pynmo</span>
          <span className="text-primary">tools</span>
        </span>
      )}
    </div>
  );
};

export default PynmoLogo;
