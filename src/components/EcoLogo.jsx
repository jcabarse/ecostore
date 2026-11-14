// Eco Store logo: leaf badge + wordmark.
// Want to use your own logo image instead? Replace the <svg> below with:
//   <img src="/logo.png" alt="" width="44" height="44" />
export default function EcoLogo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="ecoLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#52B788" />
            <stop offset="1" stopColor="#1B4332" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="23" fill="#FDFBF7" stroke="#B7E4C7" strokeWidth="2" />
        <path
          d="M36 11C21 11 12 19 12 30c0 1.8.3 3.4.9 4.9C14.4 35.6 16 36 17.7 36 29 36 36 26 36 11z"
          fill="url(#ecoLeafGrad)"
        />
        <path
          d="M14 35C19 27 25 21 32 16"
          stroke="#FDFBF7"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-tight text-[#1B4332]">
        Eco<span className="text-[#40916C]">Store</span>
      </span>
    </span>
  );
}