import * as React from "react";
import type { SVGProps } from "react";

const CloseIcon = ({
  className,
  width = 18,
  height = 18,
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width={width}
      height={height}
      aria-hidden="true"
      fill="none"
    >
      <g fill="currentColor" fillRule="nonzero">
        <path d="M29.673.327a1.116 1.116 0 010 1.578L16.58 15l13.094 13.095a1.116 1.116 0 11-1.578 1.578L15 16.58 1.905 29.673a1.116 1.116 0 01-1.578-1.578L13.42 15 .327 1.905A1.116 1.116 0 011.905.327L15 13.42 28.095.327a1.116 1.116 0 011.578 0z" />
      </g>
    </svg>
  );
};

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
  size?: number;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClose,
  className = "",
  size = 18,
}) => {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`
          inline-flex items-center justify-center
          p-2 rounded-full 
          bg-white/0 hover:bg-red-600/40
          focus:outline-none focus:ring-4 focus:ring-red-300
          transition-colors
          ${className}
        `}
      >
        <CloseIcon width={size} height={size} />
      </button>
    </div>
  );
};
