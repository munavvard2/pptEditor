jQuery.fn.tagName = function() {
    return this.prop("tagName").toLowerCase();
  };
const position = { x: 0, y: 0 }
jQuery(document).ready(function($){
    interact('.draggable').draggable({
        listeners: {
            start (event) {
            },
            move (event) {
            position.x += event.dx;position.y += event.dy;
            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
            },
        }
    });
    generate();
});
let pptx = new PptxGenJS(); 
let isRGB = (color)=>{
    return color.includes('rgb');
};
let rgbToHex = (color) => {
    color = color.replace('rgb(','').replace(')','').split(',');
    console.log(color);
    let r = color[0].trim();let g = color[1].trim();let b=color[2].trim();
    return [r, g, b].map(x => {
        x = parseInt(x);
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('');
};
let getParsedStyle = (element)=>{
    return element.attr('style').split(';').map((s)=>{ return s.trim().split(':'); });
};
let getParsedPosition = (position)=>{
    let x = (position.x * 100) / 600;
    let y = (position.y * 100) / 400;
    
    let w = (position.width * 100) / 600;
    let h = (position.height * 100) / 400;
    
    return {x,y,w,h};
};
let getPosition = (element)=>{
    return element.get(0).getBoundingClientRect();
};
let getJSONConfigByTag = (element)=>{
     style = getParsedStyle(element); 
    let position = getPosition(element);
    let parsedPosition = getParsedPosition(position);
    let colorStyle = style.filter((s)=>{ return s[0] == "background-color"; });
    let textColorStyle = style.filter((s)=>{ return s[0] == "color"; });    
    let textAlignStyle = style.filter((s)=>{ return s[0] == "text-align"; });
    let roundedStyle = style.filter((s)=>{ return s[0] == "border-radius"; });
    
    let color = "ffffff"; //default color
    let textAlign = "left";
    let rectRadius = 0;
    let textColor = "000000";
    if(colorStyle.length > 0){
        color = colorStyle[0][1].trim().replace('#','');
        if(isRGB(color)){ color = rgbToHex(color).replace('#',''); }
    }
    if(textColorStyle.length > 0){
        textColor = textColorStyle[0][1].trim().replace('#','');
        if(isRGB(textColor)){ textColor = rgbToHex(textColor).replace('#',''); }
    }
    if(textAlignStyle.length > 0){
        textAlign = textAlignStyle[0][1];
    }
    if(roundedStyle.length > 0){
        rectRadius = (parseInt(roundedStyle[0][1].replace('px','').replace('%','')) * 100) / 180;
        console.log(rectRadius);
    }
    switch(element.tagName()){
        case 'div':
            return {
                "RECTANGLE": {
                    shape: (rectRadius > 0)? pptx.shapes.ROUNDED_RECTANGLE : pptx.shapes.RECTANGLE ,
                    x: parsedPosition.x+'%',
                    y: parsedPosition.y+'%',
                    w: parsedPosition.w+'%',
                    h: parsedPosition.h+'%',
                    fill: { color:color },
                    color:textColor,
                    align: textAlign,
                    fontSize: 14,
                    rectRadius:rectRadius,
                    text:element.html(),                    
                }
            };
            break;
        case 'img':
            return [];
            break;
        default:
            return [];
            break;
    }
};
let parseHtml = (holder,jsonConfig)=>{
    if(holder.children().length != 0){
        return parseHtml(holder.children(),jsonConfig);
    }else{
        jsonConfig.push(getJSONConfigByTag(holder));
        return jsonConfig;
    }
};

let generate = function() {

    pptx = new PptxGenJS();
    let slide = pptx.addSlide('Jay Bhavsar'); 
    
    let jsonConfig = parseHtml($('.holder').children(),[]);
    $.each(jsonConfig,(type,config)=>{
        let configId = Object.keys(config)[0];
        let configElement = config[Object.keys(config)[0]];
        if('text' in configElement){
            slide.addText(configElement.text,configElement);
        }
        else{
            slide.addShape(pptx.shapes[configId], configElement);         
        }
    });

    pptx.writeFile({
        fileName: 'Demo_one.pptx'
    });
}

