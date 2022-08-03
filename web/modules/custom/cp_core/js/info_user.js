/**
 * @file
 * Suscriptor file.
 */
(function ($, Drupal) {'use strict';
  // show edit form data
  jQuery(document).ready(function($) {
    $('.info-user').on('click', 'a.edit', function (e) {
      e.preventDefault();
      if ($(this).hasClass('show-form')) {
        $(this).removeClass('show-form');
        $(this).addClass('hide-form');
        $('.info-fields .is-hidden').removeClass('is-hidden');
        $('.info-fields span').not('.only-read, .title').addClass('is-hidden');
        $('.edit-info-user').removeClass('is-hidden');
        $('.actions').removeClass('is-hidden');
      }
      else {
        $(this).addClass('show-form');
        $(this).removeClass('hide-form');
        $('.info-fields span').removeClass('is-hidden');
        $('.info-fields input').addClass('is-hidden');
        $('.edit-info-user').addClass('is-hidden');
        $('.actions').addClass('is-hidden');
      }
    });
  });


  Drupal.behaviors.cp_core_info_user = {
    attach: function (context) {

      $(function () {
        if ($('.info-user').hasClass('first_login')) {
          $('.info-fields .is-hidden').removeClass('is-hidden');
          $('.info-fields span').not('.only-read, .title').addClass('is-hidden');
          $('.edit-info-user').removeClass('is-hidden');
          $('.actions').removeClass('is-hidden');
          $('.info-user a.edit').off('click');

          $('.content-info a, .content-add-product a').on('click', function () {
            return false;
          })
        }
      });

      $('.actions button').click(function (e) {
        e.preventDefault();
        $.post("/user-dashboard/edit", {
          mail: $('#mail-user').val(),
          companyid: $('#company-nit').val(),
          password: $('#password-user').val(),
          cpassword: $('#cpassword-user').val()
        })
          .done(function (data) {
            $('.edit-info-user .message').html('');
            $('.edit-info-user .info-fields .password input').val('');
            if (data.flag) {
              $('.edit-info-user .message').append('<p class="alert alert-success">' + data.message + '</p>');
              $('.info-user .info-fields .mail span').text($('#mail-user').val());
              window.location.reload();
            }
            else {
              $('.edit-info-user .message').append('<p class="alert alert-danger">' + data.message + '</p>');
            }
          });
      });
    }
  }

}(jQuery, Drupal));
