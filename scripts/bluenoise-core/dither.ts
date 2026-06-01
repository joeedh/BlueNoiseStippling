// Unified color dithering, shared across the render modes that quantize a
// sampled RGB color to the palette (PATTERN / default step / point placement).
//
// This is the single canonical dither: the hue-preserving HSV palette dither
// that originated in step_b()'s DITHER_COLORS path. All palette-dithering modes
// now route through ditherColor() so they behave identically.
//
// NOT unified here (different mechanisms, by design):
//   - DIFFUSION mode's Floyd-Steinberg error diffusion (spatial error spread).
//   - CMYK mode's per-channel halftoning (works in CMYK channel space, not an
//     RGB palette, so there is no closest-color step to share).
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import type { Vec } from "./internal.js";

// Scratch palette-candidate list reused across calls (mirrors step_b's `nextout`).
const nextout: number[] = [0, 0, 0, 0, 0];

// Pick a palette color for `clr` with hue-preserving dithering. `fac` is the
// local coverage/intensity in [0,1] that selects the dither level (higher =>
// more saturated/inked, less likely to fall through to the background color).
// Returns the chosen palette index; does NOT mutate `clr`.
export function ditherColor(bn: BlueNoise, clr: Vec, fac: number): number {
  let hsv = colors.rgb_to_hsv(clr[0], clr[1], clr[2]);
  let clr2 = colors.hsv_to_rgb(hsv[0], 1.0, hsv[2]);

  let f1 = clr2[0] * 0.4 + clr2[1] * 0.6 + clr2[2] * 0.2;

  nextout.length = 5;
  let ci = colors.closest_color(clr2, nextout, 0.0, true);

  if (ci === undefined) {
    ci = 0;
  }

  let c2 = colors.colors[ci];
  let err = Math.sqrt(colors.colordis_not_diffusing(clr2, c2));

  for (let k = 0; k < nextout.length; k++) {
    if (nextout[k] === undefined) {
      nextout.length = k;
      break;
    }
  }

  let fac2 = Math.pow(fac, 1.0);
  fac2 = Math.pow(fac2, 1.0) / 4.0;
  fac2 *= 1.0 + err * err * 7.0 * f1;

  fac2 = Math.min(Math.max(fac2, 0.0), 1.0);

  let fi = ~~(fac2 * nextout.length * 0.999999);

  ci = nextout[fi];
  let sat = 1.0 - hsv[1];

  if (hsv[2] * sat > fac) {
    ci = 0;
  }

  return ci;
}
