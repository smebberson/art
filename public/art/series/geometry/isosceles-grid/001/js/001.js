// #f09b68#d68b5d#bd7a52#a36a47#8a593c#704931
// 2100524551310230555121223434141355154431304253
// 2550433502130205350540152552405155554205150443
// 2230302520145231230320233535034104353523330132
// 5115234441220403513353104440044404113233313325
// 3235455404244212230402252025014025431211124113
// 1134401054322010342351043440323154033100122152
// 3451311410150142553453535110005523512052345113
// 5445004251342113110151145302444433232535300425
// 3324222221053353041451310002440223001440310100
// 1013032150355002340515345353130550504555225501
// 4335222440045543314353302332200311405351135155
// 2211352551023534030300013305243523312451231544
// 3411515250325423231014152200544430052344413312
// 3354510123331303350221214400310044333010114331
// 5132550003113502120204043551410430310353344100
// 3023205525305515504014550333544422004155450404
// 3050204000135324042413152404350354220114532504
// 1111234154503243504152245255205450541155552223
// 5244013532501251552304152334542221541513032014
// 4412111030422242021123544122134002505403542353
// 0430423503402433153202335000021402241015525123
// 5544534544423132230022453031154103210335431335
// 5331342250413231152332332151051500252214445001
// 2505554123350235020402045211023514402014013244
// 2113123243134030201501121231000204205500105315
// 3435451523201440415532400004532123551121440505
// 2010311105353350404533504230331010132102142214
// 5451434315514253550435112200351030053525423403
// 2531143135521232152254122550302422225015004112
// 0313550044034134321030215314135552522314155123
// 3322132523102410024545055131055441312041242043
// 3133403225453250414420430045404412325525404435
// 0142140133343425003002324431253011300055111331
// 1411401155201215331003310143345450420354042115
// 0243354122413345401531350202350245253115211240
// 3111340211251423010210400252521410352320434104
// 4355120315001053325215052415341451354540322320
// 2245321420252022053151214444421134352415344310
// 2515415522452043400102005413022552551305204133
// 3132311313530525212302112133405420514334224421

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
            paint();
        }

        if (event.key === 'C') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(generated);
            }
        }
    });

    const clear = () => {
        c.paper.clear();
    };

    const blueprint = () => {
        const rect = d.getElementById(el).getBoundingClientRect();
        const colors = tinycolor(randomColor().hex())
            .monochromatic(10)
            .sort(
                (a, b) =>
                    deconstructColor({ hex: a.toHexString() }).luma -
                    deconstructColor({ hex: b.toHexString() }).luma
            )
            .reverse()
            .slice(0, -4);

        // number of triangles on the x-axis
        const xCount = Math.ceil(rect.width / attrs.triangle.width) + 1;
        const yCount = Math.ceil(rect.height / attrs.triangle.height) + 1;

        generated += `${colors.map((hsl) => hsl.toHexString()).join('')}\n`;

        // loop horizontally
        for (let horz = 0; horz < xCount; horz++) {
            if (horz > 0) {
                generated += '\n';
            }

            for (let vert = 0; vert < yCount; vert++) {
                // we do two triangles, one the right way up, and one upside down

                // return a number, at-most 5
                const triangleColorIndex = Math.floor(
                    Math.random() * colors.length
                );

                // upside down triangle
                const upsideDownTriangleColorIndex = Math.floor(
                    Math.random() * colors.length
                );
                generated += `${upsideDownTriangleColorIndex}${triangleColorIndex}`;
            }
        }
    };

    const triangle = (c, type) =>
        type === 'u'
            ? c.paper.polygon([
                  attrs.triangle.width / 2,
                  0,
                  attrs.triangle.width,
                  attrs.triangle.height,
                  0,
                  attrs.triangle.height,
                  attrs.triangle.width / 2,
                  0,
              ])
            : c.paper.polygon([
                  0,
                  0,
                  attrs.triangle.width / 2,
                  attrs.triangle.height,
                  attrs.triangle.width,
                  0,
                  0,
                  0,
              ]);

    const paint = () => {
        const [colorsList, ...rows] = generated.split('\n');
        const colors = colorsList
            .substr(1)
            .split('#')
            .map((hex) => `#${hex}`);
        const color = (index) => colors[Math.floor(index)];

        rows.forEach((str, rowIndex) => {
            str.split('').forEach((col, colIndex) => {
                const direction = colIndex % 2 === 0 ? 'd' : 'u';
                const triangleColor = color(Number(col));
                const offset = -50;

                triangle(c, direction)
                    .attr({
                        fill: triangleColor,
                        stroke: triangleColor,
                        'stroke-width': 0.9,
                    })
                    .transform(
                        `translate(${
                            (colIndex * attrs.triangle.width) / 2 + offset
                        },${rowIndex * attrs.triangle.height})`
                    );
            });
        });
    };

    d.addEventListener('DOMContentLoaded', () => {
        c = Snap('#' + el);
        blueprint();
        paint();
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
