type LogoProps = {
  size?: number;
  className?: string;
};
export default function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="20 30 150 150"
      xmlSpace="preserve"
      className={className}
      // width={"100%"}
      // height={"100%"}
    >
      <defs>
        <linearGradient id="linearGradient148">
          <stop offset="0" stopColor={"var(--primary-4)"} stopOpacity="1"></stop>
          <stop offset="1" stopColor={"var(--secondary-4)"} stopOpacity="1"></stop>
        </linearGradient>
        <linearGradient
          id="linearGradient147"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient148"
        ></linearGradient>
      </defs>
      <g stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="1" display="inline">
        <circle
          style={{ mixBlendMode: "normal" }}
          cx="96.55"
          cy="105.987"
          r="73.433"
          fill="url(#linearGradient147)"
          strokeWidth="0.428"
          display="inline"
        ></circle>
      </g>
      <g fill="#1a1a1a" display="inline" transform="rotate(-10.472 92.742 106.77)">
        <path
          style={{ mixBlendMode: "normal" }}
          fill="#f9f9f9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.396"
          d="M142.792 59.697a5.26 5.26 0 00-1.533-.227c-3.673.133-6.687 2.51-7.11 5.607l-9.03 48.046c-5.435-14.133-10.642-28.351-15.428-42.718-1.824-5.53-4.4-10.12-10.613-11.259-3.991-.715-17.874 1.473-21.264 19.106l-.038.202-7.73 41.124c-.67-.381-1.37-.72-2.094-1.013a18.567 18.567 0 00-3.56-1.007 19.893 19.893 0 00-3.774-.305 21.146 21.146 0 00-3.841.41 22.12 22.12 0 00-3.763 1.105 22.656 22.656 0 00-6.72 4.112 22.121 22.121 0 00-2.698 2.847 21.146 21.146 0 00-2.113 3.235 19.893 19.893 0 00-1.446 3.499 18.565 18.565 0 00-.723 3.627 17.369 17.369 0 00.026 3.618 16.47 16.47 0 00.775 3.468 15.99 15.99 0 003.651 5.967 16.47 16.47 0 002.736 2.269 17.37 17.37 0 003.209 1.67c1.136.45 2.328.787 3.56 1.007 1.23.22 2.495.322 3.773.305a21.146 21.146 0 003.842-.409 22.121 22.121 0 003.763-1.106 22.656 22.656 0 008.579-5.961 21.844 21.844 0 001.613-2.04 21.149 21.149 0 001.898-3.336 19.895 19.895 0 00.886-2.356 19.003 19.003 0 00.565-2.413c.026-.175.048-.35.069-.527l.012.005 10.895-57.962 15.835 41.591a22.716 22.716 0 00-4.904 3.304 22.122 22.122 0 00-2.699 2.847 21.146 21.146 0 00-2.113 3.235 19.893 19.893 0 00-1.446 3.499 18.566 18.566 0 00-.723 3.628 17.368 17.368 0 00.026 3.617 16.47 16.47 0 00.776 3.468 15.991 15.991 0 003.65 5.967 16.47 16.47 0 002.736 2.27 17.37 17.37 0 003.21 1.67c1.135.449 2.328.786 3.559 1.006 1.23.22 2.495.322 3.773.305a21.143 21.143 0 003.842-.409 22.122 22.122 0 003.763-1.106 22.655 22.655 0 008.579-5.961 21.848 21.848 0 002.318-3.119 20.757 20.757 0 001.192-2.257 19.89 19.89 0 00.887-2.355 19.003 19.003 0 00.565-2.413c.026-.176.049-.352.069-.527l.013.005 13.653-72.642c.342-1.82-.89-3.589-2.935-4.213zm-24.62 58.16a19.564 19.564 0 00-3.751-.301 20.084 20.084 0 013.752.301zm.043.008zm1.797.414zm1.746.59zm-7.354-1.312a20.882 20.882 0 00-3.825.407 21.922 21.922 0 001.92-.293 20.84 20.84 0 011.905-.114zm9.022 2.075c.144.075.284.157.425.236l-.002.013c-.14-.085-.28-.168-.422-.249zm-8.012 7.361a9.177 9.177 0 012.337.746c.73.349 1.4.792 1.989 1.318a8.023 8.023 0 012.613 4.917 8.483 8.483 0 01.064 1.696 8.987 8.987 0 01-.268 1.712 9.618 9.618 0 01-.593 1.67 10.239 10.239 0 01-.897 1.57 10.785 10.785 0 01-1.17 1.415 11.176 11.176 0 01-2.177 1.734c-.753.46-1.555.831-2.388 1.103s-1.688.442-2.544.507c-.856.065-1.706.023-2.527-.124a9.177 9.177 0 01-2.337-.746 8.44 8.44 0 01-1.99-1.318 8.023 8.023 0 01-2.421-3.958 8.44 8.44 0 01-.268-2.37 9.175 9.175 0 01.4-2.42c.242-.799.592-1.574 1.04-2.307.446-.733.988-1.417 1.609-2.035a11.297 11.297 0 014.457-2.727 10.836 10.836 0 012.544-.507 10.053 10.053 0 012.527.124zm-53.802-.302a9.177 9.177 0 012.337.746 8.44 8.44 0 011.989 1.318 8.023 8.023 0 012.612 4.917 8.486 8.486 0 01.065 1.696 9 9 0 01-.268 1.712 9.613 9.613 0 01-.593 1.669 10.236 10.236 0 01-.896 1.57 10.786 10.786 0 01-1.17 1.416 11.177 11.177 0 01-2.178 1.734c-.753.46-1.556.831-2.388 1.103-.833.272-1.688.442-2.544.507-.856.064-1.706.023-2.527-.124a9.177 9.177 0 01-2.338-.747 8.44 8.44 0 01-1.988-1.317 8.023 8.023 0 01-2.422-3.958 8.44 8.44 0 01-.268-2.37 9.177 9.177 0 01.4-2.421c.242-.798.592-1.574 1.04-2.307.447-.732.988-1.416 1.609-2.034a11.297 11.297 0 014.457-2.727 10.836 10.836 0 012.544-.507 10.054 10.054 0 012.527.124z"
          display="inline"
        ></path>
      </g>
    </svg>
  );
}
