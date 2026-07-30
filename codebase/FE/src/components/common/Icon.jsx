export function Icon({ children, className = "" }) {
  return (
    <span className={`material-symbols-rounded select-none ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}
