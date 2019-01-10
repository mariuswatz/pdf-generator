
function testPaper() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    
    let shapes=new Array();
    shapes.push(new paper.Path.Circle({
        point: [50,50],
        position: [200,100],    
        radius: 50,
        fillColor: 'black',
        visible: false
    }));

    var rad=shapes[0].bounds.width;
    var n=paper.view.viewSize.width/rad;
    n*=paper.view.viewSize.height/rad;
    console.log(paper.view.viewSize.width+" "+rad+" "+n);

    for(var i=0; i<n; i++) {
        let tmp=shapes[0].clone();
        tmp.visible=true;
        let x=i*rad+rad/2;
        let y=Math.floor(x/paper.view.viewSize.width)*rad+rad/2;

        tmp.position=[x%paper.view.viewSize.width,y];
    }

    paper.view.draw();
}