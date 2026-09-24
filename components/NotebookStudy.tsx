/** Original construction drawing, inspired by astrolabe graduations, not a historical facsimile. */
export function NotebookStudy() {
  return (
    <svg
      className="notebook-study"
      viewBox="0 0 240 220"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          opacity=".2"
          d="M13 97L223 106M117 9L111 201M36 36L192 181M23 169L206 35"
        />
        <path
          strokeWidth=".8"
          d="M193 104C194 148 158 184 115 182C71 183 34 147 36 103C34 59 72 23 117 26C160 25 195 62 193 104Z"
        />
        <path
          opacity=".3"
          d="M197 101C197 149 160 187 115 186C68 184 32 148 32 102C33 58 70 21 117 22C164 23 197 57 197 101"
        />
        <path d="M181 106C180 143 152 171 113 170C77 170 48 142 48 104C47 67 78 37 116 38C152 38 184 69 181 106Z" />
        <path
          strokeWidth=".7"
          opacity=".65"
          d="M66 72C77 29 128 28 149 64C173 104 138 157 97 143C58 130 51 94 66 72ZM57 135C94 180 171 151 170 104C168 77 140 58 118 68C89 79 91 126 119 140"
        />
        <path
          strokeWidth="1.2"
          d="M51 144L180 61M52 148L181 65M106 107L124 100L117 115Z"
        />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * Math.PI) / 18;
          return (
            <path
              key={i}
              opacity={i % 3 === 0 ? 0.65 : 0.32}
              d={`M${115 + Math.cos(a) * 72} ${104 + Math.sin(a) * 72}l${Math.cos(a) * (i % 3 === 0 ? 7 : 3)} ${Math.sin(a) * (i % 3 === 0 ? 7 : 3)}`}
            />
          );
        })}
        <path
          opacity=".45"
          d="M45 185Q24 190 24 159M24 159l-4 8m4-8 6 5M197 22l2 11 10 2-10 3-2 10-2-11-9-2 9-2Z"
        />
        <path opacity=".25" d="M76 183l-8 12m13-10-8 11m14-9-7 11m14-9-7 10" />
      </g>
      <text
        x="149"
        y="209"
        fill="currentColor"
        fontSize="14"
        fontFamily="Vazirmatn"
        direction="rtl"
      >
        مدارِ ایده‌ها
      </text>
      <text x="28" y="18" fill="currentColor" fontSize="15" fontFamily="Caveat">
        study no. 01
      </text>
    </svg>
  );
}
