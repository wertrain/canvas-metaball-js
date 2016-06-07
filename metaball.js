var canvasmetaball = {};

(function () {
    var RADIUS = 70; // ボールの半径
    var MAX_PIXELS = (2 * RADIUS) * (2 * RADIUS); // 円を囲む四角形のピクセル数
    var Metaball = function(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.pixels = new Array(MAX_PIXELS);
        
        let no = 0;
        let c = 0;
        for (let i = -RADIUS; i < RADIUS; i++) {
            for (let j = -RADIUS; j < RADIUS; j++) {
                // 円の内部の点か判定
                let z = RADIUS * RADIUS - i * i - j * j;
                if (z < 0) {
                    no = 0;
                } else {
                    // 円内のピクセルの色（パレット番号）を決定している
                    z = Math.sqrt(z);
                    var t = z / RADIUS;
                    no = Math.floor(256 * (t * t * t * t));
                    if (no > 255)
                        no = 255;
                    if (no < 0)
                        no = 0;
                }
                this.pixels[c++] = { 'dx': i, 'dy': j, 'no': no };
            }
        }
    };
    Metaball.prototype.draw = function(context, width, height) {
        for (let i = 0; i < MAX_PIXELS; ++i) {
            let sx = this.x + this.pixels[i]['dx'];
            if (sx < 0 || sx > width)
                continue;
            let sy = this.y + this.pixels[i]['dy'];
            if (sy < 0 || sy > height)
                continue;
              
            // ボールの色をイメージのRGBへ加算する
            let no = this.pixels[i]['no'];
            //int[] color = palette.getColor(no); // パレット番号からRGBを取り出す
            
            var p = context.createImageData(1, 1);
            p.data[0] = no === 0 ? 0 : 255;
            p.data[1] = 0;
            p.data[2] = 0;
            p.data[3] = 255;
            context.putImageData(p, sx, sy);
        }
    };
    canvasmetaball.Metaball = Metaball;
}());

var main = function() {
    var metaball = new canvasmetaball.Metaball(300, 200, 10, 10);
    
    var canvas = document.getElementById('canvas');
    canvas.width = 640;
    canvas.height = 480;
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 0, 0, 255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    metaball.draw(context, canvas.width, canvas.height);
}();
