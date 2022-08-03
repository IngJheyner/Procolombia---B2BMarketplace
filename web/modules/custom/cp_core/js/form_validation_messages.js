/**
 * @file
 * Validation messages file.
 */

(function ($, Drupal) {'use strict';
  Drupal.behaviors.form_validation = {
    attach: function (context) {
      
      if ($('.prepend-messages').length > 0) {
        if ($('.highlighted').find('div.alert').length > 0) {
          var alert = $('.highlighted').find('div.alert'),
          alert_clone = alert.clone();
          alert.remove();
          alert_clone.prependTo('.prepend-messages').removeClass('is-hidden').show();
        }
      } else {
        $('.highlighted').find('.alert').removeClass('is-hidden');
      }

      if ($('.error_messages').length > 0 && $('.error_messages').val() !== '') {
        var form_errors = JSON.parse($('.error_messages').val()),
          keys = Object.keys(form_errors),
          count = Object.keys(form_errors).length;
        for (i = 0; i < count; i++) {
          msg = form_errors[keys[i]];
          $('[name="' + keys[i] + '"]').after('<div class="invalid-feedback">' + msg + '</div>' );
        }
      }

    }
  }
}(jQuery, Drupal));
