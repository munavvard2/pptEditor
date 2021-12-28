var Mylib = (function($) { //reference “namespace”, scope wrapper, encapsulates jQuery

var LIB = { //internal name of library
/**
* Testing function – indicates if our library is present
*/
”’test”’ : function(){ $(‘body’).prepend(‘SPECIAL library loaded’); } //page directives or sublibraries
,
/**
* General tools
*/
”’tools”’ : {
/**
* Console-log wrapper
*/
”’log”’ : function() { if( window.console && window.console.log ){
window.console.log( Array.prototype.slice.call(arguments) ); }
}//— lib.tools.log

}///—- lib.tools
,
/**
* Search namespace – related to search box or pages
*/
”’search”’ : {
/**
* Helper function
* @param msg a message for the alert
*/
”’notify”’ : function(msg){
alert(‘Doin’ the search:’ + msg);
}//— lib.search.notify
,
/**
* Enable advanced search box
*/
”’toggleAdvancedSearch”’ : function(){
this.notify( ‘self-reference the sublibrary OUTSIDE’ ); //call the sublibrary outside anon-func

$(function(){ //waits for document-ready
var $advancedSearch = $(‘#site-search-advanced’)
$searchResults = $(‘#search-results’)
;
LIB.tools.log( ‘here’s an example of self-referencing’ ); //call the library internally
LIB.search.notify( ‘self-reference the sublibrary INSIDE’ ); //call the sublibrary inside anon-func scope

//hide by default
$advancedSearch.slideUp(‘3000’);

$searchResults.delegate(‘#refine-search’, ‘click’, function(){
$advancedSearch.slideToggle();
return false;
});
});
}//— lib.search.toggleAdvancedSearch
}///—- lib.search
};////—- lib
return LIB; // send the internal name back out
})(jQuery); //scope wrapper, encapsulates jQuery