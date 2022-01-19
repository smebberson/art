// #0ceba6
// 000551005154006207006204007907012004015704018406022576025509027761031904034704037404038868044704048904049204043209042658039009033704031204028485023809019557016604
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

    const column = ({ height = 0, randomMax }) => {
        const opacity = Math.floor(Math.random() * 100) / 100;
        const colorOpacity = Math.min(Math.max(opacity, 0.4), 0.9);
        const [, opacityDecimal] = String(colorOpacity).split('.');

        return `${String(
            height + Math.floor((Math.random() * randomMax) / 2)
        ).padStart(4, '0')}${opacityDecimal.padStart(2, '0')}`;
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
        const columns = [column({ randomMax: 2160 / 4 })];
        const yVariationMax = 120;
        const columnVariationMax = 8;

        generated += `${color.toHexString()}\n`;

        for (let x = 1; x < xCount; x++) {
            const [height] = parseColumn(columns[x - 1]);
            let randomMax =
                x <
                (xCount / 3) * 2 +
                    Math.floor(Math.random() * columnVariationMax) -
                    columnVariationMax / 2
                    ? yVariationMax
                    : 0 - yVariationMax;
            columns.push(column({ height, randomMax }));
        }
        generated += `${columns.join('')}\n`;
    };

    const parseColumn = (data) => {
        const height = parseInt(data.substring(0, 4), 10);
        const opacityInt = parseInt(data.substring(5), 10);
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
                    height
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
