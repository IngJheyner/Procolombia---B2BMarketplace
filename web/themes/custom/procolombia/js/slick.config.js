(function ($, Drupal, window, document) {

  Drupal.behaviors.catalogo_publicSlickConfig = {
    attach: function (context, settings) {

      $(".js-slick-single-item-center").slick({
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              adaptiveHeight: true,
            }
          },
          {
            breakpoint: 960,
            settings: {
              adaptiveHeight: true,
            }
          },
        ]
      });

    }
  };

}(jQuery, Drupal, this, this.document));
