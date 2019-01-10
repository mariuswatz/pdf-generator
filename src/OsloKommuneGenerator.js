//utility class - redundant?
var GeneratorConstants = {
    CIRCLE : 0,
    RECTANGLE : 1,
    L0 : 2,
    L1 : 3,
    L2 : 4,
    L3 : 5,
    TYPE_NUM : 6,

    CELL_SIZE : 100,
    CELL_CHANCE: 80,
    GRID_W: 4,
    GRID_H: 6,

    docFormats : {
        A0: [2383.94, 3370.39],
        A1: [1683.78, 2383.94],
        A2: [1190.55, 1683.78],
        A3: [841.89, 1190.55],
        A4: [595.28, 841.89],
        A5: [419.53, 595.28]
    },

    L_PATH : [[0,100],[100,100],[100,50],[50,50],[50,0],[0,0],[0,100]],

    rnd : function(maxval) {
        return Math.random()*maxval
    },

    rndInt : function(maxval) {
        return Math.floor(Math.random()*maxval)
    },


}

class Generator {

    constructor() {
    }

}

// format is document format (A4 etc)
Generator.prototype.initGrid = function(format,container) {
    this.format=format;
    this.container=container;

    this.pageSize=GeneratorConstants.docFormats[format];

    GeneratorConstants.CELL_SIZE=GeneratorConstants.rndInt(100)+50;
    GeneratorConstants.GRID_W=Math.floor(this.pageSize[0]/GeneratorConstants.CELL_SIZE);
    GeneratorConstants.GRID_H=Math.floor(this.pageSize[1]/GeneratorConstants.CELL_SIZE);

    GeneratorConstants.CELL_SIZE=Math.min(
        this.pageSize[0]/GeneratorConstants.GRID_W,
        this.pageSize[1]/GeneratorConstants.GRID_H);

    console.log("pageSize "+this.pageSize+" cellSize "+GeneratorConstants.CELL_SIZE);

    GeneratorConstants.CELL_CHANCE=100-(GeneratorConstants.rndInt(30)+10);
    
    var canvas=document.querySelector("#myCanvas");
    canvas.innerHTML="CELL_CHANCE "+GeneratorConstants.CELL_CHANCE;

    this.grid=[];
    for(var i=0; i<GeneratorConstants.GRID_W; i++) {
        this.grid[i]=[];
        for(var j=0; j<GeneratorConstants.GRID_H; j++) {
            this.grid[i][j]=null;
            if(GeneratorConstants.rnd(100)>GeneratorConstants.CELL_CHANCE) {
                let pos=[i*GeneratorConstants.CELL_SIZE,j*GeneratorConstants.CELL_SIZE];
                this.grid[i][j]=new GeneratorElement(pos);
            }
        }
    }

    console.log(this.grid);
}

Generator.prototype.drawPDF = function(pdf) {
    console.log("drawPDF");

    pdf.
    lineWidth(0.25).opacity(0.25).
        rect(0,0, 
            GeneratorConstants.GRID_W*GeneratorConstants.CELL_SIZE,
            GeneratorConstants.GRID_H*GeneratorConstants.CELL_SIZE).
            dash(2,6).
            fillAndStroke("#f0f0f0","#ff6633");


    for(var i=0; i<GeneratorConstants.GRID_W; i++) {
        if(i>0) {
            pdf.moveTo(i*GeneratorConstants.CELL_SIZE,0).
                lineTo(
                    i*GeneratorConstants.CELL_SIZE,
                    GeneratorConstants.GRID_H*GeneratorConstants.CELL_SIZE).
                    dash(2,6).
                    stroke();
        }
        for(var j=0; j<GeneratorConstants.GRID_H; j++) {
            if(j>0) {
                pdf.moveTo(0,j*GeneratorConstants.CELL_SIZE).
                lineTo(
                    GeneratorConstants.GRID_W*GeneratorConstants.CELL_SIZE,
                    j*GeneratorConstants.CELL_SIZE).
                    dash(2,6).
                    stroke();
            }

            // if element at this position, draw to PDF
            if(this.grid[i][j]!=null) this.grid[i][j].drawPDF(pdf);
        }
    }
}


// a GeneratorElement is a single element to be drawn
class GeneratorElement {
    constructor(pos) {
        this.pos=pos;

        // dummy color generation
        let tmp=GeneratorConstants.rndInt(6)*40+55;
        this.color=[0,tmp,255];

        // set element type
        this.type=GeneratorConstants.rndInt(GeneratorConstants.TYPE_NUM);

        // handle L types
        if(this.type>=GeneratorConstants.L0 && this.type<=GeneratorConstants.L3) {
            let pt=GeneratorConstants.L_PATH;

            this.path=[];
            for(var i=0; i<pt.length; i++) {
                var newpt=[pt[i][0],pt[i][1]];

                // flip X,Y to match rotated versions
                if(this.type==GeneratorConstants.L1 || this.type==GeneratorConstants.L2) newpt[0]=100-newpt[0];
                if(this.type==GeneratorConstants.L2 || this.type==GeneratorConstants.L3) newpt[1]=100-newpt[1];
                this.path.push(newpt);
            }
        }
    }
}

// draw an element to PDF
GeneratorElement.prototype.drawPDF = function(pdf){
    // use save()/restore() to push/pop transformation matrix 
    pdf.save().
        fillColor(this.color).
        translate(this.pos[0],this.pos[1]);

    // elements are 100x100 by default, scale to actual cell size
    pdf.scale(GeneratorConstants.CELL_SIZE/100); 

    if(this.type==GeneratorConstants.CIRCLE) {
        pdf.circle(50,50,50);
    }
    else if(this.type==GeneratorConstants.RECTANGLE) {
        pdf.rect(0,0,100,100);
    }
    else {
        pdf.moveTo(this.path[0][0],this.path[0][1]);
        for(var i=1; i<this.path.length; i++) pdf.lineTo(this.path[i][0],this.path[i][1]);
        // pdf.polygon(this.path);
    }

    pdf.fill().restore();

}

var generator;

function testGrid() {
    generator=new Generator();
    console.log("Generator "+generator);
    generator.initGrid("A4",null);

}


