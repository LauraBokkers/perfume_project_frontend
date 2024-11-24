import type { SVGProps } from "react";

const CloseIcon = ({ height, width, ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            width={width ?? "30"}
            height={height ?? "30"}
        >
            <g fill={props.fill ?? "#666"} fillRule="nonzero">
                <path d="M29.673.327a1.116 1.116 0 010 1.578L16.58 15l13.094 13.095a1.116 1.116 0 11-1.578 1.578L15 16.58 1.905 29.673a1.116 1.116 0 01-1.578-1.578L13.42 15 .327 1.905A1.116 1.116 0 011.905.327L15 13.42 28.095.327a1.116 1.116 0 011.578 0z" />
            </g>
        </svg>
    );
};

export default CloseIcon;