import * as React from "react"
const WarningIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    fill="none"
    {...props}
  >
    <g fill="red" clipPath="url(#a)">
      <path d="M39.99 29.213c-.95-1-2.525-1.05-3.537-.1l-4.7 4.437-4.713-4.45c-1-.95-2.587-.9-3.537.1-.95 1-.9 2.588.1 3.538l4.5 4.25-4.5 4.25c-1 .95-1.05 2.525-.1 3.537.487.525 1.15.788 1.812.788.613 0 1.238-.225 1.713-.688l4.712-4.45 4.713 4.45c.487.45 1.1.688 1.712.688.663 0 1.325-.263 1.813-.788.95-1 .9-2.587-.1-3.537l-4.5-4.25 4.5-4.25a2.47 2.47 0 0 0 .112-3.525Z" />
      <path d="M63.247 52.713 37.559 4.376C36.31 2.013 34.06.613 31.534.613h-.062c-2.538.025-4.788 1.463-6.013 3.863L.91 52.763c-1.237 2.438-1.125 5.4.3 7.725 1.288 2.1 3.45 3.338 5.788 3.338l50.25.05h.012c2.363 0 4.525-1.263 5.8-3.375a7.962 7.962 0 0 0 .188-7.788Zm-4.475 5.213c-.213.362-.7.95-1.513.95l-50.25-.05c-.812 0-1.3-.6-1.525-.963a2.966 2.966 0 0 1-.112-2.85l24.55-48.262c.362-.713.95-1.125 1.6-1.125h.012c.65 0 1.238.4 1.613 1.1L58.834 55.05c.575 1.087.338 2.187-.062 2.875Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h64v64H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default WarningIcon