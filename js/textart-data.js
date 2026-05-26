/* ============================================================
   Curated Valorant chat text art — copyable in-game messages.
   Categories: gg, hype, trash, wholesome, meme, valorant.
   ============================================================ */
const TEXTART_DATA = [
  {
    id: 'gg-clean',
    title: 'GG Clean',
    category: 'gg',
    tags: ['gg', 'classic'],
    art: '╔══════════════════╗\n║  ★  G G  W P  ★  ║\n╚══════════════════╝'
  },
  {
    id: 'gg-fire',
    title: 'GG On Fire',
    category: 'gg',
    tags: ['gg', 'hype'],
    art: '🔥🔥 G G  E Z 🔥🔥'
  },
  {
    id: 'gg-crown',
    title: 'GG Crown',
    category: 'gg',
    tags: ['gg', 'win'],
    art: '       👑\n   ★ GG WP ★\n   ───────────'
  },
  {
    id: 'gg-no-re',
    title: 'GG No Re',
    category: 'gg',
    tags: ['gg', 'tilt'],
    art: '┌────────────────┐\n│  GG · NO · RE  │\n└────────────────┘'
  },
  {
    id: 'ace-block',
    title: 'A C E',
    category: 'hype',
    tags: ['ace', 'clutch'],
    art: '█████  ▄█▀▀█  █████\n█▀▀▀█  █▄▄▄    █▀▀▀\n█   █  █▄▄▄    █▄▄▄\n  A     C       E'
  },
  {
    id: 'clutch',
    title: 'Clutch God',
    category: 'hype',
    tags: ['clutch', '1v5'],
    art: '⚡  1 v 5  C L U T C H E D  ⚡\n      ╰━━━━━━━━━━━━━━━╯'
  },
  {
    id: 'easy-game',
    title: 'Easy Game',
    category: 'hype',
    tags: ['ez', 'flex'],
    art: '😎  E A S Y   G A M E  😎'
  },
  {
    id: 'mvp',
    title: 'MVP',
    category: 'hype',
    tags: ['mvp', 'flex'],
    art: '★彡 [ M·V·P ] 彡★'
  },
  {
    id: 'thanks-team',
    title: 'Thanks Team',
    category: 'wholesome',
    tags: ['ty', 'team', 'wholesome'],
    art: '♡ THANK YOU TEAM ♡\n  ⌒⌒⌒⌒⌒⌒⌒⌒'
  },
  {
    id: 'nice-shot',
    title: 'Nice Shot',
    category: 'wholesome',
    tags: ['ns', 'nice'],
    art: '🎯  N I C E   S H O T  🎯'
  },
  {
    id: 'wp',
    title: 'Well Played',
    category: 'wholesome',
    tags: ['wp', 'wholesome'],
    art: '═══ ✦ WELL PLAYED ✦ ═══'
  },
  {
    id: 'unlucky',
    title: 'Unlucky',
    category: 'wholesome',
    tags: ['unlucky', 'cope'],
    art: '╭━━╮ U N L U C K Y ╭━━╮\n╰━━╯               ╰━━╯'
  },
  {
    id: 'shrug',
    title: 'Shrug',
    category: 'meme',
    tags: ['shrug', 'idk'],
    art: '¯\\_(ツ)_/¯  idk man'
  },
  {
    id: 'lenny',
    title: 'Lenny Face',
    category: 'meme',
    tags: ['lenny', 'face'],
    art: '( ͡° ͜ʖ ͡°)'
  },
  {
    id: 'flip-table',
    title: 'Flip Table',
    category: 'meme',
    tags: ['rage', 'tilt'],
    art: '(╯°□°)╯︵ ┻━┻'
  },
  {
    id: 'put-back',
    title: 'Put Back',
    category: 'meme',
    tags: ['calm'],
    art: '┬─┬ノ( º _ ºノ)  put it back'
  },
  {
    id: 'bonk',
    title: 'Bonk',
    category: 'meme',
    tags: ['bonk', 'noob'],
    art: '         ⊂(◉‿◉)つ  B O N K\n        ━━━━━━━━━━━━━━'
  },
  {
    id: 'crying',
    title: 'Crying',
    category: 'meme',
    tags: ['cry', 'sad'],
    art: '😭  pls i need heal  😭'
  },
  {
    id: 'cope',
    title: 'Cope',
    category: 'trash',
    tags: ['cope', 'tilt'],
    art: '┌─────────────┐\n│  C O P E .  │\n└─────────────┘'
  },
  {
    id: 'malding',
    title: 'Stay Malding',
    category: 'trash',
    tags: ['malding', 'rage'],
    art: '🧂 stay malding 🧂'
  },
  {
    id: 'ratio',
    title: 'Ratio',
    category: 'trash',
    tags: ['ratio'],
    art: '↘ R A T I O ↙\n  ─────────────'
  },
  {
    id: 'one-tap',
    title: 'One Tapped',
    category: 'trash',
    tags: ['1tap', 'flick'],
    art: '🎯 ONE  TAPPED  💥\n     ╰─→ skill issue'
  },
  {
    id: 'rank-doubt',
    title: 'Rank Doubt',
    category: 'trash',
    tags: ['rank', 'doubt'],
    art: '🤔 buying your rank?  🤔'
  },
  {
    id: 'spike-art',
    title: 'Spike',
    category: 'valorant',
    tags: ['spike', 'bomb'],
    art: '       ╭───╮\n      ╱  ⬢  ╲\n      ╲  ⬢  ╱\n       ╰───╯\n    SPIKE PLANTED'
  },
  {
    id: 'defuse',
    title: 'Defusing',
    category: 'valorant',
    tags: ['defuse', 'plant'],
    art: '⚙  D E F U S I N G  ⚙\n░░░░░░░░░░ 100%'
  },
  {
    id: 'jett-dash',
    title: 'Jett Dash',
    category: 'valorant',
    tags: ['jett', 'agent'],
    art: '~~~ ★ JETT ★ ~~~>\n   blade storm ready'
  },
  {
    id: 'sage-heal',
    title: 'Sage Heal',
    category: 'valorant',
    tags: ['sage', 'heal'],
    art: '✚  H E A L  P L S  ✚\n   sage where u at'
  },
  {
    id: 'killjoy',
    title: 'Killjoy Setup',
    category: 'valorant',
    tags: ['killjoy', 'setup'],
    art: '⚙ ⚙  K I L L J O Y  ⚙ ⚙\n   nanoswarm cooking'
  },
  {
    id: 'rotate',
    title: 'Rotate',
    category: 'valorant',
    tags: ['callout', 'rotate'],
    art: '◀━━━  R O T A T E  ━━━▶'
  },
  {
    id: 'hold-angle',
    title: 'Hold Angle',
    category: 'valorant',
    tags: ['callout', 'hold'],
    art: '👁  H O L D  T H I S  A N G L E  👁'
  },
  {
    id: 'rush-b',
    title: 'Rush B',
    category: 'valorant',
    tags: ['rush', 'callout'],
    art: '🏃💨 RUSH  B  RUSH  B 🏃💨'
  },
  {
    id: 'agla',
    title: 'Sad Tears',
    category: 'meme',
    tags: ['cry', 'sad'],
    art: '( ͒ ́ඉ◞ිට ͒)\n   I am crying'
  }
];
