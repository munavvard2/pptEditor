//https://www.atlanticbt.com/insights/create-your-own-javascript-library/
//https://www.sitepoint.com/design-and-build-your-own-javascript-library/

if (typeof lsparse === "undefined")
	var lsparse = {}

lsparse = (function($) {

    var LIB = {
        test: () => console.log('Lib get loaded..'), //page directives or sublibraries

        getParsedPosition : (position)=> {
            let x = (position.x * 100) / 1280;
            let y = (position.y * 100) / 720;
            let w = position.width.includes('%') ? position.width.replace('%', '') : ((position.width.replace('px', '') * 100) / 1280);
            let h = position.height.includes('%') ? position.height.replace('%', '') : ((position.height.replace('px', '') * 100) / 720);


            // x = position.x;
            // y = position.y;
            // w = position.width;
            // h = position.height;
            // let w = ( ((position.width.replace('px','') * 100 ) / 1200) * 11.02) / 100;
            // let h = ( ((position.height.replace('px','') * 100 ) /720)  * 6.20) / 100;

            return {x, y, w, h};
        },

        getJSONConfigByTag : (element)=> {
            if (element[0].nodeName == "#text") {
                return false;
            }
            let style = getParsedStyle(element);
            let position = getPosition(element);
            let parsedPosition = LIB.getParsedPosition(position);

            // return true

            let colorStyle = style.filter((s) => {
                return s[0] == "background-color";
            });
            let textColorStyle = style.filter((s) => {
                return s[0] == "color";
            });
            let textAlignStyle = style.filter((s) => {
                return s[0] == "text-align";
            });
            let roundedStyle = style.filter((s) => {
                return s[0] == "border-radius";
            });
            let fontSizeStyle = getSingleStyleByName('font-size', style);
            let fontFaceStyle = getSingleStyleByName('font-family', style);

            let color = "ffffff"; //default color
            let textAlign = "left";
            let rectRadius = 0;
            let textColor = "000000";
            let fontSize = 14;
            if (colorStyle.length > 0) {
                color = colorStyle[0][1].trim().replace('#', '');
                if (isRGB(color)) {
                    color = rgbToHex(color).replace('#', '');
                }
            }
            if (textColorStyle.length > 0) {
                textColor = textColorStyle[0][1].trim().replace('#', '');
                if (isRGB(textColor)) {
                    textColor = rgbToHex(textColor).replace('#', '');
                }
            }
            if (textAlignStyle.length > 0) {
                textAlign = textAlignStyle[0][1];
            }
            if (roundedStyle.length > 0) {
                rectRadius = Math.round((parseInt(roundedStyle[0][1].replace('px', '').replace('%', '')) * 100) / 180, 1) / 20;
                // rectRadius = 0;
            }

            if (fontSizeStyle.length > 0) {
                fontSize = fontSizeStyle[0][1].trim().replace('px', '');
            }
            if (fontFaceStyle.length > 0) {
                fontFace = fontFaceStyle[0][1].trim();
            }
            fontSize = (30 * fontSize / 75);
            switch (element.tagName()) {
                case 'span-no-use':
                    return {
                        "RECTANGLE": {
                            shape: pptx.shapes.RECTANGLE,
                            x: parsedPosition.x + '%',
                            y: parsedPosition.y + '%',
                            w: parsedPosition.w + "%",
                            h: parsedPosition.h + "%",
                            // fill: { color:color },
                            color: textColor,
                            align: textAlign,
                            fontSize: fontSize,
                            rectRadius: rectRadius,
                            text: element.html().replaceAll('&nbsp;', ' '),
                        }
                    };
                case 'div':
                    return {
                        "RECTANGLE": {
                            shape: (rectRadius > 0) ? pptx.shapes.ROUNDED_RECTANGLE : pptx.shapes.RECTANGLE,
                            x: parsedPosition.x + "%",
                            y: parsedPosition.y + "%",
                            w: parsedPosition.w + "%",
                            h: parsedPosition.h + "%",
                            // fill: { color:"FFFFFF" },
                            color: textColor,
                            align: textAlign,
                            fontSize: 14,
                            rectRadius: rectRadius,
                            // text:element.html(),
                        }
                    };
                    break;
                case 'img':

                    return {
                        'IMAGE': {
                            x: parsedPosition.x + '%',
                            y: parsedPosition.y + '%',
                            w: parsedPosition.w + "%",
                            h: parsedPosition.h + "%",
                            path: element.attr('src')
                        }
                    };
                    break;
                default:
                    return {};
                    break;
            }
        },
        parseHtml : (holder,jsonConfig)=> {
            if (holder.children().length != 0) {
                holder.each((id, singleElem) => {
                    let resp = LIB.getJSONConfigByTag($(singleElem));
                    jsonConfig.push(resp);
                });
                if (holder.hasClass("text-block")) {
                    let textBlockContent = [];
                    holder.find(' > span').each((id, span) => {
                        textBlockContent.push(LIB.getSpanJSONConfig($(span)));
                    });
                    let position = getPosition(holder);
                    let parsedPosition = LIB.getParsedPosition(position);
                    jsonConfig.push({
                        "TEXT": {
                            textBlockContent: textBlockContent,
                            position: {
                                x: parsedPosition.x + "%",
                                y: parsedPosition.y + "%",
                                w: parsedPosition.w + "%",
                                h: parsedPosition.h + "%"
                            }
                        }
                    });
                }
                // let resp = LIB.getJSONConfigByTag($(holder));
                // jsonConfig.push(resp);
                return LIB.parseHtml(holder.children(), jsonConfig);
            } else {
                console.log('parseHtml in else,,')
                holder.each((id, singleElem) => {
                    let resp = LIB.getJSONConfigByTag($(singleElem));
                    jsonConfig.push(resp);
                });
            }

            // holder.each((id,elem)=>{
            //     let config = LIB.getJSONConfigByTag($(elem));
            //     if(config){ jsonConfig.push(config); }
            // });
            return jsonConfig;
        },
        getSpanJSONConfig : (element)=> {
            if (element[0].nodeName == "#text") {
                return false;
            }
            let style = getParsedStyle(element);
            let position = getPosition(element);
            let parsedPosition = LIB.getParsedPosition(position);

            // return true

            let colorStyle = style.filter((s) => {
                return s[0] == "background-color";
            });
            let textColorStyle = style.filter((s) => {
                return s[0] == "color";
            });
            let textAlignStyle = style.filter((s) => {
                return s[0] == "text-align";
            });
            let roundedStyle = style.filter((s) => {
                return s[0] == "border-radius";
            });
            let fontSizeStyle = getSingleStyleByName('font-size', style);
            let fontFaceStyle = getSingleStyleByName('font-family', style);

            let color = "ffffff"; //default color
            let textAlign = "left";
            let rectRadius = 0;
            let textColor = "000000";
            let fontSize = 14;
            if (colorStyle.length > 0) {
                color = colorStyle[0][1].trim().replace('#', '');
                if (isRGB(color)) {
                    color = rgbToHex(color).replace('#', '');
                }
            }
            if (textColorStyle.length > 0) {
                textColor = textColorStyle[0][1].trim().replace('#', '');
                if (isRGB(textColor)) {
                    textColor = rgbToHex(textColor).replace('#', '');
                }
            }
            if (textAlignStyle.length > 0) {
                textAlign = textAlignStyle[0][1];
            }
            if (roundedStyle.length > 0) {
                rectRadius = Math.round((parseInt(roundedStyle[0][1].replace('px', '').replace('%', '')) * 100) / 180, 1) / 20;
                // rectRadius = 0;
            }

            if (fontSizeStyle.length > 0) {
                fontSize = fontSizeStyle[0][1].trim().replace('px', '');
            }
            if (fontFaceStyle.length > 0) {
                fontFace = fontFaceStyle[0][1].trim();
            }
            fontSize = (30 * fontSize / 75);
            return {
                text: element.text(),
                options: {
                    fontSize: fontSize,
                    color: textColor,
                    align: textAlign
                }
            };
        },
        applyCssToInline : () => {
            s = getComputedStyle(el);
        },

        extractBetString : function(str, begin, ending){
            let extract  = function([beg, end]) {
                const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
                const normalise = (str) => str.slice(beg.length, end.length * -1);
                return function (str) {
                    return str.match(matcher).map(normalise);
                }
            }
            let fineclasses = extract([begin,ending]);
            return fineclasses(str);
        },


        /**
        * General tools
        */
        tools : {
        /**
        * Console-log wrapper
        */
            log : function() { if( window.console && window.console.log ){
                window.console.log( Array.prototype.slice.call(arguments) ); }
            }//— lib.tools.log

        },///—- lib.tools
        search: {
            notify: function (msg) {
                alert("Doin the search:" + msg);
            },

            /**
             * Enable advanced search box
             */
            toggleAdvancedSearch: function () {
                this.notify("self-reference the sublibrary OUTSID");
                $(function () {
                    var $advancedSearch = $("#site-search-advanced")
                    $searchResults = $("#search-results");
                    LIB.tools.log( "here's an example of self - referencing");
                    LIB.search.notify("self - reference the sublibrary INSIDE");

                    $advancedSearch.slideUp("3000");

                    $( "body" ).delegate($searchResults,"myCustomEvent",

                        function() {
                            $advancedSearch.slideToggle();
                            return false;
                        }
                    );
                    $searchResults.trigger( "myCustomEvent" );
                });
            }//— lib.search.toggleAdvancedSearch
        },
        math : {
          'factit': function factorial(n) {
            console.log(n)
            if (n <= 1) {
              return 1;
            }
            return n * factorial(n - 1);
          }
        }
    }// ends LIB


    return LIB;
})(jQuery);