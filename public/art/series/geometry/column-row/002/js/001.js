// #5efece
// 003501003601004015004702005825007503009935013004016945021705027555034306042265051107061275072408084885098209112795128309091285062171041157027642020428017301
((w, d, el, attrs) => {
    let c = null;
    let generated = '';

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

    d.addEventListener('keyup', (event) => {
        if (event.key === 'D') {
            const rect = d.getElementById(el).getBoundingClientRect();
            console.log({
                el,
                height: rect.height,
                name: w.name,
                width: rect.width,
            });
        }

        if (event.key === 'P') {
            generated = prompt('Paste in your artworks code.');
            clear();
            paint(generated);
        }

        if (event.key === 'R') {
            generated = '';
            clear();
            blueprint();
            paint(generated);
        }

        if (event.key === 'C') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(generated);
            }
        }

        if (event.key === 'S') {
            if (navigator.clipboard) {
                c.paper.node.setAttribute('viewBox', '0 0 3840 2160');
                navigator.clipboard.writeText(c.paper.toString());
            }
        }
    });

    const clear = () => {
        c.paper.clear();
    };

    const column = ({ height = 0, randomMax = 0, opacity = 0.9 }) => {
        const [, opacityDecimal] = String(opacity).split('.');

        let columnHeight = height;

        if (randomMax) {
            columnHeight = height + Math.floor((Math.random() * randomMax) / 2);
        }

        return `${String(columnHeight).padStart(4, '0')}${String(opacityDecimal)
            .substring(0, 2)
            .padStart(2, '0')}`;
    };

    const easeInQuad = (t) => t * t;
    const easeInCubic = (t) => t * t * t;
    const easeInSine = (t) => 1 - Math.cos((t * Math.PI) / 2);

    const heightScale = ({ from, to, step, steps }, type = 'linear') => {
        const delta = (to - from) / steps;

        return type === 'linear'
            ? Math.floor(from + delta * step)
            : Math.floor(from + delta * step * easeInSine(step / steps));
    };

    const blueprint = () => {
        const rect = d.getElementById(el).getBoundingClientRect();
        const [color] = tinycolor(randomColor().hex())
            .monochromatic(10)
            .sort(
                (a, b) =>
                    deconstructColor({ hex: a.toHexString() }).luma -
                    deconstructColor({ hex: b.toHexString() }).luma
            )
            .reverse();
        const xCount = Math.floor(rect.width / attrs.column.width);
        const columns = [];
        const firstColumn = column({ randomMax: 2160 / 4, opacity: 0.1 });
        const [firstColumnHeight] = parseColumn(firstColumn);
        const largestColumn = column({
            height: 2160 / 2,
            randomMax: 2160 / 2,
            opacity: 0.9,
        });
        const [largestColumnHeight] = parseColumn(largestColumn);
        const lastColumn = column({ randomMax: 2160 / 4, opacity: 0.1 });
        const [lastColumnHeight] = parseColumn(lastColumn);
        const columnVariationMax = 8;

        const largestColumnIndex =
            (xCount / 3) * 2 +
            Math.floor(Math.random() * columnVariationMax) -
            columnVariationMax / 2;

        generated += `${color.toHexString()}\n`;

        for (let x = 1; x < xCount; x++) {
            if (x === 1) {
                columns.push(firstColumn);
            }
            if (x === largestColumnIndex) {
                columns.push(largestColumn);
            }
            if (x === xCount - 1) {
                columns.push(lastColumn);
            }
            if (x > 1 && x < largestColumnIndex) {
                const step = x;
                const steps = largestColumnIndex;

                columns.push(
                    column({
                        height: heightScale(
                            {
                                from: firstColumnHeight,
                                to: largestColumnHeight,
                                step,
                                steps,
                            },
                            'ease'
                        ),
                        opacity: step / steps,
                    })
                );
            }
            if (x > largestColumnIndex && x !== xCount - 1) {
                const step = xCount - x;
                const steps = xCount - largestColumnIndex;

                columns.push(
                    column({
                        height: heightScale(
                            {
                                from: lastColumnHeight,
                                to: largestColumnHeight,
                                step,
                                steps,
                            },
                            'ease'
                        ),
                        opacity: step / steps,
                    })
                );
            }
        }
        generated += `${columns.join('')}\n`;
    };

    const parseColumn = (data) => {
        const height = parseInt(data.substring(0, 4), 10);
        const opacityInt = parseInt(data.substring(4), 10);
        const opacity = (opacityInt < 10 ? opacityInt * 10 : opacityInt) / 100;

        return [height, opacity];
    };

    const paint = (data = '') => {
        const dataChars = 6;
        const rect = d.getElementById(el).getBoundingClientRect();
        const [color, columns] = data.split('\n');

        for (
            let charIndex = 0, columnNum = 0;
            charIndex < columns.length;
            charIndex += dataChars, columnNum += 1
        ) {
            const [height, colorOpacity] = parseColumn(
                columns.substring(charIndex, charIndex + dataChars)
            );

            c.paper
                .rect(
                    columnNum * attrs.column.width,
                    rect.height / 2 - height / 2,
                    attrs.column.width,
                    height,
                    20,
                    20
                )
                .attr({
                    fill: color,
                    'fill-opacity': colorOpacity,
                });
        }
    };

    d.addEventListener('DOMContentLoaded', () => {
        c = Snap('#' + el);
        blueprint();
        paint(generated);
    });
})(window, document, 'canvas', {
    column: {
        width: 142,
    },
});
