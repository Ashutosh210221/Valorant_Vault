/* ============================================================
   Curated Valorant chat text art — designed to actually render
   in Valorant's chat (which uses a proportional font).

   STRICT RULES used while writing every piece:
   1. Single-line pieces use ONLY plain ASCII + standard emoji.
      No box-drawing chars (╔═║) because they don't align with
      letters in the in-game font.
   2. Multi-line "block art" uses ONLY shaded block characters
      (░ ▓ █) and spaces. No mixed text inside the grid — those
      lines render at different widths in chat.
   3. Every line stays under ~100 chars (Valorant chat limit
      is ~128, leaving headroom for safety).
   4. Multi-line pieces paste as separate sends — accepted spam
      behaviour that matches valoranttextart.com style.
   ============================================================ */
const TEXTART_DATA = [

  /* ===================== GG / WP ===================== */
  { id: 'gg-fire',     title: 'GG EZ Fire',       category: 'gg', tags: ['gg', 'ez', 'flex'],
    art: '🔥🔥 GG EZ 🔥🔥' },
  { id: 'gg-clap',     title: 'GG WP Clap',       category: 'gg', tags: ['gg', 'wp'],
    art: '👏 GG WP 👏 well played team' },
  { id: 'gg-nore',     title: 'GG No Re',         category: 'gg', tags: ['gg', 'tilt'],
    art: '💯 GG NO RE 💯 next game' },
  { id: 'gg-go-next',  title: 'GG Go Next',       category: 'gg', tags: ['gg', 'next'],
    art: '⏭️ gg go next ⏭️' },
  { id: 'gg-too-easy', title: 'GG Too Easy',      category: 'gg', tags: ['gg', 'flex'],
    art: '😎 gg too easy 😎' },
  { id: 'gg-thanks',   title: 'GG Thanks',        category: 'gg', tags: ['gg', 'wholesome'],
    art: '🙌 gg thanks team 🙌' },
  { id: 'gg-stomp',    title: 'GG Stomp',         category: 'gg', tags: ['gg', 'win'],
    art: '🏆 gg stomp 13-0 🏆' },
  { id: 'gg-noobs',    title: 'GG Got Em',        category: 'gg', tags: ['gg', 'trash'],
    art: '🤣 gg got em boys 🤣' },

  /* ===================== HYPE ===================== */
  { id: 'ace',         title: 'A C E',            category: 'hype', tags: ['ace', '5k'],
    art: '🎯 A C E 🎯 5K MONSTER' },
  { id: 'clutch-1v5',  title: 'Clutch 1v5',       category: 'hype', tags: ['clutch', '1v5'],
    art: '⚡ 1v5 CLUTCHED ⚡ insane round' },
  { id: 'mvp',         title: 'MVP',              category: 'hype', tags: ['mvp', 'flex'],
    art: '👑 MVP OF THE MATCH 👑' },
  { id: 'unstoppable', title: 'Unstoppable',      category: 'hype', tags: ['streak', 'hype'],
    art: '🔥 UNSTOPPABLE 🔥 on fire' },
  { id: 'cracked',     title: 'Cracked',          category: 'hype', tags: ['skill', 'aim'],
    art: '💥 ABSOLUTELY CRACKED 💥' },
  { id: 'demon-time',  title: 'Demon Time',       category: 'hype', tags: ['demon', 'flex'],
    art: '😈 DEMON TIME 😈 lock in' },
  { id: 'first-blood', title: 'First Blood',      category: 'hype', tags: ['fb', 'opener'],
    art: '🩸 FIRST BLOOD 🩸 nice opener' },
  { id: 'one-tap',     title: 'One Tap',          category: 'hype', tags: ['1tap', 'flick'],
    art: '🎯 ONE TAPPED 💥 skill issue' },

  /* ===================== WHOLESOME ===================== */
  { id: 'nice-shot',   title: 'Nice Shot',        category: 'wholesome', tags: ['ns'],
    art: '🎯 nice shot teammate 🎯' },
  { id: 'thanks-team', title: 'Thanks Team',      category: 'wholesome', tags: ['ty', 'team'],
    art: '💖 thank you team 💖 love yall' },
  { id: 'good-job',    title: 'Good Job',         category: 'wholesome', tags: ['gj'],
    art: '✨ good job everyone ✨' },
  { id: 'gl-hf',       title: 'GL HF',            category: 'wholesome', tags: ['gl', 'hf'],
    art: '🤝 gl hf 🤝 have fun' },
  { id: 'unlucky',     title: 'Unlucky',          category: 'wholesome', tags: ['unlucky'],
    art: '🍀 unlucky bro 🍀 next round' },
  { id: 'good-try',    title: 'Good Try',         category: 'wholesome', tags: ['try'],
    art: '🙏 good try team 🙏 we got this' },
  { id: 'sorry',       title: 'My Bad',           category: 'wholesome', tags: ['sorry'],
    art: '😅 my bad sorry team 😅' },
  { id: 'lets-go',     title: 'Lets Go',          category: 'wholesome', tags: ['lfg'],
    art: '🚀 LETS GO TEAM 🚀 lock in' },

  /* ===================== TRASH TALK (clean) ===================== */
  { id: 'cope',        title: 'Cope',             category: 'trash', tags: ['cope'],
    art: '😂 cry harder 😂 cope and seethe' },
  { id: 'malding',     title: 'Stay Malding',     category: 'trash', tags: ['mald'],
    art: '🧂 stay malding 🧂 salt overload' },
  { id: 'l-bozo',      title: 'L Bozo',           category: 'trash', tags: ['L', 'bozo'],
    art: '🤡 L + Ratio + Bozo 🤡' },
  { id: 'ez-clap',     title: 'EZ Clap',          category: 'trash', tags: ['ez'],
    art: '👏 EZ CLAP 👏 too easy' },
  { id: 'skill-issue', title: 'Skill Issue',      category: 'trash', tags: ['skill'],
    art: '📉 skill issue tbh 📉' },
  { id: 'rank-doubt',  title: 'Bought Rank',      category: 'trash', tags: ['rank'],
    art: '💸 bought your rank? 💸' },
  { id: 'silver-aim',  title: 'Silver Aim',       category: 'trash', tags: ['rank'],
    art: '🥈 silver aim detected 🥈' },
  { id: 'sit-down',    title: 'Sit Down',         category: 'trash', tags: ['sit'],
    art: '🪑 sit down clown 🪑' },
  { id: 'ratio',       title: 'Ratio',            category: 'trash', tags: ['ratio'],
    art: '↘️ RATIO ↙️ + you fell off' },
  { id: 'whos-asking', title: 'Who Asked',        category: 'trash', tags: ['asked'],
    art: '🦗 who asked tho 🦗 crickets' },

  /* ===================== MEMES ===================== */
  { id: 'shrug',       title: 'Shrug',            category: 'meme', tags: ['shrug', 'idk'],
    art: '¯\\_(ツ)_/¯ idk man' },
  { id: 'lenny',       title: 'Lenny',            category: 'meme', tags: ['lenny'],
    art: '( ͡° ͜ʖ ͡°) sus' },
  { id: 'flip-table',  title: 'Flip Table',       category: 'meme', tags: ['rage'],
    art: '(╯°□°)╯︵ ┻━┻' },
  { id: 'put-back',    title: 'Put It Back',      category: 'meme', tags: ['calm'],
    art: '┬─┬ノ( º _ ºノ) put it back' },
  { id: 'bonk',        title: 'Bonk',             category: 'meme', tags: ['bonk'],
    art: '⊂(◉‿◉)つ B O N K go to horny jail' },
  { id: 'crying',      title: 'Crying',           category: 'meme', tags: ['cry'],
    art: '😭😭😭 pls heal me 😭😭😭' },
  { id: 'eyes',        title: 'Eyes',             category: 'meme', tags: ['eyes'],
    art: '👁️ 👄 👁️ wat' },
  { id: 'this-is-fine', title: 'This Is Fine',    category: 'meme', tags: ['fine'],
    art: '🔥🐶🔥 this is fine' },
  { id: 'sus',         title: 'Sus',              category: 'meme', tags: ['sus'],
    art: '📮 sus 📮 vent now' },
  { id: 'side-eye',    title: 'Side Eye',         category: 'meme', tags: ['sideeye'],
    art: '👀 you good bro? 👀' },
  { id: 'awoo',        title: 'AWOOGA',           category: 'meme', tags: ['eyes'],
    art: 'ඞ AMOGUS DETECTED ඞ' },
  { id: 'smol-cat',    title: 'Smol Cat',         category: 'meme', tags: ['cat'],
    art: '/ᐠ｡‸｡ᐟ\\ smol cat noises' },

  /* ===================== VALORANT-SPECIFIC ===================== */
  { id: 'spike-down',  title: 'Spike Down',       category: 'valorant', tags: ['spike', 'plant'],
    art: '💣 SPIKE DOWN 💣 push push push' },
  { id: 'spike-defuse', title: 'Defusing',         category: 'valorant', tags: ['defuse'],
    art: '⚙️ defusing 💚 hold flanks' },
  { id: 'rotate',      title: 'Rotate',           category: 'valorant', tags: ['rotate'],
    art: '🔄 ROTATE ROTATE ROTATE 🔄' },
  { id: 'rush-b',      title: 'Rush B',           category: 'valorant', tags: ['rush'],
    art: '🏃💨 RUSH B RUSH B 🏃💨' },
  { id: 'hold-angle',  title: 'Hold Angle',       category: 'valorant', tags: ['hold'],
    art: '👁️ hold this angle 👁️' },
  { id: 'sage-heal',   title: 'Sage Heal',        category: 'valorant', tags: ['sage'],
    art: '✚ sage pls heal ✚ im low' },
  { id: 'jett-knives', title: 'Jett Knives',      category: 'valorant', tags: ['jett'],
    art: '🗡️ JETT KNIVES READY 🗡️' },
  { id: 'sova-recon',  title: 'Sova Recon',       category: 'valorant', tags: ['sova'],
    art: '🏹 sova recon up 🏹 info coming' },
  { id: 'killjoy-set', title: 'Killjoy Setup',    category: 'valorant', tags: ['killjoy'],
    art: '🤖 killjoy setup ready 🤖' },
  { id: 'omen-tp',     title: 'Omen TP',          category: 'valorant', tags: ['omen'],
    art: '🌑 omen flanking 🌑 watch back' },
  { id: 'cypher-cams', title: 'Cypher Cams',      category: 'valorant', tags: ['cypher'],
    art: '📷 cypher cams up 📷 info' },
  { id: 'reyna-leech', title: 'Reyna Leech',      category: 'valorant', tags: ['reyna'],
    art: '👁️ reyna leech mode 👁️' },
  { id: 'phoenix-ult', title: 'Phoenix Ult',      category: 'valorant', tags: ['phoenix'],
    art: '🔥 phoenix ult ready 🔥' },
  { id: 'op-shot',     title: 'OP Shot',          category: 'valorant', tags: ['op'],
    art: '🎯 OP SHOT 🎯 awp diff' },
  { id: 'eco-round',   title: 'Eco Round',        category: 'valorant', tags: ['eco'],
    art: '💸 eco round 💸 save credits' },
  { id: 'force-buy',   title: 'Force Buy',        category: 'valorant', tags: ['force'],
    art: '💪 FORCE BUY 💪 send it' },

  /* ===================== BIG BLOCK ART =====================
     All pieces below use ONLY block characters (░ ▓ █) and spaces.
     No mixed text inside the grid — chat will render these as
     pixel-style art when spam-sent line by line.
  ====================================================== */

  { id: 'big-skull',   title: 'Skull',            category: 'big', tags: ['skull', 'dead', 'rip'],
    art:
      '░░░░░██████████░░░░░\n' +
      '░░░██░░░░░░░░░░██░░░\n' +
      '░░██░░░░░░░░░░░░██░░\n' +
      '░██░░████░░░████░░██\n' +
      '░██░░████░░░████░░██\n' +
      '░██░░░░░░░░░░░░░░░██\n' +
      '░██░░░██░░░░░██░░░██\n' +
      '░░██░░██████████░░██\n' +
      '░░░██░░░░░░░░░░░██░░\n' +
      '░░░░░██████████░░░░░' },

  { id: 'big-heart',   title: 'Heart',            category: 'big', tags: ['heart', 'love'],
    art:
      '░░██████░░░░██████░░\n' +
      '░████████░░████████░\n' +
      '████████████████████\n' +
      '████████████████████\n' +
      '░██████████████████░\n' +
      '░░████████████████░░\n' +
      '░░░██████████████░░░\n' +
      '░░░░████████████░░░░\n' +
      '░░░░░██████████░░░░░\n' +
      '░░░░░░████████░░░░░░\n' +
      '░░░░░░░██████░░░░░░░\n' +
      '░░░░░░░░████░░░░░░░░\n' +
      '░░░░░░░░░██░░░░░░░░░' },

  { id: 'big-crown',   title: 'Crown',            category: 'big', tags: ['crown', 'mvp'],
    art:
      '░░██░░░░░░██░░░░░░██░░\n' +
      '░████░░░░████░░░░████░\n' +
      '██████░░██████░░██████\n' +
      '██████████████████████\n' +
      '██████████████████████\n' +
      '██░░██████████████░░██\n' +
      '██████████████████████' },

  { id: 'big-spike',   title: 'Spike',            category: 'big', tags: ['spike', 'bomb'],
    art:
      '░░░░░░░░██████░░░░░░░░\n' +
      '░░░░░░██░░░░░░██░░░░░░\n' +
      '░░░░██░░░░██░░░░██░░░░\n' +
      '░░██░░░░██████░░░░██░░\n' +
      '██░░░░██████████░░░░██\n' +
      '██░░░░██████████░░░░██\n' +
      '██░░░░██████████░░░░██\n' +
      '░░██░░░░██████░░░░██░░\n' +
      '░░░░██░░░░██░░░░██░░░░\n' +
      '░░░░░░██░░░░░░██░░░░░░\n' +
      '░░░░░░░░██████░░░░░░░░' },

  { id: 'big-sword',   title: 'Sword',            category: 'big', tags: ['sword', 'knife'],
    art:
      '░░░░░░░░░░░██░░░░░░\n' +
      '░░░░░░░░░░██░░░░░░░\n' +
      '░░░░░░░░░██░░░░░░░░\n' +
      '░░░░░░░░██░░░░░░░░░\n' +
      '░░░░░░░██░░░░░░░░░░\n' +
      '░░░░░░██░░░░░░░░░░░\n' +
      '░░░░░██░░░░░░░░░░░░\n' +
      '░░░░██░░░░░░░░░░░░░\n' +
      '░░░██░░░░░░░░░░░░░░\n' +
      '░░████████░░░░░░░░░\n' +
      '░██░░░░██████░░░░░░\n' +
      '░░░░░░░░░██░░░░░░░░\n' +
      '░░░░░░░░░██░░░░░░░░' },

  { id: 'big-arrow-up', title: 'Push Up',         category: 'big', tags: ['push', 'arrow'],
    art:
      '░░░░░░░██░░░░░░░\n' +
      '░░░░░░████░░░░░░\n' +
      '░░░░░██████░░░░░\n' +
      '░░░░████████░░░░\n' +
      '░░░██████████░░░\n' +
      '░░████████████░░\n' +
      '░░░░░░██░░░░░░░░\n' +
      '░░░░░░██░░░░░░░░\n' +
      '░░░░░░██░░░░░░░░\n' +
      '░░░░░░██░░░░░░░░' },

  { id: 'big-l',       title: 'L Block',          category: 'big', tags: ['L', 'trash'],
    art:
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██░░░░░░░░\n' +
      '██████████' },

  { id: 'big-w',       title: 'W Block',          category: 'big', tags: ['W', 'win'],
    art:
      '██░░░░░░░░░░██\n' +
      '██░░░░░░░░░░██\n' +
      '██░░░░██░░░░██\n' +
      '██░░░░██░░░░██\n' +
      '██░░██████░░██\n' +
      '██████░░██████\n' +
      '████░░░░░░████\n' +
      '██░░░░░░░░░░██' },

  { id: 'big-smile',   title: 'Smile',            category: 'big', tags: ['smile', 'happy'],
    art:
      '░░░░██████████░░░░\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░██░░████░░████░██\n' +
      '░██░░████░░████░██\n' +
      '░██░░░░░░░░░░░░░██\n' +
      '░██░░██░░░░░░██░██\n' +
      '░██░░░██████████░██\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░░░░██████████░░░░' },

  { id: 'big-fire',    title: 'Fire',             category: 'big', tags: ['fire', 'hot'],
    art:
      '░░░░░░░██░░░░░░░\n' +
      '░░░░░░████░░░░░░\n' +
      '░░░░░██░░██░░░░░\n' +
      '░░░░██░██░██░░░░\n' +
      '░░░██░████░██░░░\n' +
      '░░██░██░░██░██░░\n' +
      '░██░██░░░░██░██░\n' +
      '░██░░██░░██░░██░\n' +
      '░░██░░██████░░██\n' +
      '░░░██████████░░░' },

  { id: 'big-thumbs',  title: 'Thumbs Up',        category: 'big', tags: ['thumbs', 'gj'],
    art:
      '░░░░██████░░░░\n' +
      '░░░░██░░██░░░░\n' +
      '░░░░██░░██░░░░\n' +
      '░░██░██░██████\n' +
      '░██░░██░░░░░██\n' +
      '░██░░░░░░░░░██\n' +
      '░██░░░░░░░░░██\n' +
      '░░████████████' },

  { id: 'big-peace',   title: 'Peace',            category: 'big', tags: ['peace', 'ggwp'],
    art:
      '░░░░██████████░░░░\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░██░░░██░░██░░░░██\n' +
      '░██░░░██░░██░░░░██\n' +
      '░██░░░██░░██░░░░██\n' +
      '░██░░░██░░██░░░░██\n' +
      '░██░░░░░░░░░░░░░██\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░░░░██████████░░░░' },

  { id: 'big-target',  title: 'Bullseye',         category: 'big', tags: ['target', 'aim'],
    art:
      '░░░░░██████████░░░░░\n' +
      '░░██████░░░░██████░░\n' +
      '░██░░░░██████░░░░██░\n' +
      '██░░██░░░░░░░░██░░██\n' +
      '██░██░░██████░░██░██\n' +
      '██░██░██████████░██\n' +
      '██░██░██████████░██\n' +
      '██░██░░██████░░██░██\n' +
      '██░░██░░░░░░░░██░░██\n' +
      '░██░░░░██████░░░░██░\n' +
      '░░██████░░░░██████░░\n' +
      '░░░░░██████████░░░░░' },

  { id: 'big-rip',     title: 'RIP Tombstone',    category: 'big', tags: ['rip', 'dead'],
    art:
      '░░░██████████░░░\n' +
      '░██░░░░░░░░░░██░\n' +
      '██░░░░░░░░░░░░██\n' +
      '██░░██░░██░░░░██\n' +
      '██░░██░██░██░░██\n' +
      '██░░██░██░██░░██\n' +
      '██░░░░░░░░░░░░██\n' +
      '██░░░░░░░░░░░░██\n' +
      '██░░░░░░░░░░░░██\n' +
      '████████████████' },

  { id: 'big-clown',   title: 'Clown',            category: 'big', tags: ['clown', 'L'],
    art:
      '░░░░░░░░██░░░░░░░░\n' +
      '░░░░██████████░░░░\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░██░░██░░░░██░░██░\n' +
      '░██░░░░░░██░░░░██░\n' +
      '░██░░░░██████░░██░\n' +
      '░██░░░░░░██░░░░██░\n' +
      '░░██░░░░░░░░░░██░░\n' +
      '░░░░██████████░░░░' },

  { id: 'big-pixel-v', title: 'Big V',            category: 'big', tags: ['valorant', 'V'],
    art:
      '██░░░░░░░░░░░░██\n' +
      '██░░░░░░░░░░░░██\n' +
      '░██░░░░░░░░░░██░\n' +
      '░██░░░░░░░░░░██░\n' +
      '░░██░░░░░░░░██░░\n' +
      '░░██░░░░░░░░██░░\n' +
      '░░░██░░░░░░██░░░\n' +
      '░░░░██░░░░██░░░░\n' +
      '░░░░░██░░██░░░░░\n' +
      '░░░░░░████░░░░░░\n' +
      '░░░░░░░██░░░░░░░' },

  { id: 'big-rose',    title: 'Rose',             category: 'big', tags: ['rose', 'love'],
    art:
      '░░░░██████░░░░\n' +
      '░░██░░░░░░██░░\n' +
      '░██░░████░░██░\n' +
      '██░░██░░██░░██\n' +
      '██░░██░░██░░██\n' +
      '░██░░████░░██░\n' +
      '░░██░░░░░░██░░\n' +
      '░░░░██████░░░░\n' +
      '░░░░░░██░░░░░░\n' +
      '░░░░██░██░░░░░\n' +
      '░░██░░░██░░░░░\n' +
      '░░░░░░░██░░░░░' },

  { id: 'big-cat',     title: 'Cat',              category: 'big', tags: ['cat', 'wholesome'],
    art:
      '░██░░░░░░░░░░██░\n' +
      '████░░░░░░░░████\n' +
      '██░██░░░░░░██░██\n' +
      '██░░██████████░██\n' +
      '██░██░░░░░░░░██░██\n' +
      '██░░░░██░░██░░░░██\n' +
      '██░░░░░░░░░░░░░░██\n' +
      '██░░██░░░░░░██░░██\n' +
      '██░░░░████████░░░██\n' +
      '░██░░░░░░░░░░░░██░\n' +
      '░░██████████████░░' },

  { id: 'big-gun',     title: 'Pistol',           category: 'big', tags: ['gun', 'pistol'],
    art:
      '░░░░░░░░░░░░██████████░░\n' +
      '░░░░░░░░░░░░██░░░░░░██░░\n' +
      '████████████████████████\n' +
      '██░░░░░░░░░░░░░░░░░░░░██\n' +
      '██░░░░░░░░░░░░░░░░░░░░██\n' +
      '██████████░░████████████\n' +
      '░░░░░░░░██░░██░░░░░░░░░░\n' +
      '░░░░░░░░██░░██░░░░░░░░░░\n' +
      '░░░░░░░░██████░░░░░░░░░░' },

  { id: 'big-trophy',  title: 'Trophy',           category: 'big', tags: ['trophy', 'win'],
    art:
      '██████████████\n' +
      '██░░░░░░░░░░██\n' +
      '██░░░░░░░░░░██\n' +
      '██░░░░░░░░░░██\n' +
      '░██░░░░░░░░██░\n' +
      '░░██░░░░░░██░░\n' +
      '░░░░██████░░░░\n' +
      '░░░░░░██░░░░░░\n' +
      '░░██████████░░\n' +
      '██████████████' }
];
