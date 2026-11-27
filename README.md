# bargain-beacon

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/elrahen/bargain-beacon/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/elrahen/bargain-beacon/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Price Patrol is a Black Friday deal finder built from 17 real deals checked by hand on 27 November 2026. Each deal shows its sale price, usual price, store link, when the price was checked, and an honest verdict — "New low", "Strong price" or "Fair deal" — with the evidence behind it, including where a store's struck-through price looked inflated. Search, filter by category, store and discount, sort by discount or verdict, and open any deal for its full evidence. The site is plain static files with no network requests, and works on desktop and on a phone.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Then open `out/app/index.html` in a browser, or serve `out/app/` with any static file server. `main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there.

Screenshots in `screenshots/` are real renders of this site running in Chromium: the deal grid on desktop, a filtered view with a deal's detail panel open, and the phone layout.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ppqr50kp&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
