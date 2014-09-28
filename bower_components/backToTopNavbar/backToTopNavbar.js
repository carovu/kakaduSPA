/**
* Functionality of your Back to the Top button, that appears, when you have to scroll your page.
*/
$(function(){
 
    $(document).on( 'scroll', function(){
 
        if ($(window).scrollTop() > 100) {
            $('.scroll-top-wrapper').addClass('show');
        } else {
            $('.scroll-top-wrapper').removeClass('show');
        }
    });
 
    $('.scroll-top-wrapper').on('click', scrollToTop);

    jQuery('body').bind('click', function(e) {
        if(jQuery(e.target).closest('.navbar').length == 0) {
            // click happened outside of .navbar, so hide
            var opened = jQuery('.navbar-collapse').hasClass('collapse in');
            if ( opened === true ) {
                jQuery('.navbar-collapse').collapse('hide');
            }
        }
    });
});
 
function scrollToTop() {
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $('body');
    offset = element.offset();
    offsetTop = offset.top;
    $('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
}