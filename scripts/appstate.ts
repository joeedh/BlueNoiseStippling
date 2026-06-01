let __appstate: AppState | undefined = undefined;

import * as util from "./util.js";
import cconst, { config, APP_VERSION, RASTER_MODES } from "./const.js";
import * as bluenoise from "./bluenoise.js";
import * as draw from "./draw.js";
import * as colors from "./colors.js";
import * as ui from "./ui.js";
import * as spectrum from "./spectrum.js";
import * as indexdb_store from "./indexdb_store.js";
import smoothmask_file from "./smoothmask_file.js";
import * as render from "./render.js";
import * as exportsvg from "./exportsvg.js";

// `blue_mask_file` is a vendored data-url string attached to window at runtime.
declare const blue_mask_file: string;
// `_image_url` is set on window by the file-load handlers below; legacy code also
// reads it as a bare global.
declare const _image_url: string;

// The source/raster image used by the app is an <img> element onto which the
// app attaches decoded pixel data (`.data`) and float pixel data (`.fdata`).
type AppImage = HTMLImageElement & {
  data?: ImageData;
  fdata?: Float32Array;
};

window.save_buffer = function (buf: BlobPart) {
  let blob = new Blob([buf], { type: "text/plain" });
  let url = URL.createObjectURL(blob);

  window.open(url);
};

window.newline_data_url = function (s: string) {
  let maxcol = 0;
  let ret = '["';

  for (let i = 0; i < s.length; i++) {
    if ((i + 1) % 65 === 0) {
      ret += '",\n"';
    }

    ret += s[i];
  }

  ret += '"].join("");\n';

  return ret;
};

export class AppState {
  #last_size_key = "";

  bluenoise: bluenoise.BlueNoise;
  drawer: draw.Drawer;
  image: AppImage | undefined;
  outimage: ImageData | undefined;
  canvas: HTMLCanvasElement;
  g: CanvasRenderingContext2D;
  channel: number;
  color: string;
  drawlines: number[];

  hqrender: render.CircleRender | undefined;
  cur_raster_i!: number;

  gui!: ui.UI;
  gui2!: ui.UI;

  relaxtimer: number | undefined;
  tick_timer: number | undefined;

  constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.bluenoise = new bluenoise.BlueNoise();
    this.drawer = new draw.Drawer(this);
    this.image = undefined;
    this.outimage = undefined;

    this.canvas = canvas;
    this.g = g;
    this.channel = 0;
    this.color = "black";

    this.drawlines = [];
  }

  get gridsize() {
    throw new Error("Refactor error!");
  }

  get cells() {
    throw new Error("Refactor error!");
  }

  get grid() {
    throw new Error("Refactor error!");
  }

  get celldim() {
    throw new Error("Refactor error!");
  }

  get depth() {
    throw new Error("Refactor error!");
  }

  make_drawline(v1: ArrayLike<number>, v2: ArrayLike<number>) {
    this.drawlines.push(v1[0]);
    this.drawlines.push(v1[1]);
    this.drawlines.push(v2[0]);
    this.drawlines.push(v2[1]);
  }

  reset_drawlines() {
    this.drawlines = [];
  }

  on_load() {
    this.cur_raster_i = 0;

    let indexmap: number[] = [];

    if (this.image === undefined && "startup_image_bn4" in localStorage) {
      this.image = new Image();
      this.image.src = localStorage.startup_image_bn4;
      let this2 = this;

      this.image.onload = function () {
        this2.on_image_read(this2.image!, function () {
          this2.source_image_read(this2.image!);
        });
      };
    } else if (!("startup_image_bn4" in localStorage)) {
      this.loadFlowerSvg();
    }

    this.bluenoise.init(config.DIMEN);
  }

  init() {
    this.bluenoise.init(config.DIMEN);
  }

  reset() {
    colors.gen_colors();

    config.USE_LAB = config.COLOR_SPACE === colors.ColorSpaces.LAB;
    // config.COLOR_SPACE is stored as a plain number; narrow it to the ColorSpace union.
    colors.setColorSpace(config.COLOR_SPACE as colors.ColorSpace);

    colors.gen_closest_map();

    if (config.RASTER_IMAGE) {
      let size = ~~(
        config.SCALE * Math.min(this.canvas.width, this.canvas.height)
      );
      size = config.DIMEN;

      let size2 = size;

      this.outimage = new ImageData(size2, size2);
      let img = this.outimage;

      let iview = new Int32Array(img.data.buffer);

      img.data[0] = img.data[1] = img.data[2] = 255;
      img.data[3] = 255;

      iview.fill(iview[0], 0, iview.length);
    } else if (config.HIGH_QUALITY_RASTER) {
      this.hqrender = new render.CircleRender(
        this.canvas.width,
        this.canvas.height,
      );
    }

    this.bluenoise.reset(config.RASTER_IMAGE ? this.outimage : undefined);
    this.drawer.reset(config.RASTER_IMAGE ? this.outimage : undefined);
  }

  draw() {
    let dpi = devicePixelRatio;

    let w = ~~((window.innerWidth - 35) * dpi);
    let h = ~~((window.innerHeight - 35) * dpi);
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style["width"] = w / dpi + "px";
    this.canvas.style["height"] = h / dpi + "px";

    if (config.HIGH_QUALITY_RASTER && this.hqrender === undefined) {
      this.hqrender = new render.CircleRender(
        this.canvas.width,
        this.canvas.height,
      );
    } else if (config.HIGH_QUALITY_RASTER) {
      this.hqrender!.reset();
    }

    // Drawer.draw is typed for a 2D context; CircleRender is a drawing-context-like
    // stand-in the renderer accepts at runtime, so cast through it here.
    this.drawer.draw(
      config.HIGH_QUALITY_RASTER
        ? (this.hqrender! as unknown as CanvasRenderingContext2D)
        : this.g,
    );

    if (config.HIGH_QUALITY_RASTER) {
      this.hqrender!.render();
      this.g.putImageData(this.hqrender!.image, 0, 0);
    }

    if (
      config.SHOW_IMAGE &&
      this.image !== undefined &&
      this.image.data !== undefined
    ) {
      this.g.putImageData(this.image.data, 25, 25);
    }

    if (config.SHOW_DVIMAGE && this.bluenoise.dvimage !== undefined) {
      this.g.putImageData(this.bluenoise.dvimage, 25, 25);
    }
  }

  on_keydown(e: KeyboardEvent) {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 68: //dkey
        this.bluenoise.step();

        window.redraw_all();

        console.log("DONE");
        break;
      case 75: //kkey
        console.log("relax");
        this.bluenoise.relax();
        //console.log("spectrum");
        //this.calc_spectrum();
        window.redraw_all();
        break;
      case 76: //lkey
        this.bluenoise.colordiffuse();
        window.redraw_all();
        break;
      case 82: //rkey
        this.init();
        this.reset();
        colors.gen_colors();

        window.redraw_all();
        break;
    }
  }

  renderImage(
    canvas?: HTMLCanvasElement,
    g?: CanvasRenderingContext2D | null,
    drawBG = true,
  ): Promise<HTMLCanvasElement> {
    let size = config.RENDERED_IMAGE_SIZE;
    let oldscale = config.SCALE;

    config.SCALE = 1.0;

    console.log("rendering image. . .");

    let asp = window._appstate.image.width / window._appstate.image.height;
    let w: number, h: number;

    if (config.RASTER_IMAGE) {
      size = window._appstate.outimage.width;
    }

    if (asp > 1.0) {
      w = size;
      h = size / asp;
    } else {
      w = size * asp;
      h = size;
    }

    if (!canvas) {
      canvas = document.createElement("canvas");
      g = canvas.getContext("2d");
    }

    // Both branches above (or the caller) guarantee these are present at runtime.
    const canvas2 = canvas!;
    const g2 = g!;

    canvas2.width = w;
    canvas2.height = h;

    //make sure we have white background, not zero alpha
    if (drawBG) {
      g2.beginPath();
      g2.rect(0, 0, w, h);
      g2.fillStyle = config.BLACK_BG ? "black " : "white";
      g2.fill();
    }

    let scale = 0.5 * Math.max(w, h); //canvas.width, canvas.height);

    g2.scale(scale, scale);
    if (asp > 1.0) {
      g2.translate(1.0, 1.0);
    } else {
      g2.translate(1.0, 1.0);
    }

    if (config.RASTER_IMAGE) {
      g2.putImageData(window._appstate.outimage, 0, 0);
    } else if (config.DRAW_STICKS) {
      window._appstate.drawer.draw_sticks(g2);
    } else if (config.TRI_MODE) {
      window._appstate.drawer.tri_mode_draw(g2);
    } else {
      window._appstate.drawer.draw_points(g2);
    }

    console.log("finished rendering image");
    config.SCALE = oldscale;

    return new Promise((accept, reject) => {
      accept(canvas2);
    });
  }

  toJSON() {
    return {
      APP_VERSION: APP_VERSION,
      settings: cconst.toJSON(),
    };
  }

  loadJSON(json: {
    settings: Record<string, unknown>;
    APP_VERSION: number;
    STICK_ROT: number;
  }) {
    cconst.loadJSON(json.settings);

    if (json.APP_VERSION < 0.6) {
      json.STICK_ROT = (json.STICK_ROT / 180.0) * Math.PI;
    }
  }

  save() {
    localStorage.startup_file_bn6 = JSON.stringify(this);
  }

  load() {
    try {
      this.loadJSON(JSON.parse(localStorage.startup_file_bn6));
    } catch (error) {
      util.print_stack(error as Error);
    }
  }

  store_bluenoise_mask() {
    new indexdb_store.IndexDBStore("bluenoise_mask").write("data", _image_url);

    //localStorage.startup_mask_bn4 = _image_url;
  }

  on_filechange(e: Event, files: FileList) {
    console.log("got file", e, files);
    if (files.length === 0) return;

    let reader = new FileReader();
    let this2 = this;
    reader.onload = function (e: ProgressEvent<FileReader>) {
      let img: AppImage = new Image();
      const result = e.target!.result as string; // readAsDataURL always yields a string

      img.src = result;

      window._image_url = result;

      this2.on_image_read(img, function () {
        this2.source_image_read(img);
      });
    };

    reader.readAsDataURL(files[0]);
  }

  on_mask_filechange(e: Event, files: FileList) {
    console.log("got file", e, files);

    if (files.length === 0) return;

    let reader = new FileReader();
    let this2 = this;

    reader.onload = function (e: ProgressEvent<FileReader>) {
      let buf = e.target!.result as ArrayBuffer; // readAsArrayBuffer always yields an ArrayBuffer
      let str = "";
      let view = new Uint8Array(buf);

      for (let i = 0; i < view.length; i++) {
        str += String.fromCharCode(view[i]);
      }

      if (!str.startsWith("SMOOTHMASK")) {
        str = btoa(str);
        str = "data:image/png;base64," + str;
      }

      //localStorage.startup_mask_bn4 = e.target.result;
      new indexdb_store.IndexDBStore("bluenoise_mask").write("data", str);
      window._appstate.bluenoise.load_mask(str);
    };

    reader.readAsArrayBuffer(files[0]);
  }

  on_image_read(
    img: AppImage,
    cb?: (img: AppImage) => void,
    thisvar?: unknown,
  ) {
    console.log("got image");
    let this2 = this;

    if (img.width === 0) {
      let timer = window.setInterval(function () {
        if (img.width !== 0) {
          window.clearInterval(timer);
          this2.on_image_read(img, cb, thisvar);

          console.log("delay load imaged");
        }
      }, 500);

      return;
    }

    //extract image data
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let g = canvas.getContext("2d")!;
    g.drawImage(img, 0, 0);

    if (img.width === 0) {
      console.log("eek", img.width, img.height);
      return;
    }

    let data = g.getImageData(0, 0, img.width, img.height);
    img.data = data;

    if (cb === undefined) return;

    if (thisvar === undefined) cb(img);
    else cb.call(thisvar, img);
  }

  clearData() {
    new indexdb_store.IndexDBStore("bluenoise_mask").clear();
    delete localStorage.startup_image_bn4;
    delete localStorage.startup_file_bn6;

    this.gui.clearData();
    this.gui2.clearData();

    console.log("Cleared saved data");
  }

  loadFlowerSvg() {
    // NOTE: the original used the non-standard `import(spec, cb)` callback form,
    // whose callback never fires (and reassigned a const), so the built-in
    // flower default never actually loaded. Use the standard promise form.
    import("./flowersData.js").then((mod) => {
      const svg = mod.default;
      let img = document.createElement("img");
      const url = "data:image/svg+xml," + escape(svg);

      img.src = url;

      img.onload = () => {
        console.log("Loaded flower image!");
        this.image = img;
        this.on_image_read(img, () => {
          this.source_image_read(img);
        });
      };
    });
  }

  source_image_read(img: AppImage) {
    //this.bluenoise.reset();
    this.image = img;

    //if (IMAGE_PALETTE) {
    //colors.gen_colors();
    //}

    try {
      localStorage.startup_image_bn4 = img.src;
    } catch (error) {
      console.log("Failed to cache image data");
    }

    this.reset();
    window.redraw_all();
  }

  on_tick() {
    let key = `${devicePixelRatio}:${window.innerWidth}:${window.innerHeight}`;

    if (this.#last_size_key !== key) {
      this.#last_size_key = key;
      this.draw();
    }

    this.gui.on_tick();
    this.gui2.on_tick();
  }

  makeGUI() {
    //these bind functions bind constants from const.js.
    //they typically take the constant name (converted to lowercase)
    //as their first argument
    // The GUI binds its controls to whatever "state" object it is given; point
    // it at the config singleton so every slider/checkbox reads & writes config.
    // UI treats its state object as a dynamic string-keyed bag; the Config interface
    // has no index signature, so present it as one for the constructor.
    const stateObj = config as unknown as Record<string, unknown>;
    let gui2 = (this.gui2 = new ui.UI(
      "ui2_bn6",
      stateObj,
      undefined,
      undefined,
      undefined,
    ));
    let gui = (this.gui = new ui.UI(
      "ui1_bn6",
      stateObj,
      undefined,
      undefined,
      undefined,
    ));

    window.gui = gui;

    let cpanel = gui.panel("Actions");

    cpanel.button("step", "Run", function () {
      window._appstate.bluenoise.step();
      window.redraw_all();
    });

    cpanel.button("load_image", "Load Image", function () {
      let input = document.getElementById("input");
      input!.click();
    });

    cpanel.button("load_mask", "Load Mask", function () {
      let input = document.getElementById("input2");
      input!.click();
    });

    cpanel.button("reset", "Reset", function () {
      colors.gen_colors();
      window._appstate.init();
      window._appstate.reset();

      window.redraw_all();
    });

    cpanel.button("clear", "Clear Saved Data", () => {
      this.clearData();
    });

    let rpanel = gui.panel("Relaxation");

    let sphc = rpanel.panel("Custom SPH Curve");

    config.SPH_CURVE = sphc.curve("SPH_CURVE", "Custom SPH Curve").curve;
    sphc.check("USE_SPH_CURVE", "Use SPH Curve");
    sphc.close();

    rpanel.button("relax", "Relax", () => {
      window._appstate.bluenoise.relax();
      window.redraw_all();
    });

    let relaxbut = rpanel.button("relax_loop", "Start Loop", () => {
      if (window._appstate.relaxtimer !== undefined) {
        (relaxbut.domElement as HTMLElement).parentNode!.children[0].innerHTML =
          "Start Loop";
        console.log("stopping timer");

        window.clearInterval(window._appstate.relaxtimer);
        window._appstate.relaxtimer = undefined;

        return;
      }

      (relaxbut.domElement as HTMLElement).parentNode!.children[0].innerHTML =
        "Stop Loop";

      window._appstate.relaxtimer = window.setInterval(() => {
        window._appstate.bluenoise.relax();
        window.redraw_all();
      }, 100);
    });

    window.relaxbut = relaxbut;

    rpanel.check("ANISOTROPY", "Anisotropic");
    rpanel.slider(
      "FILTERWID",
      "Filter Wid",
      3.0,
      0.001,
      7.0,
      0.001,
      false,
      false,
    );
    rpanel.slider(
      "ANISOTROPY_FILTERWID",
      "AnisotropicFilterWid",
      3.0,
      0.001,
      7.0,
      0.001,
      false,
      false,
    );
    rpanel.slider(
      "RELAX_SPEED",
      "Relax Speed",
      1.0,
      0.001,
      8.0,
      0.001,
      true,
      false,
    );
    rpanel.check("RELAX_UPDATE_VECTORS", "Update Vectors");

    let spanel = gui.panel("Settings");
    let panel = gui;

    spanel.slider("DIMEN", "Density", 32, 1, 2048, 1, true, false);
    spanel.slider("STEPS", "Points Per Step", 32, 1, 50000, 1, true, false);
    spanel.slider("DRAW_RMUL", "Point Size", 1.0, 0.1, 8.0, 0.01, false, true);
    spanel.slider(
      "RAND_FAC",
      "Added Random",
      0.0,
      0.0,
      3.0,
      0.005,
      false,
      true,
    );
    spanel.check("HIGH_QUALITY_RASTER", "HQ Renderer");

    spanel.check("SHOW_KDTREE", "Show kdtree");
    spanel.check("SCALE_POINTS", "Radius Scale");
    spanel.check("TRI_MODE", "Triangle Mode");

    let apanel = panel.panel("Stick Mode");
    apanel.check("DRAW_STICKS", "Draw Sticks");
    apanel.check("FANCY_STICKS", "Fancy Strokes");
    apanel.check("STICK_ARROWS", "Use Arrows");
    apanel.slider("STICK_ROT", "StickRot", 0.0, -180, 180, 0.0001, false, true);
    apanel.slider(
      "STICK_WIDTH",
      "StickWidth",
      0.0,
      0.0001,
      12.0,
      0.0001,
      false,
      true,
    );
    apanel.slider(
      "STICK_LENGTH",
      "StickLength",
      0.0,
      0.0001,
      12.0,
      0.0001,
      false,
      true,
    );
    apanel.slider("ANIS_W1", "W1", 0.0, -2.0, 2.0, 0.0001, false, false);
    apanel.slider("ANIS_W2", "W2", 0.0, -2.0, 2.0, 0.0001, false, false);
    apanel.close();

    let dpanel = panel.panel("Dithering");
    dpanel.check("DITHER_COLORS", "Dither Colors");
    dpanel.slider(
      "DITHER_RAND_FAC",
      "Dither Random",
      0.0,
      0.0,
      9.0,
      0.005,
      false,
      false,
    );
    dpanel.check("DITHER_BLUE", "Blue Noise");
    dpanel.slider(
      "DITHER_BLUE_STEPS",
      "Dither Uniformity",
      6.0,
      0.0,
      256.0,
      0.005,
      true,
      false,
    );

    let fpanel = panel.panel("Image Filtering");
    fpanel.check("HIST_EQUALIZE", "EqualizeHistogram");
    fpanel.check("DEBAND_IMAGE", "Blur Derivatives");
    fpanel.slider("DEBAND_RADIUS", "Blur Radius", 15, 1, 90, 1, true, false);
    fpanel.slider(
      "DEBAND_BLEND",
      "BlendWithOriginal",
      0.0,
      0,
      1,
      0.0001,
      false,
      false,
    );

    fpanel.check("SHARPEN", "Sharpen");
    fpanel.slider("SHARPNESS", "Sharpness", 0.5, 0.0, 3.5, 0.001, false, false);
    fpanel.check("SHARPEN_LUMINENCE", "Luminence Only");
    //fpanel.check('USE_LAB', 'Use Lab Space');

    fpanel.listenum(
      "COLOR_SPACE",
      "Space",
      colors.ColorSpaces,
      config.COLOR_SPACE,
    );

    fpanel.close();

    let panel2 = gui.panel("Save Tool");
    panel2.button("save_img", "Save Image", () => {
      window._appstate.renderImage().then((canvas: HTMLCanvasElement) => {
        canvas.toBlob((blob: Blob | null) => {
          let url = URL.createObjectURL(blob!);

          window.open(url);
        });
      });
    });

    panel2.slider(
      "RENDERED_IMAGE_SIZE",
      "Rendered Image Size",
      1024,
      1,
      4096,
      1,
      true,
      false,
    );

    panel2 = gui.panel("Canvas Position");
    panel2.slider("SCALE", "Scale", 1.0, 0.05, 5.0, 0.01, false, true);
    panel2.slider("PANX", "Pan X", 0.0, -1.5, 1.5, 0.01, false, true);
    panel2.slider("PANY", "Pan Y", 0.0, -1.5, 1.5, 0.01, false, true);

    let panel3 = gui.panel("Export SVG");
    panel3.button("save_svg", "Save SVG", () => {
      console.log("Export SVG!");

      let data = exportsvg.exportSVG(this);

      let a = document.createElement("a");

      //data = "data:image/svg;charset=US-ASCII," + encodeURI(data);
      //a.setAttribute("href", data);

      let blob = new Blob([data], { type: "image/svg" });
      let url = URL.createObjectURL(blob);

      a.setAttribute("download", "render.svg");
      a.setAttribute("href", url);

      a.click();
    });

    panel = gui2.panel("More Options");
    panel2 = panel.panel("General");

    panel3 = panel2.panel("Tone Curve");
    // DefaultCurves stores serialized curve presets; curve() consumes them as its
    // (non-exported) CurveJSON shape, so route through the method's parameter type.
    config.TONE_CURVE = panel3.curve(
      "TONE_CURVE",
      "Tone Curve",
      cconst.DefaultCurves.TONE_CURVE as unknown as Parameters<
        typeof panel3.curve
      >[2],
    ).curve;
    panel3.close();

    panel3 = panel2.panel("Density Curve");
    config.DENSITY_CURVE = panel3.curve(
      "DENSITY_CURVE",
      "Density Curve",
      cconst.DefaultCurves.DENSITY_CURVE as unknown as Parameters<
        typeof panel3.curve
      >[2],
    ).curve;
    panel3.close();

    panel2.check("SHOW_IMAGE", "Show Image");
    panel2.check("SHOW_DVIMAGE", "Show DvImage");
    panel2.check("SHOW_RAW_IMAGE", "Raw Image");

    panel2.check("SHOW_COLORS", "Show Colors");
    panel2.check("ADAPTIVE_COLOR_DENSITY", "Denser For Color");
    panel2.check("HEXAGON_MODE", "Hexagonish");
    panel2.check("GRID_MODE", "Grid Like");

    panel3 = panel2.panel("Simple Raster");
    panel3.check("RASTER_IMAGE", "Enable");

    let rastermode = "";
    for (let k in RASTER_MODES) {
      if (RASTER_MODES[k as keyof typeof RASTER_MODES] === config.RASTER_MODE) {
        rastermode = k;
        break;
      }
    }

    console.log("SDFSDFSDF", rastermode);

    panel3.listenum("RASTER_MODE", "Mode", RASTER_MODES, rastermode);
    panel3.check("USE_CMYK_MASK", "CMYK Masksheet");

    panel2.check("MAKE_NOISE", "Make Noise (to test relax)");
    panel2.check("SMALL_MASK", "Small Mask Mode");
    panel2.check("XLARGE_MASK", "Extra Large Mask Mode");
    panel2.check("SPECIAL_OFFSETS", "Use Encoded Offsets");

    panel2.check("USE_MERSENNE", "Psuedo Random");
    panel2.check("BLACK_BG", "Black BG");

    panel2 = panel.panel("Palette");
    panel2.slider(
      "PAL_COLORS",
      "Number of Colors (Times 9)",
      4,
      1,
      32,
      1,
      true,
      false,
    );
    panel2.check("ALLOW_PURPLE", "Include Purple In Palette");
    panel2.check("ALLOW_GREY", "Include Grey In Palette");
    panel2.check("SIMPLE_PALETTE", "Simple Palette");
    panel2.check("IMAGE_PALETTE", "PaletteFromImage");
    panel2.check("BG_PALETTE", "Black/white only");

    let load_value = "built-in-smooth";

    panel2 = panel.panel("Blue Noise Mask");
    panel2.listenum(
      undefined,
      "Mask",
      {
        "Built In Smooth": "built-in-smooth",
        "Built In": "built-in",
        "Large 2": "mask_large_2.png",
        "Large 2 (smoothed)": "mask_large_2_smoothed.png",
        "Large 1 (only 16 levels)": "mask_large.png",
        "Small 1 (only 16 levels)": "mask.png",
        "Weighted Sample Removal": "weighted_sample_removal_mask_1.png",
      },
      "built-in-smooth",
      function (value: string | number) {
        load_value = value as string;
      },
    );

    panel2.button("load_mask", "Load", function () {
      let value = load_value;

      if (value === "built-in-smooth") {
        console.log("Reloading built-in blue noise mask. . .");

        //localStorage.startup_mask_bn4 = blue_mask_file;
        new indexdb_store.IndexDBStore("bluenoise_mask").write(
          "data",
          smoothmask_file,
        );

        window._appstate.bluenoise.load_mask(smoothmask_file);
      } else if (value === "built-in") {
        console.log("Reloading built-in blue noise mask. . .");
        //localStorage.startup_mask_bn4 = blue_mask_file;
        new indexdb_store.IndexDBStore("bluenoise_mask").write(
          "data",
          blue_mask_file,
        );

        window._appstate.bluenoise.load_mask(blue_mask_file);
      } else {
        let path = "examples/" + value;
        let base = document.location.pathname;

        while (base.length > 0 && !base.endsWith("/")) {
          base = base.slice(0, base.length - 1);
        }

        if (base.length !== 0) {
          base = base.slice(1, base.length);
        }

        path = base + path;
        let promise = util.fetch_file(path, true);

        promise.then(function (rawData) {
          //turn into data url
          // fetch_file(path, true) resolves with an ArrayBuffer.
          const buf = rawData as ArrayBuffer;
          console.log("DATA LEN1", buf.byteLength);
          const bytes = new Uint8Array(buf);

          let s = "";
          for (let i = 0; i < bytes.length; i++) {
            s += String.fromCharCode(bytes[i]);
          }

          let data = btoa(s);
          console.log(data.slice(0, 100));

          if (!data.startsWith("SMOOTHMASK"))
            data = "data:image/png;base64," + data;

          //localStorage.startup_mask_bn4 = data;
          new indexdb_store.IndexDBStore("bluenoise_mask").write("data", data);
          window._appstate.bluenoise.load_mask(data);
        });
      }
    });

    panel2 = panel.panel("Misc");
    panel2.check("DRAW_TRANSPARENT", "Accumulation Mode");
    panel2.slider(
      "ACCUM_ALPHA",
      "Accum Alpha",
      1.0,
      0.001,
      1.0,
      0.001,
      false,
      true,
    );
    panel2.check("CORRECT_FOR_SPACING", "Correct_For_Spacing");
    panel2.check("LOW_RES_CUBE", "Low Res Cube");

    //.slider will have loaded store setting from localStorage,
    //if it exists
    colors.gen_colors();

    gui.load();
    gui2.load();
  }
}

window.addEventListener("keydown", function (e) {
  window._appstate.on_keydown(e);
});

export function start() {
  console.log("loaded!");

  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth - 30;
  canvas.height = window.innerHeight - 25;

  let g = canvas.getContext("2d")!;

  window._appstate = new AppState(g, canvas);
  window._appstate.load();

  let animreq: number | undefined = undefined;

  window.redraw_all = function () {
    if (animreq !== undefined) return;

    animreq = requestAnimationFrame(function () {
      animreq = undefined;

      let g = window._appstate.g;
      let canvas = window._appstate.canvas;
      g.clearRect(0, 0, canvas.width, canvas.height);

      window._appstate.draw();
    });

    window.redraw_all();
  };

  window._appstate.makeGUI();
  window._appstate.init();

  window._appstate.tick_timer = window.setInterval(() => {
    window._appstate.on_tick();
  }, 400);

  (document.getElementById("input") as HTMLInputElement).addEventListener(
    "change",
    function (this: HTMLInputElement, e) {
      console.log("file!", e, this.files);

      window._appstate.on_filechange(e, this.files);
    },
  );

  (document.getElementById("input2") as HTMLInputElement).addEventListener(
    "change",
    function (this: HTMLInputElement, e) {
      console.log("file!", e, this.files);

      window._appstate.on_mask_filechange(e, this.files);
    },
  );

  window._appstate.on_load();
}
