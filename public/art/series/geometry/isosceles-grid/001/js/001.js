// #0ccaee#0bb4d5#0a9ebb#0889a2#077388#065e6f
// 441210140152321042214354013030530550550022003053020322454351532425150353355250
// 410334253233322434120401423055423532354255405105344351455101535240054411111033
// 350421243412114522142515405515403122121114401305402053204403453331543054402233
// 215121401030423544343002015254054415052111030051003350114351035325405140003512
// 325540052231552240432532432343544143532005154325313415343201230124540013033041
// 351325525542523154533025214305330010511002410504032450211242224211521405244232
// 302054302130441521013030523102253250241305422403154113344133013221044254125105
// 001115535432432124545415224421231540521022023143401424021242221323100542322240
// 254020340430444045513444120154224333212025313351410203315050250001412304101023
// 045240350215501314023405251515343513035412321024304433351213124310455041054501
// 340501522255000003054152225243533535502125514243231221333050340030324512433400
// 353300443040110533553501324350515355224030422352352420301530040414415220512044
// 102253142325520342541222435315000442105004524210535231130052442051055351545220
// 131130420313350534000054113305300454201341321452304124034400515235211335331004
// 543112003543215451012541011325541050410324501505545523445154145431042005012315
// 122200533004510132303544344113040540441231351422440100353402341041515053101520
// 120204120524545214530020045501435550324112530132003004000330002244440411344353
// 435410151300440232100152344042240435351534153151401010433140025000302450103102
// 333254052134050400045134402424043150305103542455255050050512334350220201432114
// 224131534141533425543111532441520245412442102222210113000224424415124204241300
// 112104325301323200531350104215511110134253305054111220154010541423432111153001
// 334042535232031105445300543520403112230205544115003545541455032214012212131012
// 253323215240241511132025301423250241034151544001230545144550200042244320301501

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
        const xCount = Math.ceil(rect.width / attrs.triangle.width) * 2;
        const yCount = Math.ceil(rect.height / attrs.triangle.height) + 1;

        generated += `${colors.map((hsl) => hsl.toHexString()).join('')}\n`;

        for (let y = 0; y < yCount; y++) {
            for (let x = 0; x < xCount; x++) {
                generated += `${Math.floor(Math.random() * colors.length)}`;
            }
            generated += '\n';
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
