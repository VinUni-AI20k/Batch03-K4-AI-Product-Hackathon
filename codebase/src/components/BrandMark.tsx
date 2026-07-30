interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "h-9 w-9" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 ${className}`}
    >
      <span
        className="absolute left-0 top-[4%] h-[44%] w-[29%] bg-[#cf202f]"
        style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
      />
      <span
        className="absolute inset-0 bg-[#155493]"
        style={{
          clipPath:
            "polygon(2% 52%, 27% 27%, 50% 50%, 100% 0, 100% 50%, 50% 100%)",
        }}
      />
    </span>
  );
}
