jQuery(document).ready(function($){
    interact('.draggable').draggable({
        listeners: {
            start (event) {
            console.log(event.type, event.target)
            },
            move (event) {
            position.x += event.dx
            position.y += event.dy
        
            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
            },
        }
    })        
});




let getStyle = jinput => {
    return jinput.attr(style).split(";").map( r => r.replace('\n', "").trim() )
}

function fun(j_input) {

    return j_input.get(0).getBoundingClientRect(); 
    
}

let pptx = new PptxGenJS(); 

let slide = pptx.addSlide('Jay Bhavsar'); 


const position = { x: 0, y: 0 }


let generate = function() {

    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.8, w: 1.5, h: 3.0, fill: { color: pptx.colors.ACCENT1 }, line: { type: "none" } }); 

    pptx.writeFile({
        fileName: 'Demo_one.pptx'
    })
}

