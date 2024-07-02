import { SVGProps } from "react";

const CallEndIcon = ({ width = "10" }: SVGProps<SVGSVGElement>) => {
  return (
    <svg 
    // height="11px" 
    version="1.1" viewBox="0 0 24 11" width={width}>
      <title />
      <desc />
      <defs />
      <g
        fill="none"
        fill-rule="evenodd"
        id="Page-1"
        stroke="none"
        stroke-width="1"
      >
        <g
          fill="#fff"
          id="Icons-Communication"
          transform="translate(-40.000000, -4.000000)"
        >
          <g id="call-end" transform="translate(40.000000, 4.500000)">
            <path
              d="M12,2 C10.4,2 8.9,2.3 7.4,2.7 L7.4,5.8 C7.4,6.2 7.2,6.5 6.8,6.7 C5.8,7.2 4.9,7.8 4.1,8.6 C3.9,8.8 3.7,8.9 3.4,8.9 C3.1,8.9 2.9,8.8 2.7,8.6 L0.2,6.1 C0.1,5.9 0,5.7 0,5.4 C0,5.1 0.1,4.9 0.3,4.7 C3.3,1.8 7.5,-8.8817842e-16 12,-8.8817842e-16 C16.5,-8.8817842e-16 20.7,1.8 23.7,4.7 C23.9,4.9 24,5.1 24,5.4 C24,5.7 23.9,5.9 23.7,6.1 L21.2,8.6 C21,8.8 20.8,8.9 20.5,8.9 C20.2,8.9 20,8.8 19.8,8.6 C19,7.9 18.1,7.2 17.1,6.7 C16.8,6.5 16.5,6.2 16.5,5.8 L16.5,2.7 C15.1,2.3 13.6,2 12,2 L12,2 Z"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default CallEndIcon;
