let __appstate: AppState | undefined = undefined;

import * as util from "./util.js";
import cconst, { config, APP_VERSION, RASTER_MODES } from "./const.js";
import * as bluenoise from "./bluenoise.js";
import * as draw from "./draw.js";
import * as colors from "./colors.js";
import { mount } from "svelte";
import App from "./svelte/App.svelte";
import { Curve } from "./curve.js";
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

  // The three editable curves, created in makeGUI and assigned into config so
  // the solver can read them. Kept here so action methods can reach them too.
  curves!: Record<string, Curve>;

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

    const MAX_DIMEN = 1400;
    let reader = new FileReader();
    let this2 = this;
    reader.onload = function (e: ProgressEvent<FileReader>) {
      let img: AppImage = new Image();
      const result = e.target!.result as string; // readAsDataURL always yields a string

      img.onload = function () {
        const max = Math.max(img.width, img.height);

        // Enforce a maximum image dimension; downscale oversized images so the
        // larger side is at most MAX_DIMEN before they enter the pipeline.
        if (max > MAX_DIMEN) {
          const scale = MAX_DIMEN / max;
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const g = canvas.getContext("2d")!;
          g.drawImage(img, 0, 0, w, h);

          const scaled: AppImage = new Image();
          const url = canvas.toDataURL();
          scaled.src = url;
          window._image_url = url;

          scaled.onload = function () {
            this2.on_image_read(scaled, function () {
              this2.source_image_read(scaled);
            });
          };

          return;
        }

        window._image_url = result;

        this2.on_image_read(img, function () {
          this2.source_image_read(img);
        });
      };

      img.src = result;
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

    // also drop persisted curve state and panel open/closed flags
    for (const id of ["SPH_CURVE", "TONE_CURVE", "DENSITY_CURVE"]) {
      delete localStorage[id];
    }
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("bn6_panel_")) delete localStorage[k];
    }

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
  }

  makeGUI() {
    // Create the three editable curves and assign them into config so the
    // solver (which reads config.SPH_CURVE.evaluate, etc.) sees them. Each
    // curve persists itself to its own localStorage key, matching the original
    // CurveWidget behavior. The dat.gui panels are gone, replaced by the Svelte
    // control rail mounted below.
    const setupCurve = (id: string): Curve => {
      const c = new Curve(id);
      c.setSaveHook(() => {
        try {
          localStorage[id] = JSON.stringify(c);
        } catch (e) {
          /* storage full / unavailable */
        }
        this.save();
      });
      if (id in localStorage) {
        try {
          c.loadJSON(JSON.parse(localStorage[id]));
        } catch (e) {
          console.warn("Failed to load saved curve", id, e);
        }
      }
      c.update();
      return c;
    };

    const curves: Record<string, Curve> = {
      SPH_CURVE: setupCurve("SPH_CURVE"),
      TONE_CURVE: setupCurve("TONE_CURVE"),
      DENSITY_CURVE: setupCurve("DENSITY_CURVE"),
    };
    this.curves = curves;

    config.SPH_CURVE = curves.SPH_CURVE;
    config.TONE_CURVE = curves.TONE_CURVE;
    config.DENSITY_CURVE = curves.DENSITY_CURVE;

    colors.gen_colors();

    const root = document.getElementById("ui-root")!;
    mount(App, {
      target: root,
      props: {
        host: this,
        curves,
      },
    });
  }

  // ---- actions invoked by the Svelte control rail ----
  actionRun() {
    this.bluenoise.step();
    window.redraw_all();
  }

  actionRelax() {
    this.bluenoise.relax();
    window.redraw_all();
  }

  actionReset() {
    colors.gen_colors();
    this.init();
    this.reset();
    window.redraw_all();
  }

  actionClearData() {
    this.clearData();
  }

  actionSaveImage() {
    this.renderImage().then((canvas: HTMLCanvasElement) => {
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        window.open(URL.createObjectURL(blob));
      });
    });
  }

  actionSaveSVG() {
    const data = exportsvg.exportSVG(this);
    const a = document.createElement("a");
    const blob = new Blob([data], { type: "image/svg" });
    const url = URL.createObjectURL(blob);

    a.setAttribute("download", "render.svg");
    a.setAttribute("href", url);
    a.click();
  }

  loadImageDialog() {
    document.getElementById("input")!.click();
  }

  loadMaskDialog() {
    document.getElementById("input2")!.click();
  }

  startRelaxLoop() {
    if (this.relaxtimer !== undefined) return;

    this.relaxtimer = window.setInterval(() => {
      this.bluenoise.relax();
      window.redraw_all();
    }, 100);
  }

  stopRelaxLoop() {
    if (this.relaxtimer !== undefined) {
      window.clearInterval(this.relaxtimer);
      this.relaxtimer = undefined;
    }
  }

  // Loads one of the bundled blue-noise masks (ported from the old dat.gui
  // "Blue Noise Mask" panel's Load button).
  loadMaskByName(value: string) {
    if (value === "built-in-smooth") {
      new indexdb_store.IndexDBStore("bluenoise_mask").write(
        "data",
        smoothmask_file,
      );
      this.bluenoise.load_mask(smoothmask_file);
    } else if (value === "built-in") {
      new indexdb_store.IndexDBStore("bluenoise_mask").write(
        "data",
        blue_mask_file,
      );
      this.bluenoise.load_mask(blue_mask_file);
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

      util.fetch_file(path, true).then((rawData) => {
        const buf = rawData as ArrayBuffer;
        const bytes = new Uint8Array(buf);

        let s = "";
        for (let i = 0; i < bytes.length; i++) {
          s += String.fromCharCode(bytes[i]);
        }

        let data = btoa(s);
        if (!data.startsWith("SMOOTHMASK")) {
          data = "data:image/png;base64," + data;
        }

        new indexdb_store.IndexDBStore("bluenoise_mask").write("data", data);
        this.bluenoise.load_mask(data);
      });
    }
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
