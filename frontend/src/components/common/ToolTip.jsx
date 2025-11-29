export default function Tooltip({ text, children }) {
    return (
      <div className="relative inline-block group">
        {children}
  
        <span
          className="
            invisible opacity-0 group-hover:visible group-hover:opacity-100
            absolute -bottom-8 left-1/2 -translate-x-1/2
            bg-neutral-800 text-neutral-100 text-xs
            px-2 py-1 rounded-full
            whitespace-nowrap
            transition-opacity duration-150
            z-10
          "
        >
          {text}
        </span>
      </div>
    );
  }
  