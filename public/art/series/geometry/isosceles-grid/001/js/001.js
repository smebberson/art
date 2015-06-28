
(function (w,d,el,attrs) {

    // on load
    d.addEventListener("DOMContentLoaded", function (event) {

        window.setTimeout(function () {

            // Create the canvas to draw on, and alias it globally
            var c = w.c = Snap("#canvas");

            var colorsCount = 6;

            // number of triangles on the x-axis
            var xCount = Math.ceil(c.node.offsetWidth / attrs.triangle.width) + 1;
            var yCount = Math.ceil(c.node.offsetHeight / attrs.triangle.height) + 1;

            // determine the colours
            // var color = chroma.scale('RdPu').out('hex');
            // var color = chroma.scale([random(),random()]).mode('lch').out('hex');

            // var color = chroma.scale(chroma.interpolate.bezier([randomColor(),randomColor()])).domain([1,4]).mode('lch').correctLightness(true).out('hex');

            // tinycolor
            var color = (function () {

                var _colors = tinycolor(randomColor().hex()).monochromatic(colorsCount+4);

                _colors.sort(function (a, b) {
                    return deconstructColor({'hex': a.toHexString()}).luma - deconstructColor({'hex': b.toHexString()}).luma;
                }).reverse().pop();

                return function (index) {

                    index = Math.floor(index);

                    var c = _colors[index];

                    return c.toHexString();

                }

            })();

            window._color = color;

            // loop horizontally
            for (var horz = 0; horz < xCount; horz++) {

                for (var vert = 0; vert < yCount; vert++) {

                    // we do two triangles, one the right way up, and one upside down

                    // return a number, at-most 5
                    var triangleColor = color(Math.floor(Math.random()*colorsCount));
                    // var triangleColor = color(vert % colorsCount);

                    // x,y
                    var triangle = c.paper.polygon([
                            attrs.triangle.width/2,0,
                            attrs.triangle.width,attrs.triangle.height,
                            0,attrs.triangle.height,
                            attrs.triangle.width/2,0
                    ]).attr({
                        'fill': triangleColor,
                        'stroke': triangleColor,
                        'stroke-width': 0.6
                    });

                    // position
                    triangle.transform('translate(' + horz*attrs.triangle.width + ',' + vert*attrs.triangle.height + ')');

                    // upside down triangle
                    triangleColor = color(Math.floor(Math.random()*colorsCount));

                    triangle = c.paper.polygon([
                        0,0,
                        attrs.triangle.width/2,attrs.triangle.height,
                        attrs.triangle.width,0,
                        0,0
                    ]).attr({
                        'fill': triangleColor,
                        'stroke': triangleColor,
                        'stroke-width': 0.6
                    });

                    // position
                    triangle.transform('translate(' + ((horz*attrs.triangle.width) - attrs.triangle.width/2) + ',' + vert*attrs.triangle.height + ')');

                }

            }

        }, 200);

    });

    window.randomColor = function (space) {

        space = space || 'lch';

        var digits = '0123456789abcdef',
            code = "#";

        for (var i = 0; i < 6; i++) {
            code += digits.charAt(Math.floor(Math.random() * 16))
        }

        return chroma(code, space);

    };

    window.deconstructColor = function (colorObj) {

        //adapted from http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
        var hex = colorObj.hex.substring(1);
        /* Get the RGB values to calculate the Hue. */
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;

        /* Getting the Max and Min values for Chroma. */
        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);


        /* Variables for HSV value of hex color. */
        var chr = max - min;
        var hue = 0;
        var val = max;
        var sat = 0;


        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr / val;
            if (sat > 0) {
                if (r == max) {
                    hue = 60 * (((g - min) - (b - min)) / chr);
                    if (hue < 0) {
                        hue += 360;
                    }
                } else if (g == max) {
                    hue = 120 + 60 * (((b - min) - (r - min)) / chr);
                } else if (b == max) {
                    hue = 240 + 60 * (((r - min) - (g - min)) / chr);
                }
            }
        }

        colorObj.chroma = chr;
        colorObj.hue = hue;
        colorObj.sat = sat;
        colorObj.val = val;
        colorObj.luma = .3 * r + .59 * g + .11 * b
        colorObj.red = r;
        colorObj.green = g;
        colorObj.blue = b;

        return colorObj;

    };

})(window, document, "#canvas", {
    triangle: {
        width: 100,
        height: 100
    },
    animation: {
        rate: 20
    }
});
