/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  // function to go to step 3
  function goToLogin() {
    window.location.href = "/user/login"
  }

  function goToRegister() {
    window.location.href = "/pre-register"
  }

  function goToEditCompanyCol() {
    window.location.href = "/editar/col/usuario"
  }

  function goToDashboardCompanyCol() {
    window.location.href = "/dashboard/col/user"
  }

  function show_right_menu() {
    var x = document.getElementById("right_menu");
    if (x) {
      if (x.style.display === "none") {
        x.style.display = "block";
        x.style.opacity = "1";
      } else {
        x.style.display = "none";
        x.style.opacity = "0";
      }
    }
  }



  Drupal.behaviors.matchmaking_pro = {
    attach: function (context, settings) {
      //call function login
      $("#btn_login", context).click(function () {
        goToLogin();
      });
      //call function register
      $("#btn_register", context).click(function () {
        goToRegister();
      });
      //call function edit profile col
      $("#edit_company_col", context).click(function () {
        goToEditCompanyCol();
      });
      //call function edit profile col
      $("#img_click", context).click(function () {
        goToDashboardCompanyCol();
      });
      //add css when click menu_user
      $("#menu_user", context).click(function () {
        //toggle style css
        $("#menu_drop").toggleClass("active");
      });
       //add css when click drop_menu
       $("#drop_menu", context).click(function () {
        //toggle style css
        $("#lenguaje").toggleClass("active_dropdown");
      });

      //if click outside menu_user, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#menu_drop").length === 0 && $(e.target).closest("#menu_user").length === 0) {
          //delay to remove css
          setTimeout(function () {
            $("#menu_drop").removeClass("active");
          }, 200);
        }
      });

      //click alert icon
      $("#right_bar", context).click(function () {
        show_right_menu()
      });
      //if click outside right_bar, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#right_menu").length === 0 && $(e.target).closest("#right_bar").length === 0) {
          var x = document.getElementById("right_menu");
          if (x) {
            x.style.display = "none";
            x.style.opacity = "0";
          }
        }
      });
    }
  };

})(jQuery, Drupal);
