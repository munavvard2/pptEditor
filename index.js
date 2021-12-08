jQuery.fn.tagName = function() {
    return this.prop("tagName").toLowerCase();
  };
//let position = { x: 0, y: 0 };
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    updateCurrentSlide();
};
const observer = new MutationObserver(callback);
let htmlSlides = [];
htmlSlides.push(`<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(90px, 300px);" contenteditable="true" data-x="90" data-y="300" spellcheck="false">9 - 261.96875</div>\n<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-126px, 83px);" data-x="-126" data-y="83">9 - 530.34375</div>\n<img class="draggable" src="/test_image.jpg" style="width: 25%; height: 25%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; touch-action: none; user-select: none; transform: translate(-1px, 380px);" data-x="-1" data-y="380">\n<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-259px, 156px);" data-x="-259" data-y="156">9 - 987.59375</div>`);
htmlSlides.push(`<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-126px, 83px);" data-x="-126" data-y="83">9 - 530.34375</div>\n<img class="draggable" src="/test_image.jpg" style="width: 25%; height: 25%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; touch-action: none; user-select: none; transform: translate(-1px, 380px);" data-x="-1" data-y="380">\n<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-259px, 156px);" data-x="-259" data-y="156">9 - 987.59375</div>`);
htmlSlides.push(`<img class="draggable" src="/test_image.jpg" style="width: 25%; height: 25%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; touch-action: none; user-select: none; transform: translate(-1px, 380px);" data-x="-1" data-y="380">\n<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-259px, 156px);" data-x="-259" data-y="156">9 - 987.59375</div>`);
htmlSlides.push(`<div class="draggable" style="width: 25%; height: 6.5%; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; transform: translate(-259px, 156px);" data-x="-259" data-y="156">9 - 987.59375</div>`);

let plotSideSlides = (slides)=>{
    let html = '';
    $.each(slides,(id,slide)=>{
        html += '<div class="singleSlidePreview" arrayId="'+id+'"><div class="slideContent">';
        html += slide;
        html += '</div></div>';
    });
    $('.slidesHolder').prepend(html);
};
let currentSlide = false;
let plotSlide = (slideHtml)=>{
    observer.disconnect();
    $('.holder').html(slideHtml);
    observer.observe($('.holder').get(0), config);
    initInteract();
};

let updateCurrentSlide = ()=>{
    if(currentSlide && htmlSlides[currentSlide] != undefined){
        htmlSlides[currentSlide] = $('.holder').html();
        updateSlidePreview(htmlSlides[currentSlide]);
        // plotSlide(htmlSlides[currentSlide]);
    }
};

let updateSlidePreview = (html)=>{
    $('.singleSlidePreview[arrayid="'+currentSlide+'"] .slideContent').html(html);
};
jQuery(document).ready(function($){
    plotSideSlides(htmlSlides);
    initInteract();
    $(document).on('click','.singleSlidePreview',function(event){
        let idOfSlide = $(this).attr('arrayId'); // can be replaced with much more uniquely identified thing
        currentSlide = idOfSlide; 
        if(htmlSlides[idOfSlide] != undefined){
            plotSlide(htmlSlides[idOfSlide]);
        }
        else{
            alert('not found');
        }
    });
    // generate();
});
let initInteract = ()=>{
    interact('.holder > .draggable').draggable({
        modifiers: [
            interact.modifiers.restrictRect({
              restriction: $('.holder').get(0),
              endOnly: true,
            })
        ],
        listeners: {
            move: dragMoveListener,
        }
    });
    $('.draggable').each(function(id,event){
        putCordinates($(event));
    });
};
let dragMoveListener = function(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  
    // update the position attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

let putCordinates = (elem)=>{
    let posvos = (getPositionjQ(elem));
    elem.html(posvos.x + " - "+ posvos.y);
};

let pptx = new PptxGenJS(); 
let isRGB = (color)=>{
    return color.includes('rgb');
};
let rgbToHex = (color) => {
    color = color.replace('rgb(','').replace(')','').split(',');
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
    let x = ((position.x - 250) * 100) / 1280;
    let y = ((position.y * 100)) / 640;
    
    let w = (position.width * 100) / 1280;
    let h = (position.height * 100) / 640;
    
    return {x,y,w,h};
};
let getPositionjQ = (element)=>{

    let ppoo =  element.position();
    return { x:ppoo.top,y:ppoo.left };
};
let getPosition = (element)=>{
    return element.get(0).getBoundingClientRect();    
};
let getJSONConfigByTag = (element)=>{
    if(element[0].nodeName == "#text"){ return false; }
    let style = getParsedStyle(element); 
    console.log(style);
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
        rectRadius = Math.round((parseInt(roundedStyle[0][1].replace('px','').replace('%','')) * 100) / 180,1) / 20;
        // rectRadius = 0;
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
            return {
                'IMAGE':{
                    x: parsedPosition.x+'%',
                    y: parsedPosition.y+'%',
                    w: parsedPosition.w+'%',
                    h: parsedPosition.h+'%',
                    path:element.attr('src')
                }
            };
            break;
        default:
            return {};
            break;
    }
};
let parseHtml = (holder,jsonConfig)=>{
    // if(holder.children().length != 0){
    //     return parseHtml(holder.children(),jsonConfig);
    // }else{
    //     jsonConfig.push(getJSONConfigByTag(holder));
    //     return jsonConfig;
    // }

    holder.each((id,elem)=>{
        let config = getJSONConfigByTag($(elem));
        if(config){ jsonConfig.push(config); }
    });
    return jsonConfig;
};

let generate = function() {

    pptx = new PptxGenJS();
    $.each(htmlSlides,(id,htmlSlide)=>{
        let slide = pptx.addSlide(id); 
        let jsonConfig = parseHtml($(htmlSlide),[]);
        console.log(jsonConfig);
        $.each(jsonConfig,(type,config)=>{
            let configId = Object.keys(config)[0];
            let configElement = config[Object.keys(config)[0]];
            switch (configId){
                case 'RECTANGLE':
                    if('text' in configElement){
                        slide.addText(configElement.text,configElement);
                    }
                    else{
                        slide.addShape(pptx.shapes[configId], configElement);         
                    }
                    break;
                case 'IMAGE':
                    slide.addImage(configElement);
                    break;                    
            }            
        });
    });

    pptx.writeFile({
        fileName: 'Demo_one.pptx'
    });
}