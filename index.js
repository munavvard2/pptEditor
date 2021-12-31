jQuery.fn.tagName = function() {
    return this.prop("tagName").toLowerCase();
  };
//let position = { x: 0, y: 0 };
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    updateCurrentSlide();
};
const observer = new MutationObserver(callback);
window.htmlSlides = [];
// let elem1 = "";
// let elem2 = "";
// let elem3 = "";
// let elem4 = "";

let elem1 = `<div class="draggable text-block" style="width: 250px; height: 250px; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; left: 1px; top: 0px;" contenteditable="true" data-x="1" data-y="0" spellcheck="false">300 - 90</div>`;
let elem2 = `<div class="draggable" style="width: 250px; height: 250px; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; left: 569px; top: 36px;" data-x="569" data-y="36">83 - -126</div>`;
let elem3 = `<div class="draggable" style="width: 250px; height: 250px; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; touch-action: none; user-select: none; left: 611px; top: 274px;" data-x="611" data-y="274"><img src="test_image.jpg"></div>`;
let elem4 = `<div class="draggable" style="width: 250px; height: 250px; background-color: rgb(34, 153, 238); color: rgb(255, 255, 255); border-radius: 5%; padding: 4%; touch-action: none; user-select: none; left: 236px; top: 256px;" data-x="236" data-y="256">156 - -259</div>`;


let plotSideSlides = (slides)=>{
    $('.slidesHolder').html('');
    $.each(slides,(id,slide)=>{
            let html = '';
            html += '<div class="singleSlidePreview" arrayId="'+id+'"><div class="slideContent">';
            html += slide;
            html += '</div></div>';
            $('.slidesHolder').append(html);
    });
    $('.singleSlidePreview:first-child').click();

};
let currentSlide = false;
let plotSlide = (slideHtml)=>{
    observer.disconnect();
    $('#holder').html(slideHtml);
    observer.observe($('#holder').get(0), config);
    initInteract();
};

let updateCurrentSlide = ()=>{
    if(currentSlide && htmlSlides[currentSlide] != undefined){
        htmlSlides[currentSlide] = $('#holder').html();
        updateSlidePreview(htmlSlides[currentSlide]);
        // plotSlide(htmlSlides[currentSlide]);
    }
};

let updateSlidePreview = (html)=>{
    $('.singleSlidePreview[arrayid="'+currentSlide+'"] .slideContent').html(html);
};

function destory_editor(selector){
    if($(selector)[0])
    {
        var content = $(selector).find('.ql-editor').html();
        $(selector).html(content);

        $(selector).siblings('.ql-toolbar').remove();
        $(selector + " *[class*='ql-']").removeClass (function (index, class_name) {
           return (class_name.match (/(^|\s)ql-\S+/g) || []).join(' ');
        });

        $(selector + "[class*='ql-']").removeClass (function (index, class_name) {
           return (class_name.match (/(^|\s)ql-\S+/g) || []).join(' ');
        });
    }
    else
    {
        console.error('editor not exists');
    }
}
function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


/*
    setup blob <= arrayBuffer using filereaderJs


*/


        $("#result").pptxToHtml({
            // pptxFileUrl: "ppt_sample.pptx",
            // pptxFileUrl: "1.pptx",z`
            // pptxFileUrl: "2.pptx",
            // pptxFileUrl: "3.pptx",
            // pptxFileUrl: "Nishit.pptx",
            // pptxFileUrl: "Sample_12.pptx",
            pptxFileUrl: "BeYu Pitch Deck.pptx",

            fileInputId: "uploadFileInput",
            slideMode: false,
            keyBoardShortCut: false,
            slideModeConfig: {  //on slide mode (slideMode: true)
                first: 1,
                nav: false, /** true,false : show or not nav buttons*/
                navTxtColor: "white", /** color */
                navNextTxt:"&#8250;", //">"
                navPrevTxt: "&#8249;", //"<"
                showPlayPauseBtn: false,/** true,false */
                keyBoardShortCut: false, /** true,false */
                showSlideNum: false, /** true,false */
                showTotalSlideNum: false, /** true,false */
                autoSlide: false, /** false or seconds (the pause time between slides) , F8 to active(keyBoardShortCut: true) */
                randomAutoSlide: false, /** true,false ,autoSlide:true */
                loop: false,  /** true,false */
                background: "black", /** false or color*/
                transition: "default", /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */
                transitionTime: 1 /** transition time in seconds */
            },
            plotSlidedsIfDone : plotSideSlides
        });



// jQuery.noConflict();
jQuery(document).ready(function($){


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



/*-Quill start-------*/

    /*
        https://codepen.io/Joeao/pen/BdOGKV
        Copy the contents of the quill instance, destroy the DOM element that the instance is bound to, create a new DOM element and paste the contents back in
        Use disable via the API as you've already tried, but also style disabled Quill instances to not show any differentiation between Quill's formatting and your own.
    */
/*    const Quilloptions = {
      theme: "snow",
      enable: false
    };
    var editorBody = document.getElementById('editor-body'),
        editorContainer = document.getElementById('editor-container'),
        onButton = document.getElementById('on'),
        offButton = document.getElementById('off');

    var quill = new Quill(editorBody, Quilloptions);

    onButton.addEventListener('click', function() {
      editorContainer.classList.remove('inactive')
      quill.enable(true);
    });

    offButton.addEventListener('click', function() {
      editorContainer.classList.add('inactive');
      quill.enable(false);
    });*/

/*---------Quill ends-------*/
   function quillfontsizes() {
        var x = 12;
        let sizes = [];
        for (var i = x; i <= 80; i += 0.5) {
            sizes.push(`${i}px`);
        }
        return sizes;
    };
    const fontSizeArr = quillfontsizes();

    var Size = Quill.import('attributors/style/size');
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);
    var ColorClass = Quill.import('attributors/class/color');
    var SizeStyle = Quill.import('attributors/style/size');

    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);

    const toolbarOptions = [
    [{ 'size': fontSizeArr }],
    ['bold', 'italic', 'underline', 'strike'],
    // ['blockquote', 'code-block'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    // ['link', 'image', 'video', 'formula'],
    [{'color': []}, {'background': []}],
    // [{'font': []}],
    [{'align': []}],
    ['clean'],
    ];

     window.quill = new Quill('#tool-holder #quill-editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'  // or 'snow'
    });


     function quillapply(target = undefined) //display current HTML
     {
         if(target === undefined || target == ""){return;}
         // var quillHtml = quill.root.innerHTML;
         let targetObj = $('div#holder .'+target);
         targetObj.html(quill.root.innerHTML).addClass('quilled');
         quillCancel();
     }
     function quillCancel(){
        quill.setText('');
        $('#holder .text-block').removeClass('editing-here');
        $('#tool-holder #quill-holder #quillapply').attr('to-apply', "")
     }

     function getElementStyleInQuillObj(htmlObj){

            let cssProps = {
             "font-size" : "size",
             "font-weight" : "bold",
             "color" : "color",
             // "font-style",
             // "text-decoration",
             "text-align" : "align"
             // "position",
             // "vertical-align"
         }

         let cssPropObj = {};
         Object.keys(cssProps).forEach((prop)=>{
             let styleValue = htmlObj.css(prop);
             if(styleValue == "bold"){
                styleValue = true;
             }else if(styleValue == "inherit"){
                 styleValue = "";
             }else if(styleValue == undefined || styleValue == ""){
                 styleValue = "";
             }
            cssPropObj[cssProps[prop]] = styleValue;
         });
         return cssPropObj;

     }
     function formatTextInQuill(html){
         let qdataobj = [];
         $(html).each( (index, element) => {
             let elementText = $(element).html();
             elementText = elementText.replaceAll("&nbsp;"," ");
             if(elementText == '&nbsp;'){
                 elementText = " ";
             }
             qdataobj.push({insert : elementText, attributes: getElementStyleInQuillObj($(element)) });
         });
         return qdataobj;
         // var data = htmlObj.children('span').map(function() {
         //   return {runId: $(this).text(), processName: $(this).next().text()};
         // }).get();

         /*$.each(cssProps, function (prop){

         })*/


     }
    $(document).on('click','#holder .text-block ',function(e){
        quillCancel();
        let editingText = 'editing-here';// new Date().getTime()
        if($(this).hasClass('quilled')){
            let htmlcontent = $(this).html();
            quill.container.firstChild.innerHTML = htmlcontent;
            // quill.setText();
        }else{
            console.clear();
            console.log('editing this bc..');
            quill.setContents(formatTextInQuill($(this).html()));
            // quill.setText(stripHtml($(this).html()));
            // quill.clipboard.dangerouslyPasteHTML($(this).html(),'api')
            // quill.setText();
        }
        $(this).addClass(editingText);
        $('#tool-holder #quill-holder #quillapply').attr('to-apply', editingText)
        quill.focus();
    })
    $(document).on('click', '#tool-holder #quill-holder #quillapply', function (e){
        let toApply = $(this).attr('to-apply');
        if(toApply == "" || toApply === undefined){alert('No target found to put')}
        quillapply(toApply);
        // console.log(quill.getText());
    });
     $(document).on('click','#quillcancel', function (){
         console.log('canceling and clearing ..');
        quillCancel();
     });



    // generate();
});
let initInteract = ()=>{
    // interact('#holder > .draggable').draggable({
    //     modifiers: [
    //         interact.modifiers.restrictRect({
    //           restriction: $('#holder').get(0),
    //           endOnly: true,
    //         })
    //     ],
    //     listeners: {
    //         move: dragMoveListener,
    //     }
    // }).resizable({
    //     edges: { top: true, left: true, bottom: true, right: true },
    //     listeners: {
    //         move: function (event) {      
    //             console.log(event);
    //           Object.assign(event.target.style, {
    //             width: `${event.rect.width}px`,
    //             height: `${event.rect.height}px`,
    //           })
    //         }
    //     }
    //   });
    // $('#holder *:not(img)').draggable().resizable({
    $('.draggable').draggable().resizable({
        handles:"all",
     });
    
    // $('.draggable').each(function(id,event){
    //     putCordinates($(event));
    // });
};
let dragMoveListener = function(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.style.left) || 0) + event.dx
    var y = (parseFloat(target.style.top) || 0) + event.dy
  
    // translate the element
    // target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    target.style.left    = x +"px";
    target.style.top    = y +"px";
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
    if(element.attr('style') != undefined){
        return element.attr('style').split(';').map((s)=>{ return s.trim().split(':'); });
    }
    return [];
};
let getParsedPosition = (position)=>{
    let x = (position.x * 100) / 1280;
    let y = (position.y * 100) / 720;
    let w = position.width.includes('%') ? position.width.replace('%','') : ((position.width.replace('px','') * 100) / 1280);
    let h = position.height.includes('%') ? position.height.replace('%','') : ((position.height.replace('px','') * 100) / 720);
    

    // x = position.x;
    // y = position.y;
    // w = position.width;
    // h = position.height;
    // let w = ( ((position.width.replace('px','') * 100 ) / 1200) * 11.02) / 100;
    // let h = ( ((position.height.replace('px','') * 100 ) /720)  * 6.20) / 100;    

    return {x,y,w,h};
};
let getPositionjQ = (element)=>{

    let ppoo =  element.position();
    return { x:ppoo.top,y:ppoo.left };
};
let getPosition = (element)=>{
    let width = element.css('width');
    let height = element.css('height');
    let x = (element.css('left') || "0px");
    let y = (element.css('top') || "0px");

    if(height == "100%" || width == "100%" || height == "0px" || width == "0px"){
        let closestblock = element.closest('.block.content');
        if(closestblock.length > 0){
            width = $(closestblock[0]).css('width');
            height = $(closestblock[0]).css('height');
        }
    }
    let closestblock = element.closest('.block.content');
    if(x == "0px" && y == "0px"){
        if(closestblock.length > 0){
            x = $(closestblock[0]).css('left');
            y = $(closestblock[0]).css('top');
        }
    }
    else if(x == "0px"){
        if(closestblock.length > 0){
            x = $(closestblock[0]).css('left');
            y = parseInt(""+y.replace('px')) + parseInt($(closestblock[0]).css('top').replace('px'))+"";
        }
    }
    else if(y == "0px"){
        if(closestblock.length > 0){
            x = parseInt(""+x.replace('px')) + parseInt($(closestblock[0]).css('left').replace('px'))+"";
            y = $(closestblock[0]).css('top');
        }
    }


    return {
        x: x.replace('px',''),//(element.css('left') || "0px").replace('px',''),
        y: y.replace('px',''),//(element.css('top') || "0px").replace('px',''),
        width:width,
        height:height
    };
    // return element.get(0).getBoundingClientRect();    
};
let getSingleStyleByName = (styleName,style)=>{
    return style.filter((s)=>{ return s[0] == styleName; });
};
let getJSONConfigByTag = (element)=>{
    if(element[0].nodeName == "#text"){ return false; }
    let style = getParsedStyle(element); 
    let position = getPosition(element);
    let parsedPosition = getParsedPosition(position);

    // return true

    let colorStyle = style.filter((s)=>{ return s[0] == "background-color"; });
    let textColorStyle = style.filter((s)=>{ return s[0] == "color"; });    
    let textAlignStyle = style.filter((s)=>{ return s[0] == "text-align"; });
    let roundedStyle = style.filter((s)=>{ return s[0] == "border-radius"; });
    let fontSizeStyle = getSingleStyleByName('font-size',style);
    let fontFaceStyle = getSingleStyleByName('font-family',style);

    let color = "ffffff"; //default color
    let textAlign = "left";
    let rectRadius = 0;
    let textColor = "000000";
    let fontSize = 14;
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

    if(fontSizeStyle.length > 0){
        fontSize = fontSizeStyle[0][1].trim().replace('px','');
    }
    if(fontFaceStyle.length > 0){
        fontFace = fontFaceStyle[0][1].trim();
    }
    fontSize = (30 * fontSize / 75);
    switch(element.tagName()){
        case 'span-no-use':
            return {
                "RECTANGLE": {
                    shape: pptx.shapes.RECTANGLE ,
                    x: parsedPosition.x+'%',
                    y: parsedPosition.y+'%',
                    w: parsedPosition.w+"%",
                    h: parsedPosition.h+"%",
                    // fill: { color:color },
                    color:textColor,
                    align: textAlign,
                    fontSize: fontSize,
                    rectRadius:rectRadius,
                    text:element.html().replaceAll('&nbsp;',' '),                    
                }
        };
        case 'div':
            return {
                "RECTANGLE": {
                    shape: (rectRadius > 0)? pptx.shapes.ROUNDED_RECTANGLE : pptx.shapes.RECTANGLE ,
                    x: parsedPosition.x+"%",
                    y: parsedPosition.y+"%",
                    w: parsedPosition.w+"%",
                    h: parsedPosition.h+"%",
                    // fill: { color:"FFFFFF" },
                    color:textColor,
                    align: textAlign,
                    fontSize: 14,
                    rectRadius:rectRadius,
                    // text:element.html(),                    
                }
            };
            break;
        case 'img':

            return {
                'IMAGE':{
                    x: parsedPosition.x+'%',
                    y: parsedPosition.y+'%',
                    w: parsedPosition.w+"%",
                    h: parsedPosition.h+"%",
                    path:element.attr('src')
                }
            };
            break;
        default:
            return {};
            break;
    }
};

let getSpanJSONConfig = (element)=>{
    if(element[0].nodeName == "#text"){ return false; }
    let style = getParsedStyle(element); 
    let position = getPosition(element);
    let parsedPosition = getParsedPosition(position);

    // return true

    let colorStyle = style.filter((s)=>{ return s[0] == "background-color"; });
    let textColorStyle = style.filter((s)=>{ return s[0] == "color"; });    
    let textAlignStyle = style.filter((s)=>{ return s[0] == "text-align"; });
    let roundedStyle = style.filter((s)=>{ return s[0] == "border-radius"; });
    let fontSizeStyle = getSingleStyleByName('font-size',style);
    let fontFaceStyle = getSingleStyleByName('font-family',style);

    let color = "ffffff"; //default color
    let textAlign = "left";
    let rectRadius = 0;
    let textColor = "000000";
    let fontSize = 14;
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

    if(fontSizeStyle.length > 0){
        fontSize = fontSizeStyle[0][1].trim().replace('px','');
    }
    if(fontFaceStyle.length > 0){
        fontFace = fontFaceStyle[0][1].trim();
    }
    fontSize = (30 * fontSize / 75);
    return {
        text : element.text(),
        options : {
            fontSize : fontSize,
            color : textColor,
            align : textAlign
        }
    };
};

let parseHtml = (holder,jsonConfig)=>{
    if(holder.children().length != 0){
        holder.each((id,singleElem)=>{
            let resp = getJSONConfigByTag($(singleElem));
            jsonConfig.push(resp);
        });        
        if(holder.hasClass("text-block")){
            let textBlockContent = [];
            holder.find(' > span').each((id,span)=>{
                textBlockContent.push(getSpanJSONConfig($(span)));
            });
            let position = getPosition(holder);
            let parsedPosition = getParsedPosition(position);
            console.log(parsedPosition);
            jsonConfig.push({
                "TEXT" :    {
                    textBlockContent : textBlockContent,
                    position : {
                        x:parsedPosition.x+"%",
                        y:parsedPosition.y+"%",
                        w:parsedPosition.w+"%",
                        h:parsedPosition.h+"%"
                    }
                }
            });
        }
        // let resp = getJSONConfigByTag($(holder));
        // jsonConfig.push(resp);
        return parseHtml(holder.children(),jsonConfig);
    }else{
        holder.each((id,singleElem)=>{
            let resp = getJSONConfigByTag($(singleElem));
            jsonConfig.push(resp);
        });
    }

    // holder.each((id,elem)=>{
    //     let config = getJSONConfigByTag($(elem));
    //     if(config){ jsonConfig.push(config); }
    // });
    return jsonConfig;
};

let generate = function() {

    pptx = new PptxGenJS();
    $.each(htmlSlides,(id,htmlSlide)=>{
        let slide = pptx.addSlide(id); 
        let jsonConfig = parseHtml($(htmlSlide),[]);
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
                case 'TEXT' :
                    slide.addText(configElement.textBlockContent,configElement.position);
            }            
        });
    });
    console.log(pptx.slides);    
    pptx.writeFile({
        fileName: 'Demo_one.pptx'
    });
}