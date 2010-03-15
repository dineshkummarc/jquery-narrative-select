/**
 * JQuery Narrative Select Plugin
 *
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Written by Shahrier Akram <shahrier.akram@gmail.com>
 *
 * A JQuery plugin to homogenize select box look & interaction across modern browsers and OS 
 * Visit http://gdakram.github.com/jquery-narrative-select for more info.
**/

(function($) {

   $.fn.narrativeselect = function(settings) {
     // Configuration setup
     config = { 
       'tooltip_opacity' : 0.90
     }; 
     if (settings) $.extend(config, settings);

     /**
      * Apply interaction to all the matching elements
      **/
     this.each(function() {
       if ($(this).attr("multiple")) return;
       if ($(this).is(":visible")) _apply_narrative_skin($(this));
     });          

     var narrative_tooltip = _create_narrative_tooltip();
     
     /**
      * Replaces the select box with the 
      * narrative style interaction
      **/
     function _apply_narrative_skin(select_elm) {
       select_elm.css({"display":"none"});
       var narrative_select_text = $("<div class='narrative_select'></div>");

        // Select Box On Change Interaction
        select_elm.bind("change", function(e) {
          var container =  $($(this).parent());
          $(container.find("span.text")).html(_get_current_text(this)).fadeOut(200).fadeIn(200);
          _close_tooltip();
        });
       
       // Narrative Select On Click Interaction
       narrative_select_text.bind("click", function(event) {
         //populate the narrative tooltip
         var html = "";
         var selected_index = select_elm.attr("selectedIndex");
         // optgroup construction          
         if (select_elm.find("optgroup").length > 0) {
           total_index = 0
           select_elm.find("optgroup").each(function(i,opt_elm){
             opt_elm = $(opt_elm);
             html += "<ul><span class='label'>" + opt_elm.attr("label") + "</span>";
             opt_elm.find("option").each(function(i,elm){
               current = (total_index == selected_index) ? "current" : "";
               html += "<li index='"+ total_index +"' class='"+current+"'>" + $(elm).attr("text") + "</li>\n";
               total_index += 1;
             });             
             html += "</ul>";
           })           
         } 
         // standard construction
         else {
           select_elm.find("option").each(function(i,elm){
             current = (i == selected_index) ? "current" : "";
             html += "<li index='"+i+"' class='"+current+"'>" + $(elm).attr("text") + "</li>\n";
           });           
           html = $("<ul>" + html + "</ul>");           
         }         
         narrative_tooltip.find("div.narrative_content").html(html);

         // Add click interactions
         narrative_tooltip.find("li").bind("click", function() {
           select_elm.attr("selectedIndex", $(this).attr("index"));
           select_elm.trigger("change");
         });         
         //  position the tooltip
         var tooltip_position = { left : 0, top : 0};
         tooltip_position.left = event.clientX - (narrative_tooltip.outerWidth()/2);
         tooltip_position.top = event.clientY - (narrative_tooltip.outerHeight()/2);
         narrative_tooltip.css({"left" : tooltip_position.left , "top" : tooltip_position.top}).show();
         // apply animated scroll
         var pos = narrative_tooltip.find("li.current").position();
         var top = pos.top - (narrative_tooltip.outerHeight()/2);
         narrative_tooltip.find("div.narrative_content").animate({scrollTop : top},300);
       })       
       select_elm.wrap(narrative_select_text);
       $("<span class='text'>" + _get_current_text(select_elm) + "</span>").appendTo(select_elm.parent());
     }

     /**
      * Hides away the narrative tooltip element
      * and unbinds events inside its children
      **/        
     function _close_tooltip() {
       var narrative_tooltip = $("#narrative_tooltip");
       narrative_tooltip.fadeOut(200);
       narrative_tooltip.find("li").unbind();
       narrative_tooltip.find("div.narrative_content").html("");
     }

     /**
      * Creates the Narrative Tooltip Element
      * if it doesn't already exist;
      **/           
     function _create_narrative_tooltip() {
       if ($("#narrative_tooltip").length == 0) {
         var narrative_tooltip = $("<div id='narrative_tooltip'>\
           <div class='close_button' title='Close'></div>\
           <div class='narrative_content'>\
           </div>\
         </div>").appendTo('body');
         narrative_tooltip.find("div.narrative_content").css({"opacity":config.tooltip_opacity});
         narrative_tooltip.find("div.close_button").bind("click", function() {
            _close_tooltip();
         });     
         $(document).bind('keydown',function(e){
           if ((e.keyCode == 27) && $("#narrative_tooltip").is(':visible')) {
             _close_tooltip();
           }      
        }).bind("click",function(e){
          tooltip = $("#narrative_tooltip");
          x_range = [tooltip.offset().left, tooltip.offset().left +  tooltip.outerWidth()];
          y_range = [tooltip.offset().top, tooltip.offset().top +  tooltip.outerHeight()];
          if (e.clientX < x_range[0] || e.clientX > x_range[1] || e.clientY < y_range[0] || e.clientY > y_range[1]) {
            _close_tooltip();
          }
        });         
       }
       return $("#narrative_tooltip");
     }
     
     /**
      * Gets the text of the current selected Index of the selected Element
     **/
     function _get_current_text(select_elm){
       var text = $(select_elm).find("option:selected").text();
       if (text.length == 0) {
         return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
       } else {
         return text;
       }      
     }
     
     return this; 
   };
 
})(jQuery);
