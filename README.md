# AshuValz — Valorant Skin Portfolio Builder
> Free · No login · No paywalls

---

## 📁 Project Structure

```
valorant-portfolio/
├── index.html              ← Homepage
├── css/
│   ├── style.css           ← Global styles
│   ├── builder.css         ← Builder page styles
│   └── showcase.css        ← Showcase page styles
├── js/
│   ├── main.js             ← Homepage animations
│   ├── skins-data.js       ← All skin data (ADD MORE HERE)
│   └── builder.js          ← Builder logic
└── pages/
    ├── builder.html        ← Skin picker / portfolio builder
    └── showcase.html       ← Example portfolios
```

---

## 🚀 How to Open in VS Code

1. Open the `valorant-portfolio` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Your site opens at `http://127.0.0.1:5500`

---

## ✏️ How to Add More Skins

Open `js/skins-data.js` and add skins to the relevant weapon array:

```js
{ 
  id: "unique-id",          // must be unique
  name: "Skin Display Name", 
  bundle: "Bundle Name", 
  tier: "ultra",            // ultra | premium | deluxe | exclusive | select
  accent: "#HEX",           // color for glow/border effect
  emoji: "🔮",              // fallback icon if no image
  img: "https://..."        // image URL (use valorant-api.com or leave "" for emoji)
}
```

### Tier Options:
| Tier | Examples |
|------|---------|
| `ultra` | Reaver, Elderflame, Glitchpop, Forsaken |
| `premium` | Prime, Ion, Spectrum, Magepunk |
| `deluxe` | Avalanche, Origin |
| `exclusive` | Champions bundles |
| `select` | Basic skins |

### Image Source:
Use the **Valorant API** for free skin images:
`https://media.valorant-api.com/weaponskinlevels/{SKIN_UUID}/displayicon.png`

Find UUIDs at: https://valorant-api.com/v1/weapons/skins

---

## 🎯 Features
- ✅ Pick weapon (Vandal, Phantom, Operator, Knife, Sheriff, Spectre)
- ✅ Filter by tier (Ultra, Premium, Deluxe, Exclusive)
- ✅ Search skins by name or bundle
- ✅ Select/deselect skins to build your loadout
- ✅ Live portfolio preview card
- ✅ Export / copy portfolio to clipboard
- ✅ No login required — everything is local

---

## 🔮 Future Ideas
- [ ] Real skin images via Valorant API
- [ ] Save portfolio to localStorage
- [ ] Share link (encode selected skins in URL)
- [ ] More weapons (Classic, Ghost, Odin, Ares...)
- [ ] Bundle filter (show all skins from one bundle)
- [ ] Dark/light mode toggle
- [ ] HTML canvas export as image file

---

## ⚠️ Disclaimer
AshuValz is a fan project and is not affiliated with or endorsed by Riot Games.
VALORANT and all related marks are trademarks of Riot Games, Inc.
