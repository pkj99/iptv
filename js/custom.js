(function ($) {
    "use strict"; $(document).on('click', '#sidebarToggle', function (e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-toggled"); $(".sidebar").toggleClass("toggled");
    });
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
        if ($window.width() > 768) {
            var e0 = e.originalEvent, delta = e0.wheelDelta || -e0.detail; this.scrollTop += (delta < 0 ? 1 : -1) * 30; e.preventDefault();
        }
    });
    const objowlcarousel = $('.owl-carousel-category');
    if (objowlcarousel.length > 0) {
        objowlcarousel.owlCarousel({ responsive: { 0: { items: 1, }, 600: { items: 3, nav: false }, 1000: { items: 4, }, 1200: { items: 8, }, }, loop: true, lazyLoad: true, autoplay: true, autoplaySpeed: 1000, autoplayTimeout: 2000, autoplayHoverPause: true, nav: true, navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"], });
    }
    const mainslider = $('.owl-carousel-login'); if (mainslider.length > 0) { mainslider.owlCarousel({ items: 1, lazyLoad: true, loop: true, autoplay: true, autoplaySpeed: 1000, autoplayTimeout: 2000, autoplayHoverPause: true, }); }
    $('[data-toggle="tooltip"]').tooltip()
    $(document).on('scroll', function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        }
        else { $('.scroll-to-top').fadeOut(); }
    });
    $(document).on('click', 'a.scroll-to-top', function (event) {
        var $anchor = $(this); $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });
    $(document).ready(function () {
        $(".channel").click(function () {
            let channel = $(this).data("value");
            console.log(channel);
            player.configure({ source: channel, });
            player.play();
        });
    });
})(jQuery);
var options = { valueNames: ['channel'] };
var userList = new List('lists', options);
function bait(element) {
    var value = $(element).val().toLowerCase();
    userList.search(value);
}