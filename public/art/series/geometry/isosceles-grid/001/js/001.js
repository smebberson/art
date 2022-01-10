((w, d, el, attrs) => {
    const randomColor = () => {
        const digits = '0123456789abcdef';
        let code = '#';

        for (var i = 0; i < 6; i++) {
            code += digits.charAt(Math.floor(Math.random() * 16));
        }

        return chroma(code);
    };

    const deconstructColor = (colorObj) => {
        //adapted from http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
        const hex = colorObj.hex.substring(1);
        /* Get the RGB values to calculate the Hue. */
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        /* Getting the Max and Min values for Chroma. */
        const max = Math.max.apply(Math, [r, g, b]);
        const min = Math.min.apply(Math, [r, g, b]);

        /* Variables for HSV value of hex color. */
        const chr = max - min;
        const val = max;
        let hue = 0;
        let sat = 0;

        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr / val;
            if (sat > 0) {
                if (r == max) {
                    hue = 60 * ((g - min - (b - min)) / chr);
                    if (hue < 0) {
                        hue += 360;
                    }
                } else if (g == max) {
                    hue = 120 + 60 * ((b - min - (r - min)) / chr);
                } else if (b == max) {
                    hue = 240 + 60 * ((r - min - (g - min)) / chr);
                }
            }
        }

        colorObj.chroma = chr;
        colorObj.hue = hue;
        colorObj.sat = sat;
        colorObj.val = val;
        colorObj.luma = 0.3 * r + 0.59 * g + 0.11 * b;
        colorObj.red = r;
        colorObj.green = g;
        colorObj.blue = b;

        return colorObj;
    };

    d.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            // Create the canvas to draw on, and alias it globally
            const c = (w.c = Snap('#' + el));
            const rect = d.getElementById(el).getBoundingClientRect();
            const colorsCount = 6;

            // number of triangles on the x-axis
            const xCount = Math.ceil(rect.width / attrs.triangle.width) + 1;
            const yCount = Math.ceil(rect.height / attrs.triangle.height) + 1;

            // determine the colours
            // var color = chroma.scale('RdPu').out('hex');
            // var color = chroma.scale([random(),random()]).mode('lch').out('hex');

            // var color = chroma.scale(chroma.interpolate.bezier([randomColor(),randomColor()])).domain([1,4]).mode('lch').correctLightness(true).out('hex');

            // tinycolor
            const color = (() => {
                const _colors = tinycolor(randomColor().hex()).monochromatic(
                    colorsCount + 4
                );

                _colors
                    .sort(
                        (a, b) =>
                            deconstructColor({ hex: a.toHexString() }).luma -
                            deconstructColor({ hex: b.toHexString() }).luma
                    )
                    .reverse()
                    .pop();

                return (index) => _colors[Math.floor(index)].toHexString();
            })();

            // loop horizontally
            for (let horz = 0; horz < xCount; horz++) {
                for (let vert = 0; vert < yCount; vert++) {
                    // we do two triangles, one the right way up, and one upside down

                    // return a number, at-most 5
                    const triangleColor = color(
                        Math.floor(Math.random() * colorsCount)
                    );

                    // Draw the triangle
                    c.paper
                        .polygon([
                            attrs.triangle.width / 2,
                            0,
                            attrs.triangle.width,
                            attrs.triangle.height,
                            0,
                            attrs.triangle.height,
                            attrs.triangle.width / 2,
                            0,
                        ])
                        .attr({
                            fill: triangleColor,
                            stroke: triangleColor,
                            'stroke-width': 0.6,
                        })
                        .transform(
                            'translate(' +
                                horz * attrs.triangle.width +
                                ',' +
                                vert * attrs.triangle.height +
                                ')'
                        );

                    // upside down triangle
                    const upsideDownTriangleColor = color(
                        Math.floor(Math.random() * colorsCount)
                    );

                    // Upside down triangle
                    c.paper
                        .polygon([
                            0,
                            0,
                            attrs.triangle.width / 2,
                            attrs.triangle.height,
                            attrs.triangle.width,
                            0,
                            0,
                            0,
                        ])
                        .attr({
                            fill: upsideDownTriangleColor,
                            stroke: upsideDownTriangleColor,
                            'stroke-width': 0.6,
                        })
                        .transform(
                            'translate(' +
                                (horz * attrs.triangle.width -
                                    attrs.triangle.width / 2) +
                                ',' +
                                vert * attrs.triangle.height +
                                ')'
                        );
                }
            }
        }, 20);
    });
})(window, document, 'canvas', {
    triangle: {
        width: 100,
        height: 100,
    },
    animation: {
        rate: 20,
    },
});
