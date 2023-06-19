export function RGBToHex(rgb: string) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    const _rgb = rgb.substr(4).split(")")[0].split(sep);
    let r = (+_rgb[0]).toString(16),
        g = (+_rgb[1]).toString(16),
        b = (+_rgb[2]).toString(16);
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    return (r + g + b).toUpperCase();
  }