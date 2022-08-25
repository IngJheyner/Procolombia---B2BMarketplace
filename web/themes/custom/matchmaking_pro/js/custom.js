/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

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

  Drupal.behaviors.matchmaking_pro = {
    attach: function(context, settings) {
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
      //if click outside menu_user, remove css
      $(document).click(function (e) {
        if ($(e.target).closest("#menu_user").length === 0) {
          $("#menu_drop").removeClass("active");
        }
      });
    }
  };

})(jQuery, Drupal);