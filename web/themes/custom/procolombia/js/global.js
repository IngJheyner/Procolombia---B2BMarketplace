/**
 * @file
 * Global utilities.
 *
 */

(function ($, Drupal) {
  "use strict";
  /*Datalayer*/
  var datos = jQuery(".categories").text();
  if (datos) {
    datos = datos.trim();
    datos = datos.split(":");
    if (datos[2]) {
      var subcategoriaSitio = datos[2].trim();
      datos = datos[1].split("\n");
      var categoriaSitio = datos[0].trim();
    }
  } else {
    if (
      window.location.pathname.includes("productos") ||
      window.location.pathname.includes("products")
    ) {
      var i = window.location.pathname.split("/");
      if (i[3]) {
        var categoriaSitio = i[3].replace(/-|_/g, " ");
      } else {
        var categoriaSitio = "No registra";
      }

      if (i[4]) {
        var subcategoriaSitio = i[4].replace(/-|_/g, " ");
      } else {
        var subcategoriaSitio = "No registra";
      }
    } else {
      var subcategoriaSitio = "No registra";
      var categoriaSitio = "No registra";
    }
  }

  if (document.querySelector('meta[name="keywords"]')) {
    var palabrasClave = document.querySelector('meta[name="keywords"]').content;
  } else {
    var palabrasClave = "No registra";
  }
  var idiomaSitio = document.documentElement.lang;
  var tituloSitio = jQuery("h1").text().trim();
  var pagina = window.location.pathname;
  var f = new Date();
  var fecha =
    f.getDate() +
    "/" +
    (f.getMonth() + 1) +
    "/" +
    f.getFullYear() +
    " " +
    f.getHours() +
    ":" +
    f.getMinutes() +
    ":" +
    f.getSeconds();

  jQuery.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: "https://ip-api.io/api/json",
    dataType: "json",
    success: function (data) {
      var ciudad = data.city;

      window.dataLayer.push({
        siteIdioma: idiomaSitio,
        siteTitulo: tituloSitio,
        siteCategoria: categoriaSitio,
        siteSubcategoria: subcategoriaSitio,
        siteKeyword: palabrasClave,
        siteCurrentPage: pagina,
        siteVisitDate: fecha,
        siteLocation: ciudad,
      });
    },
    error: function (data) {
      var ciudad = "No city";
      window.dataLayer.push({
        siteIdioma: idiomaSitio,
        siteTitulo: tituloSitio,
        siteCategoria: categoriaSitio,
        siteSubcategoria: subcategoriaSitio,
        siteKeyword: palabrasClave,
        siteCurrentPage: pagina,
        siteVisitDate: fecha,
        siteLocation: ciudad,
      });
    },
  });

  /**
   * Certif_scroll
   * @return {[type]} [description]
   */
  function add_scroll_class_to_certific() {
    if ($("body").hasClass("node--type-product")) {
      let $ctn_certif = $(".field--name-field-file-certifications"),
        $ctn_certif_items = $ctn_certif.find(".field__items"),
        $certif_items = $ctn_certif_items.find(".field__item");
      if ($certif_items.length > 4) {
        $ctn_certif_items.addClass("certific-items-scroll");
      }
    }
  }
  /**
   * attach select 2 dropdown country position
   */
  function attach_select_2_country_webform() {
    if ($(".form-item-country .select2").length > 0) {
      $("#edit-country").select2({
        dropdownParent: $(".form-item-country"),
      });
    }
  }

  /**
   * change_company_link_see_more_products
   * Change href attribute in company link 'see more products'
   */
  function change_company_link_see_more_products() {
    if ($("body").hasClass("node--type-product")) {
      if (
        $("#block-views-block-company-view-detail-product-block-1").length > 0
      ) {
        let link_title = $(".block-content-company .title a");
        if (link_title.length > 0) {
          let href_title = link_title.attr("href"),
            link_see_more = $(".block-buttons .btn-primary"),
            id_products_blocks = $(".id-block-products").attr("data-id");
          link_see_more.attr("href", href_title + "#" + id_products_blocks);
        }
      }
    }
  }

  /**
   * login_header
   * @return {[type]} [description]
   */
  function login_header(context) {
    // Login Header
    $(".inicio-sesion", context)
      .once("loginHeader")
      .click(function (e) {
        e.preventDefault();
        $(".block-custom-login").toggleClass("is-hidden");
      });

    // Close login header
    $(".block-custom-login .link-close", context)
      .once("closeLoginHeader")
      .click(function (e) {
        e.preventDefault();
        $(".block-custom-login").toggleClass("is-hidden");
      });
  }

  /**
   * remove_white_space_in_product_and_company
   * @return {[type]} [description]
   */
  function remove_white_space_in_view_detail_product_and_company() {
    var view = null;
    if ($("body").hasClass("node--type-company")) {
      view = $(".products-list-detail-company");
    }
    if ($("body").hasClass("node--type-product")) {
      view = $(".company-view-detail-product");
    }
    if (view != null && view.find(".view-content").length == 0) {
      view.parents(".content-bottom").addClass("hidden");
    }
  }
  /**
   * change html tag in view-related-products
   * @return {[type]} [description]
   */
  function remove_h3_space_in_view_view_related_products() {
    var view = null;
    if ($("body").hasClass("node--type-product")) {
      view = $(".view-related-products");
    }
    if (view != null && view.find("h3").length != 0) {
      view.find("h3").each(function () {
        $(this).replaceWith(
          $('<div class= "product-name">' + this.innerHTML + "</div>")
        );
      });
    }
  }

  /**
   * Infinite scroll on views
   * @return {[type]} [description]
   */
  function infinite_scroll_in_view_products_list_in_detail_company() {
    var view = null;
    var total_items = 0;
    var inactive_scroll = null;
    var active_scroll = null;
    var view_products_list_header = null;
    var view_products_list_content = null;
    if ($("body").hasClass("node--type-company")) {
      view = $(".view-products-list-in-detail-company");
    }
    if ($("body").hasClass("node--type-product")) {
      view = $(".view-products-list-in-detail-company");
    }
    if (view != null && view.find(".view-content").length != 0) {
      total_items = view.find(
        ".view-content.col-md-10.col-sm-9.col-xs-1.row.p-0 .col-md-3"
      ).length;
      view_products_list_content = view.find(
        ".view-content.col-md-10.col-sm-9.col-xs-1.row.p-0"
      );
      view_products_list_header = view.find(
        ".view-header.col-md-2.col-sm-3.col-xs-1"
      );
      if (total_items > 4) {
        $(".view-more-less").removeClass("inactive");
        $(".view-more-less")
          .unbind()
          .click(function (e) {
            e.preventDefault();
            inactive_scroll = $(".view-more-less .inactive");
            active_scroll = $(".view-more-less .active");
            inactive_scroll.addClass("active");
            inactive_scroll.removeClass("inactive");
            active_scroll.addClass("inactive");
            active_scroll.removeClass("active");
            view_products_list_header.each(function () {
              $(this).toggleClass("all-items");
            });
            view_products_list_content.each(function () {
              $(this).toggleClass("all-items");
            });
          });
      }
    }
  }

  /**
   * view more less products btn
   * @return {[type]} [description]
   */
  function categories_description_show_more_less() {
    var btn_more = null;
    var btn_less = null;
    var description = null;
    if ($(".view-more-less-btn-descript").length > 0) {
      btn_more = $(".view-more-less-btn-descript .more");
      btn_less = $(".view-more-less-btn-descript .less");
      description = $(".search-descript");
      btn_more.click(function (event) {
        event.preventDefault();
        description.addClass("active");
        btn_more.addClass("inactive");
        btn_less.removeClass("inactive");
        btn_more.removeClass("active");
        btn_less.addClass("active");
      });
      btn_less.click(function (event) {
        event.preventDefault();
        description.removeClass("active");
        btn_less.addClass("inactive");
        btn_less.removeClass("active");
        btn_more.removeClass("inactive");
        btn_more.addClass("active");
      });
    }
  }
  /**
   * view more less products btn
   * @return {[type]} [description]
   */
  function show_filters_exposed_form() {
    if ($(".mcr85 .search-companies-expose-filter").length > 0) {
      $(".mcr85 .search-companies-expose-filter .component__content")
        .once()
        .toggleClass("d-none");
      $(".mcr85 .search-companies-expose-filter .component__heading")
        .once()
        .click(function () {
          $(
            ".mcr85 .search-companies-expose-filter .component__content"
          ).toggleClass("d-none");
        });
    }
  }

  /**
   * Reset btn macrorueda
   * @return {[type]} [description]
   */
  function reset_filters_macrorueda() {
    if ($("#views-exposed-form-search-companies-block-2").length > 0) {
      $("#views-exposed-form-search-companies-block-2 #edit-reset")
        .once()
        .click(function (e) {
          e.preventDefault();
          window.location.href =
            document.location.protocol +
            "//" +
            document.location.host +
            document.location.pathname;
        });
    }
  }

  /**
   * Background info color oferta especializada
   * @return {[type]} [description]
   */
  function background_color_info_ofert() {
    if ($(".oferta-especializada .row-oferta-especializada").length > 0) {
      $(".oferta-especializada .row-oferta-especializada").each(function () {
        var bgcolor = $(".info-color", this).text() + "!important";
        $(".info", this).attr("style", "background-color: " + bgcolor);
      });
    }
  }

  /**
   * Background info color oferta especializada
   * @return {[type]} [description]
   */
  function background_color_taxonomy_specialized_offer() {
    if ($(".taxonomy-primary-color").length > 0) {
      var primary_color_tx = $(".taxonomy-primary-color").first().text().trim();
      $(".tx-primary-background-color").css(
        "background-color",
        primary_color_tx
      );
      $(".tx-primary-font-color").css("color", primary_color_tx);
      $(".tx-primary-border-color").css("color", primary_color_tx);
      $(".tx-primary-background-color-hover").hover(function (e) {
        $(this).css(
          "background-color",
          e.type === "mouseenter" ? primary_color_tx : "transparent"
        );
      });
    }
  }

  $.fn.inputFilterSpace = function () {
    return this.on(
      "keyup mouseup select contextmenu drop bind focus",
      function () {
        this.value = this.value.replace(/ /g, "");
      }
    );
  };
  /**
   * Scroll over quicktabs
   * @return {[type]} [description]
   */
  function scrollQuicktabs() {
    $(".slick__arrow.quicktabs .slick-prev")
      .once()
      .click(function () {
        var quicktab_parent_id = $(this)
          .closest(".quicktabs-wrapper")
          .attr("id");
        var scroll_element = "#" + quicktab_parent_id + " .quicktabs-tabs";
        $(scroll_element).animate(
          {
            scrollLeft: "-=400",
          },
          1000
        );
      });
    $(".slick__arrow.quicktabs .slick-next")
      .once()
      .click(function () {
        var quicktab_parent_id = $(this)
          .closest(".quicktabs-wrapper")
          .attr("id");
        var scroll_element = "#" + quicktab_parent_id + " .quicktabs-tabs";
        $(scroll_element).animate(
          {
            scrollLeft: "+=400",
          },
          1000
        );
      });
  }
  /**
   * modal search click events
   * @return {[type]} [description]
   */
  function modalSearchCategories(context) {
    // create the search url
    $(context)
      .find(".tx-input-checkbox")
      .once()
      .change(function () {
        if (this.checked) {
          // checked event
          $(context)
            .find(".tx-input-checkbox#check-term-0")
            .prop("checked", false)
            .prop("disabled", true);
        } else {
          // unchecked event
          if ($(".tx-input-checkbox:checked").length <= 0) {
            $(context)
              .find(".tx-input-checkbox#check-term-0")
              .prop("checked", true)
              .prop("disabled", false);
          }
        }
        let checkCategories = $(
          '.tx-input-checkbox[id!="check-term-0"]:checked'
        );
        let countCategories = checkCategories.length;
        let iniHref = $(context)
          .find("#modal-submit-buscador-b2b-mp-2021")
          .attr("href");
        let baseHref = iniHref.split("&")[0];
        let newHref = baseHref;
        let searchHref = newHref;
        let categories = "";
        if (countCategories > 0) {
          checkCategories.each(function (index) {
            categories = categories + "&categories[]=" + this.value + "";

            let searchCategoryValue =
              "&pr%5B" + index + "%5D=ct%3A" + this.value;
            newHref = searchHref + searchCategoryValue;
            searchHref = newHref;
          });
          newHref = newHref + "" + categories;
          searchHref = newHref;
        }
        $(context)
          .find("#modal-submit-buscador-b2b-mp-2021")
          .attr("href", newHref);
      });
    // close modal on button click
    $(context)
      .find("#modal-reset")
      .once()
      .click(function (e) {
        e.preventDefault();
        $("button.ui-dialog-titlebar-close").first().click();
      });
  }
  /**
   * Behaviors
   */
  Drupal.behaviors.global = {
    attach: function (context) {
      // Add scroll class to certifications in product detail
      add_scroll_class_to_certific();

      // Attach select 2 dropdown to field country
      attach_select_2_country_webform();

      // Change link to company "See more products" (Product detail)
      change_company_link_see_more_products();

      // Login header
      login_header(context);

      // Drupal Messages
      if ($(".prepend-messages").length === 0) {
        $(".highlighted").find(".alert").removeClass("is-hidden");
      }

      // Body scroll
      $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
          $("body").addClass("scrolled");
        } else {
          $("body").removeClass("scrolled");
        }
      });

      // Autocomplete off
      $("body").find("input[type=password]").attr("autocomplete", "off");

      // Menu mobile
      $("#mobileNav").click(function (e) {
        $(".header-mobile-menu").toggleClass("is-hidden");
      });

      // Product Detail
      if ($("body").hasClass("node--type-product")) {
        $(".product-certifications").click(function (e) {
          e.preventDefault();
          $(this).parent().next().toggleClass("is-hidden");
          $(this).toggleClass("expand");
        });
      }

      // Popup message
      if ($(".popup-message").length > 0) {
        $("body").addClass("exist-modal");
      }

      // Company and product detail
      if (
        $("body").hasClass("node--type-product") ||
        $("body").hasClass("node--type-company")
      ) {
        // Company form contact message
        if ($(".company-confirmation-message").length > 0) {
          $(".company-confirmation-message .close").click(function (e) {
            e.preventDefault();
            window.location.reload(true);
          });
        }
      }

      if ($("body").hasClass("path-dashboard-buyer")) {
        $("ol.breadcrumb")
          .find("li")
          .each(function () {
            var li = $(this);
            if (li.text().trim() == "Dashboard buyer") {
              li.text("My Profile");
            }
          });

        var admin_profile_text = $(
          "#block-dashboardedituser .info-user .header"
        ).find("span");
        if (admin_profile_text.text().trim() == "Administrator profile") {
          admin_profile_text.text("Buyer Profile");
        }
      }

      // Remove white space when not results in view company detail
      remove_white_space_in_view_detail_product_and_company();

      // infinite scroll on views
      infinite_scroll_in_view_products_list_in_detail_company();

      // Show filters on click
      show_filters_exposed_form();

      // remove h3 tag in view
      remove_h3_space_in_view_view_related_products();

      // reset filters macrorueda
      reset_filters_macrorueda();

      // background color info oferta
      background_color_info_ofert();

      // view more less products btn
      categories_description_show_more_less();

      // Carousel Categories home
      $(".categories-carousel").owlCarousel({
        center: true,
        items: 3,
        loop: true,
        margin: 20,
        nav: true,
        autoPlay: 5000,
      });
      $("#edit-name").inputFilterSpace();
      //Scroll over quicktabs
      scrollQuicktabs();
      modalSearchCategories(context);
    },
  };
  $(document).ready(function () {
    // Attach select 2 dropdown to field country
    attach_select_2_country_webform();
  });

  $(".click").click(function () {
    $("#Modal").modal("show");
  });

  $(".close").click(function () {
    $("#Modal").modal("hide");
  });

  let resultados = $("#quicktabs-tabpage-buscador_qt-0 .res-total").html();

  $("#quicktabs-tab-buscador_qt-0 .quicktabs-loaded").append(
    '<div class="resultados-b">' + resultados + "</div>"
  );

  let resultados1 = $("#quicktabs-tabpage-buscador_qt-1 .res-total").html();

  $("#quicktabs-tab-buscador_qt-1 .quicktabs-loaded").append(
    '<div class="resultados-b">' + resultados1 + "</div>"
  );

  $(document).ready(function () {
    $("#edit-submit-buscador-b2b-mp-2021").click(function () {
      $(".tx-label-checkbox").addClass("checkbox");

      $(".tx-input-checkbox").after('<span class="check"></span>');
    });

    $(
      ".page-taxonomy-term-16226 .specialized-offer-page-wrapper .description strong"
    ).attr("style", "color: #534f4f !important");
  });

  $(document).ready(function () {
    $("#edit-title--2").keyup(function () {
      var value = $(this).val();
      $("#edit-field-body-value--2").val(value);
    });
  });

  $(document).ready(function () {
    $("#edit-title").keyup(function () {
      var value = $(this).val();
      $("#edit-field-body-value").val(value);
    });
  });

  var bgImage = $(".specialized-offer-page-wrapper .view-filters").css(
    "background-color"
  );

  $(".view-specialized-offer-search-companies .info-busqueda").css(
    "background-color",
    bgImage
  );

  $(document).ready(function () {
    // use esta configuracion simple para valores por defecto
    //$('div.expandable p').expander();
    // *** O ***
    // configure de la siguiente manera

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      $("div.specialized-offer-page-wrapper .description .row").expander({
        slicePoint: 200, // si eliminamos por defecto es 100 caracteres
        expandText:
          '<br> Leer más <div class="arrow-leer-mas arrow down"></div>', // por defecto es 'read more...'
        collapseTimer: 0, // tiempo de para cerrar la expanción si desea poner 0 para no cerrar
        userCollapseText:
          'Leer menos <div class="arrow-leer-menos arrow up"></div>', // por defecto es 'read less...'
      });

      $(
        ".node--type-company .layout-main-wrapper .wrapper-rigth .field--type-string-long, .node--type-old-company .layout-main-wrapper .wrapper-rigth .field--type-string-long"
      ).expander({
        slicePoint: 250, // si eliminamos por defecto es 100 caracteres
        expandText:
          '<br> Leer más <div class="arrow-leer-mas arrow down"></div>', // por defecto es 'read more...'
        collapseTimer: 0, // tiempo de para cerrar la expanción si desea poner 0 para no cerrar
        userCollapseText:
          'Leer menos <div class="arrow-leer-menos arrow up"></div>', // por defecto es 'read less...'
      });
    }
  });
})(jQuery, Drupal);

jQuery(document).ready(function () {
  jQuery(".banner-register-forms").parent().css("display", "contents");
  jQuery('input[type="checkbox"]:checked')
    .parent()
    .parent()
    .parent()
    .prev()
    .prev()
    .addClass("active");

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  jQuery(
    ".page-taxonomy-term-16226 .specialized-offer-page-wrapper .description strong"
  ).attr("style", "color: #534f4f !important");

  jQuery(".menu-b").click(function () {
    jQuery("#busqueda-buscador").toggle();
  });
  jQuery(".menu-f").click(function () {
    jQuery("#busqueda-filtro").toggle();
  });

  // .path-resultado-de-busqueda #block-catalogo-public-content .views-element-container .view-header .view-id-filtros .views-field.views-field-nothing

  jQuery(".view-id-filtros .views-field.views-field-nothing").click(
    function () {
      jQuery(".view-id-filtros .views-field.views-field-nothing")
        .next("div")
        .children()
        .removeClass("show")
        .addClass("hidden");
      jQuery(this)
        .next("div")
        .children()
        .removeClass("hidden")
        .addClass("show");
    }
  );
});
