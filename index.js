let state = false;
let isOnCanvas = false;
let worms = []
let reverseSpeed = false

const colorPallete = {
    autumn: [
        "fe938c",
        "facfad",
        "f8bd7f",
        "f5ac72",
        "f2aa7e",
    ],
    winter: [
        "dbdbdb",
        "b0b5b3",
        "947eb0",
        "a3a5c3",
        "a9d2d5",
    ],
    summer: [
        "a7c6da",
        "fff3b0",
        "ffc15e",
        "ffeedd",
        "ffd8be",
    ],
    spring: [
        "cfbae1",
        "9cf6f6",
        "f7a278",
        "ffee93",
        "5bc3eb",
    ],
    bew: [
        "ffffff",
        "999999",
        "000000",
    ],
    ber: [
        "000000",
        "e35454",

    ]
}

//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

class Worm {
    constructor(pos1, pos2, noUpdate=false) {
        this.pos = [
            pos1,
            pos2
        ]
        if (document.getElementById("pallete").options[document.getElementById("pallete").selectedIndex].value === "random") {    
            this.color = [
                random(0, 255),
                random(0, 255),
                random(0, 255),
                random(0, 255)
            ]
        } else {
            const choosenColorPallete = colorPallete[document.getElementById("pallete").options.item(document.getElementById("pallete").selectedIndex).value]
            const color = hexToRgb(choosenColorPallete[round(random(0, choosenColorPallete.length-1))])
            this.color = [
                color.r,
                color.g,
                color.b,
                random(0, 255)
            ]
        }
        this.shadePos = random(0, 3)
        this.shade = 0 
        this.flip = false

        this.speed = 3
        this.noUpdate = noUpdate
    }

    update() {
        if (!this.noUpdate) {
            if (this.shade > 255 || this.shade < 0) {
                this.flip = !this.flip
            }
            if (this.flip) {
                this.shade++;
            } else {
                this.shade--;
            }

            this.color[this.shadePos] = this.shade
/*
            for (let i = 0; i < this.pos.length; i++) {
                const n = random(0, 10)
                if (random([true, false])) {
                    this.pos[i] += n;
                } else {
                    this.pos[i] -= n;
                }

            }
*/

            const difX = this.pos[0] - mouseX
            const difY = this.pos[1] - mouseY 

            const angle = atan2(difY, difX)
            const hyp = this.speed * (reverseSpeed ? 1 : -1);

            this.pos[0] += cos(angle) * hyp
            this.pos[1] += sin(angle) * hyp

/*
        const mouse = [
            pmouseX,
            pmouseY
        ]
        for (let i = 0; i < this.pos.length; i++) {
            if (this.pos[i] < mouse[i]) {
                this.pos[i] += this.speed;
            } else {
                this.pos[i] -= this.speed;
            }   
        }*/
        }
        fill(this.color);
        ellipse(this.pos[0], this.pos[1], 55, 55);
    }
}

function degreeToRadian(angle) {
    return angle * Math.PI / 180;
}

function radianToDegree(angle) {
    return angle / Math.PI * 180;
}

function pause() {
    state = !state
    worms.forEach(worm => worm.noUpdate = !worm.noUpdate)
}

function toggleReverse() {
    document.getElementById("reverseCheckbox").checked = !document.getElementById("reverseCheckbox").checked;
    reverseSpeed = document.getElementById("reverseCheckbox").checked;
}

function clearCanvas() {
    background(255,255,255);
    clear();
    worms = []
}

function deleteWorms() {
    worms = []
}

function setup() {
    canvas = createCanvas(windowWidth/1.2, windowHeight/1.2);
    canvas.mouseOver(() => isOnCanvas = true);
    canvas.mouseOut(() => isOnCanvas = false);
    const x = (windowWidth - width) / 2;
    const y = (windowHeight - height) / 2;
    canvas.position(x, y)
}
  
function draw() {
    if (mouseIsPressed && isOnCanvas) {
        worms.push(new Worm(mouseX, mouseY, state))
    }
    noStroke();
    worms.forEach(worm => worm.update())
    console.log(worms.length)
}

function downloadArt() {
    saveCanvas(canvas, "myArt", "png")
}

function keyPressed() {
    if (keyCode === 88) { // X
        toggleReverse();
    }
    if (keyCode === 68) { // D
        deleteWorms()
    }
    if (keyCode === 67) { // C
        clearCanvas()
    }
    if (keyCode === 90) { // Z
        pause()
    }
}
