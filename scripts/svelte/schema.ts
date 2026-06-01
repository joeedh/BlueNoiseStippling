// Declarative description of the control panel. This is the single place where
// control metadata — labels, ranges, and (mandatory) tooltip copy — lives. The
// old dat.gui wiring in appstate.ts's makeGUI() is the source of these bindings;
// every config field exposed there is represented here, regrouped into
// intentional sections.

import { ColorSpaces } from "../colors.js";
import { RASTER_MODES } from "../const.js";

export type Field =
  | {
      kind: "slider";
      key: string;
      label: string;
      tooltip: string;
      min: number;
      max: number;
      step: number;
      int?: boolean;
      redraw?: boolean;
    }
  | {
      kind: "toggle";
      key: string;
      label: string;
      tooltip: string;
      // toggles redraw by default (matches the old check() behavior)
      redraw?: boolean;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      tooltip: string;
      options: Record<string, number | string>;
      redraw?: boolean;
    }
  | {
      kind: "curve";
      key: string;
      label: string;
      tooltip: string;
    };

export interface Section {
  title: string;
  tooltip: string;
  open?: boolean;
  fields: Field[];
}

export const SCHEMA: Section[] = [
  {
    title: "Output",
    tooltip: "Core density, point count, and rendering quality of the stipple field.",
    open: true,
    fields: [
      {
        kind: "slider",
        key: "DIMEN",
        label: "Density",
        tooltip:
          "Resolution of the sampling grid. Higher values pack in many more stipple points (and take longer to relax). Click Reset after changing.",
        min: 1,
        max: 2048,
        step: 1,
        int: true,
      },
      {
        kind: "slider",
        key: "STEPS",
        label: "Points / Step",
        tooltip:
          "How many points each Run iteration adds. Larger steps fill the image faster but in coarser increments.",
        min: 1,
        max: 50000,
        step: 1,
        int: true,
      },
      {
        kind: "slider",
        key: "DRAW_RMUL",
        label: "Point Size",
        tooltip: "Multiplier on the drawn radius of every point. Purely visual; redraws immediately.",
        min: 0.1,
        max: 8.0,
        step: 0.01,
        redraw: true,
      },
      {
        kind: "slider",
        key: "RAND_FAC",
        label: "Added Random",
        tooltip: "Jitters point positions by a random amount, trading blue-noise evenness for a looser, hand-drawn feel.",
        min: 0.0,
        max: 3.0,
        step: 0.005,
        redraw: true,
      },
      {
        kind: "toggle",
        key: "SCALE_POINTS",
        label: "Radius Scale",
        tooltip: "Scale each point's radius by local image intensity instead of drawing uniform dots.",
      },
      {
        kind: "toggle",
        key: "HIGH_QUALITY_RASTER",
        label: "HQ Renderer",
        tooltip: "Use the anti-aliased software rasterizer for smoother circles, at the cost of slower redraws.",
      },
      {
        kind: "slider",
        key: "RENDERED_IMAGE_SIZE",
        label: "Export Size",
        tooltip: "Pixel size of the longest edge when using Save Image. Does not affect the on-screen preview.",
        min: 1,
        max: 4096,
        step: 1,
        int: true,
      },
    ],
  },
  {
    title: "Shape",
    tooltip: "How each sample is drawn: dots, triangles, hex/grid arrangements, or directional sticks.",
    fields: [
      {
        kind: "toggle",
        key: "TRI_MODE",
        label: "Triangle Mode",
        tooltip: "Render the Delaunay triangulation of the points instead of dots.",
      },
      {
        kind: "toggle",
        key: "HEXAGON_MODE",
        label: "Hexagonish",
        tooltip: "Bias relaxation toward a hexagonal packing for a more regular, honeycomb-like distribution.",
      },
      {
        kind: "toggle",
        key: "GRID_MODE",
        label: "Grid Like",
        tooltip: "Bias relaxation toward an axis-aligned grid arrangement.",
      },
    ],
  },
  {
    title: "Sticks",
    tooltip: "Draw oriented stick/stroke marks following the image's anisotropy field instead of dots.",
    fields: [
      {
        kind: "toggle",
        key: "DRAW_STICKS",
        label: "Draw Sticks",
        tooltip: "Replace dots with short oriented strokes aligned to the local gradient direction.",
      },
      {
        kind: "toggle",
        key: "FANCY_STICKS",
        label: "Fancy Strokes",
        tooltip: "Use tapered, variable-width strokes rather than plain line segments.",
      },
      {
        kind: "toggle",
        key: "STICK_ARROWS",
        label: "Use Arrows",
        tooltip: "Add arrowheads to each stick, showing gradient direction.",
      },
      {
        kind: "slider",
        key: "STICK_ROT",
        label: "Rotation",
        tooltip: "Global rotation offset (degrees) applied to every stick.",
        min: -180,
        max: 180,
        step: 0.0001,
        redraw: true,
      },
      {
        kind: "slider",
        key: "STICK_WIDTH",
        label: "Width",
        tooltip: "Stroke width of each stick.",
        min: 0.0001,
        max: 12.0,
        step: 0.0001,
        redraw: true,
      },
      {
        kind: "slider",
        key: "STICK_LENGTH",
        label: "Length",
        tooltip: "Length of each stick relative to its point spacing.",
        min: 0.0001,
        max: 12.0,
        step: 0.0001,
        redraw: true,
      },
      {
        kind: "slider",
        key: "ANIS_W1",
        label: "Weight 1",
        tooltip: "First anisotropy weighting term controlling how strongly sticks follow the gradient.",
        min: -2.0,
        max: 2.0,
        step: 0.0001,
      },
      {
        kind: "slider",
        key: "ANIS_W2",
        label: "Weight 2",
        tooltip: "Second anisotropy weighting term, balancing along- vs across-gradient stretch.",
        min: -2.0,
        max: 2.0,
        step: 0.0001,
      },
    ],
  },
  {
    title: "Relaxation",
    tooltip: "The iterative blue-noise relaxation that evens out point spacing.",
    fields: [
      {
        kind: "slider",
        key: "RELAX_SPEED",
        label: "Relax Speed",
        tooltip: "Step size of each relaxation iteration. Higher converges faster but can overshoot and jitter.",
        min: 0.001,
        max: 8.0,
        step: 0.001,
        int: true,
      },
      {
        kind: "slider",
        key: "FILTERWID",
        label: "Filter Width",
        tooltip: "Radius of the neighbor-repulsion kernel. Wider pushes points apart over a larger area.",
        min: 0.001,
        max: 7.0,
        step: 0.001,
      },
      {
        kind: "slider",
        key: "ANISOTROPY_FILTERWID",
        label: "Aniso Filter Width",
        tooltip: "Filter width used along the anisotropy direction when Anisotropic relaxation is enabled.",
        min: 0.001,
        max: 7.0,
        step: 0.001,
      },
      {
        kind: "toggle",
        key: "ANISOTROPY",
        label: "Anisotropic",
        tooltip: "Stretch the repulsion kernel along the local image gradient, producing directional point flow.",
      },
      {
        kind: "toggle",
        key: "RELAX_UPDATE_VECTORS",
        label: "Update Vectors",
        tooltip: "Recompute the anisotropy/gradient vectors each relaxation step instead of keeping the initial field.",
      },
      {
        kind: "toggle",
        key: "USE_SPH_CURVE",
        label: "Use SPH Curve",
        tooltip: "Use the custom curve below as the SPH repulsion kernel profile instead of the built-in falloff.",
      },
      {
        kind: "curve",
        key: "SPH_CURVE",
        label: "SPH Kernel Curve",
        tooltip: "Shapes the repulsion force vs. distance. Drag points to edit; the X axis is distance, Y is force.",
      },
    ],
  },
  {
    title: "Image Filtering",
    tooltip: "Preprocessing applied to the source image before sampling: equalization, deband, sharpen, and tone/density remapping.",
    fields: [
      {
        kind: "toggle",
        key: "HIST_EQUALIZE",
        label: "Equalize Histogram",
        tooltip: "Stretch the tonal range so darks and lights span the full scale, increasing point-density contrast.",
      },
      {
        kind: "toggle",
        key: "DEBAND_IMAGE",
        label: "Blur Derivatives",
        tooltip: "Smooth the image's derivative/density field to reduce banding artifacts in smooth gradients.",
      },
      {
        kind: "slider",
        key: "DEBAND_RADIUS",
        label: "Blur Radius",
        tooltip: "Radius of the deband blur, in pixels.",
        min: 1,
        max: 90,
        step: 1,
        int: true,
      },
      {
        kind: "slider",
        key: "DEBAND_BLEND",
        label: "Blend Original",
        tooltip: "Crossfade between the debanded field (0) and the original image (1).",
        min: 0,
        max: 1,
        step: 0.0001,
      },
      {
        kind: "toggle",
        key: "SHARPEN",
        label: "Sharpen",
        tooltip: "Apply an unsharp-mask pass to accentuate edges before sampling.",
      },
      {
        kind: "slider",
        key: "SHARPNESS",
        label: "Sharpness",
        tooltip: "Strength of the sharpen pass.",
        min: 0.0,
        max: 3.5,
        step: 0.001,
      },
      {
        kind: "toggle",
        key: "SHARPEN_LUMINENCE",
        label: "Luminance Only",
        tooltip: "Sharpen only the luminance channel, leaving color untouched to avoid chroma fringing.",
      },
      {
        kind: "select",
        key: "COLOR_SPACE",
        label: "Color Space",
        tooltip: "Color space used for image analysis and palette matching. LAB is perceptual; XYZ/RGB are faster.",
        options: ColorSpaces as unknown as Record<string, number>,
      },
      {
        kind: "curve",
        key: "TONE_CURVE",
        label: "Tone Curve",
        tooltip: "Remaps input brightness to output brightness before sampling. Drag to push tones lighter or darker.",
      },
      {
        kind: "curve",
        key: "DENSITY_CURVE",
        label: "Density Curve",
        tooltip: "Maps image brightness to point density. Steeper sections concentrate points in that tonal band.",
      },
    ],
  },
  {
    title: "Dithering",
    tooltip: "Controls how colors are dithered across the stipple field.",
    fields: [
      {
        kind: "toggle",
        key: "DITHER_COLORS",
        label: "Dither Colors",
        tooltip: "Distribute palette colors across neighboring points to approximate in-between tones.",
      },
      {
        kind: "slider",
        key: "DITHER_RAND_FAC",
        label: "Dither Random",
        tooltip: "Random perturbation added during color dithering, breaking up regular patterns.",
        min: 0.0,
        max: 9.0,
        step: 0.005,
      },
      {
        kind: "toggle",
        key: "DITHER_BLUE",
        label: "Blue Noise",
        tooltip: "Use a blue-noise mask for dithering, giving a more even, less clumpy color distribution.",
      },
      {
        kind: "slider",
        key: "DITHER_BLUE_STEPS",
        label: "Uniformity",
        tooltip: "Number of quantization levels in the blue-noise dither. Higher is smoother but less stylized.",
        min: 0.0,
        max: 256.0,
        step: 0.005,
        int: true,
      },
    ],
  },
  {
    title: "Palette",
    tooltip: "Color palette generation and which hues are permitted.",
    fields: [
      {
        kind: "slider",
        key: "PAL_COLORS",
        label: "Colors (×9)",
        tooltip: "Base number of palette colors (multiplied by 9 internally). More colors capture finer color detail.",
        min: 1,
        max: 32,
        step: 1,
        int: true,
      },
      {
        kind: "toggle",
        key: "ALLOW_PURPLE",
        label: "Allow Purple",
        tooltip: "Permit purple/violet hues in the generated palette.",
      },
      {
        kind: "toggle",
        key: "ALLOW_GREY",
        label: "Allow Grey",
        tooltip: "Permit neutral greys in the generated palette.",
      },
      {
        kind: "toggle",
        key: "SIMPLE_PALETTE",
        label: "Simple Palette",
        tooltip: "Use a small, evenly spaced palette instead of an image-tuned one.",
      },
      {
        kind: "toggle",
        key: "IMAGE_PALETTE",
        label: "From Image",
        tooltip: "Derive the palette from the dominant colors of the loaded image.",
      },
      {
        kind: "toggle",
        key: "BG_PALETTE",
        label: "Black/White Only",
        tooltip: "Restrict the palette to black and white.",
      },
      {
        kind: "toggle",
        key: "ADAPTIVE_COLOR_DENSITY",
        label: "Denser For Color",
        tooltip: "Increase point density in saturated regions so colors read more strongly.",
      },
      {
        kind: "toggle",
        key: "SHOW_COLORS",
        label: "Show Colors",
        tooltip: "Render points in their palette colors. Off draws everything in black.",
      },
    ],
  },
  {
    title: "Canvas & View",
    tooltip: "Pan/zoom of the preview and overlay layers — these never affect exported output.",
    fields: [
      {
        kind: "slider",
        key: "SCALE",
        label: "Scale",
        tooltip: "Zoom level of the on-screen preview.",
        min: 0.05,
        max: 5.0,
        step: 0.01,
        redraw: true,
      },
      {
        kind: "slider",
        key: "PANX",
        label: "Pan X",
        tooltip: "Horizontal pan of the preview.",
        min: -1.5,
        max: 1.5,
        step: 0.01,
        redraw: true,
      },
      {
        kind: "slider",
        key: "PANY",
        label: "Pan Y",
        tooltip: "Vertical pan of the preview.",
        min: -1.5,
        max: 1.5,
        step: 0.01,
        redraw: true,
      },
      {
        kind: "toggle",
        key: "BLACK_BG",
        label: "Black BG",
        tooltip: "Use a black canvas background instead of white (also affects exported background).",
      },
      {
        kind: "toggle",
        key: "SHOW_IMAGE",
        label: "Show Image",
        tooltip: "Overlay the source image in the corner for comparison.",
      },
      {
        kind: "toggle",
        key: "SHOW_DVIMAGE",
        label: "Show Density",
        tooltip: "Overlay the computed density/derivative field used to place points.",
      },
      {
        kind: "toggle",
        key: "SHOW_RAW_IMAGE",
        label: "Raw Image",
        tooltip: "Show the unfiltered source image rather than the processed one.",
      },
      {
        kind: "toggle",
        key: "SHOW_KDTREE",
        label: "Show kd-tree",
        tooltip: "Draw the spatial kd-tree partition used for neighbor queries (debug view).",
      },
    ],
  },
  {
    title: "Accumulation",
    tooltip: "Transparent accumulation rendering, useful for visualizing the relaxation process.",
    fields: [
      {
        kind: "toggle",
        key: "DRAW_TRANSPARENT",
        label: "Accumulation Mode",
        tooltip: "Draw points with alpha so overlapping passes build up density rather than overwrite.",
      },
      {
        kind: "slider",
        key: "ACCUM_ALPHA",
        label: "Accum Alpha",
        tooltip: "Per-point opacity used in accumulation mode.",
        min: 0.001,
        max: 1.0,
        step: 0.001,
        redraw: true,
      },
    ],
  },
  {
    title: "Advanced / Debug",
    tooltip: "Low-level masking, raster, and algorithm-internals toggles. Most users can leave these alone.",
    fields: [
      {
        kind: "toggle",
        key: "RASTER_IMAGE",
        label: "Simple Raster",
        tooltip: "Render into a fixed-size raster image buffer instead of the vector point list.",
      },
      {
        kind: "select",
        key: "RASTER_MODE",
        label: "Raster Mode",
        tooltip: "Which raster pipeline to use: error DIFFUSION, ordered PATTERN, or CMYK separation.",
        options: RASTER_MODES as unknown as Record<string, number>,
      },
      {
        kind: "toggle",
        key: "USE_CMYK_MASK",
        label: "CMYK Masksheet",
        tooltip: "Use a CMYK mask sheet when rastering, for print-style separations.",
      },
      {
        kind: "toggle",
        key: "CORRECT_FOR_SPACING",
        label: "Correct Spacing",
        tooltip: "Compensate point radius for local spacing so density reads more uniformly.",
      },
      {
        kind: "toggle",
        key: "LOW_RES_CUBE",
        label: "Low Res Cube",
        tooltip: "Use a lower-resolution color lookup cube — faster, slightly less accurate color matching.",
      },
      {
        kind: "toggle",
        key: "MAKE_NOISE",
        label: "Make Noise",
        tooltip: "Seed the field with random noise — a test mode for exercising the relaxation in isolation.",
      },
      {
        kind: "toggle",
        key: "USE_MERSENNE",
        label: "Pseudo Random",
        tooltip: "Use the deterministic Mersenne-Twister RNG so runs are reproducible.",
      },
      {
        kind: "toggle",
        key: "SMALL_MASK",
        label: "Small Mask Mode",
        tooltip: "Use the small blue-noise mask variant (lower memory, coarser).",
      },
      {
        kind: "toggle",
        key: "XLARGE_MASK",
        label: "XL Mask Mode",
        tooltip: "Use the extra-large blue-noise mask variant for the highest-quality dithering.",
      },
      {
        kind: "toggle",
        key: "SPECIAL_OFFSETS",
        label: "Encoded Offsets",
        tooltip: "Use the encoded lower-level sample offsets (multiplied by intensity) baked into the mask.",
      },
    ],
  },
];
