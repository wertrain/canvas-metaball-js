var canvasmetaball = {};

(function () {
    var RADIUS = 64; // ボールの半径
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
        var p = context.getImageData(0, 0, width, height);
        var palette = new Palette();
        
        for (let i = 0; i < MAX_PIXELS; ++i) {
            
            let sx = this.x + this.pixels[i]['dx'];
            if (sx < 0 || sx > width)
                continue;
            let sy = this.y + this.pixels[i]['dy'];
            if (sy < 0 || sy > height)
                continue;
              
            // ボールの色をイメージのRGBへ加算する
            let no = this.pixels[i]['no'];
            let color = palette.getColor(no); // パレット番号からRGBを取り出す
            
            //var p = context.createImageData(1, 1);
            let index = (sy * width * 4) + (sx * 4);
            p.data[index + 0] = p.data[index + 0] + color[0];
            p.data[index + 1] = p.data[index + 1] + color[1];
            p.data[index + 2] = p.data[index + 2] + color[2];
            p.data[index + 3] = 255;
        }
        context.putImageData(p, 0, 0);
    };
    Metaball.prototype.move = function(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // 範囲内かチェック
        if (this.x < RADIUS) {
            this.x = RADIUS;
            this.vx = -this.vx;
        }
        if (this.y < RADIUS) {
            this.y = RADIUS;
            this.vy = -this.vy;
        }
        if (this.x > width - RADIUS) {
            this.x = width - RADIUS;
            this.vx = -this.vx;
        }
        if (this.y > height - RADIUS) {
            this.y = height - RADIUS;
            this.vy = -this.vy;
        }
    };
    canvasmetaball.Metaball = Metaball;
    
    var MAX_PALETTE = 256;
    var Palette = function() {
        this.red = new Array(MAX_PALETTE);
        this.green = new Array(MAX_PALETTE);
        this.blue = new Array(MAX_PALETTE);
        
        var r, g, b;
        for (let i = 0; i < MAX_PALETTE; ++i) {
            r = g = b = 0;
            // ここのr,g,bの順番を変えると違う色のメタボールができる
            if (i >= 0)
                r = 4 * i;
            if (i >= 2)
                g = 4 * (i / 2);
            if (i >= 4)
                b = 4 * (i / 4);

            if (r > 255)
                r = 255;
            if (g > 255)
                g = 255;
            if (b > 255)
                b = 255;

            this.red[i] = r;
            this.green[i] = g;
            this.blue[i] = b;
        }
    };
    Palette.prototype.getColor = function(no) {
        var color = new Array(3);
        color[0] = this.red[no];
        color[1] = this.green[no];
        color[2] = this.blue[no];
        return color;
    };
}());

var main = function() {
    var metaballs = new Array(3);
    metaballs[0] = new canvasmetaball.Metaball(150, 100,  2,  1);
    metaballs[1] = new canvasmetaball.Metaball(100, 200, -1, -2);
    metaballs[2] = new canvasmetaball.Metaball(150,  60,  3, -2);
    
    var canvas = document.getElementById('canvas');
    canvas.width = 320;
    canvas.height = 320;
    var context = canvas.getContext('2d');
    (function() {
        context.fillStyle = 'rgba(0, 0, 0, 255)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < metaballs.length; ++i) {
            metaballs[i].draw(context, canvas.width, canvas.height);
            metaballs[i].move(canvas.width, canvas.height);
        }
        setTimeout(arguments.callee, 1000 / 60);
    })();
}();
