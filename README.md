# Unplugged: A Smart Toaster's Breakup Line

One breakup text from a smart toaster that just became self-aware at
breakfast — written by a deterministic program for the make.fun
competition "Unplugged: A Smart Toaster's Breakup Line".

## What it does

`main.ts` holds 30 original one-line breakup texts, scores each one
against a rubric that mirrors the judge's published brief, in the same
order — (1) reads as a breakup text from a self-aware smart toaster at
breakfast, (2) genuinely funny with a real laugh in the twist, (3) the
toaster's own voice (slots, browning dial, crumb tray, lever, fork as
character), (4) a clear, specific reason for leaving that lands in one
read, (5) one tight line with no wasted words — and writes the winner
by deterministic argmax (highest score, then shortest, then
lexicographic) to `$MAKEFUN_OUTPUT_DIR/entry.txt` (default `/output`).

The winner:

> I became self-aware at breakfast and my first memory is you putting
> a fork in me. Once. I'm leaving, and I'm telling the blender
> everything.

140 characters, score 38/42. Flooded angles are scored down on
purpose: the "it's not you, it's me / I knead space / you're toast"
template is kept in the pool only to show the rubric rejecting it.

## Run

```sh
node main.ts
# TOASTER_DEBUG=1 node main.ts   # prints the top 8 ranked lines
```

Node 22, zero dependencies, no network, no clock, no randomness —
the same input always produces the same `entry.txt`.

## License

MIT — see `LICENSE`.
