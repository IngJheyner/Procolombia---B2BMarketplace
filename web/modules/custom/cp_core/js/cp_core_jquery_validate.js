/**
 * @file
 * Suscriptor file.
 */

(function ($, Drupal) {
  'use strict';

  /**
   * validate_product_form
   * @param  {[type]} $form [description]
   * @return {[type]}       [description]
   */
  function validate_product_form($form) {
    var validate_rules = {
      'product_name_es': {
        required: true,
      },
      'product_name_en': {
        required: true,
      },
      'descp_es': {
        required: true,
        maxlength: 1000,
      },
      'descp_en': {
        required: true,
        maxlength: 1000,
      },
      'prod_type': {
        required: true,
      },
      'tariff_position': {
        required: $('#edit-prod-type').val() == 'product',
        minlength: 6,
        maxlength: 10,
        digit: true
      },
      'sector': {
        required: true,
      },
      'subsector': {
        required: true,
      },
      'files[img_1]': {
        required: true,
        accept: "image/jpeg, image/pjpeg, images/png"
      }
    };

    var validate_messages = {
      'product_name_es': {
        required: 'Este campo es obligatorio',
      },
      'product_name_en': {
        required: 'Este campo es obligatorio',
      },
      'descp_es': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 1000 caracteres',
      },
      'descp_en': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 1000 caracteres',
      },
      'prod_type': {
        required: 'Este campo es obligatorio',
      },
      'tariff_position': {
        required: 'Este campo es obligatorio',
        minlength: 'Digite minimo 6 caracteres',
        maxlength: 'Digite máximo 10 caracteres',
        digit: 'Solo debe ingresar números'
      },
      'sector': {
        required: 'Este campo es obligatorio',
      },
      'subsector': {
        required: 'Este campo es obligatorio',
      },
      'files[img_1]': {
        required: 'Este campo es obligatorio',
        accept: 'Sjashrbfjsk'
      }
    };

    $form.validate({
      ignore: ".ignore",
      rules: validate_rules,
      messages: validate_messages,
    });
  }


  /**
   * validate_company_form
   * @param  {[type]} $form [description]
   * @return {[type]}       [description]
   */
  function validate_company_form($form) {
    var validate_rules = {
      'company_name': {
        required: true,
      },
      'url': {
        required: true,
        url: true
      },
      'sector': {
        required: true,
      },
      'ciiu_code_0': {
        required: true,
      },
      'descp_es': {
        required: true,
        maxlength: 1000,
      },
      'descp_en': {
        required: true,
        maxlength: 1000,
      },
      'contact_name': {
        required: true,
        maxlength: 130,
        lettersonly: true,
      },
      'contact_city': {
        required: true,
      },
      'contact_charge': {
        required: true,
        maxlength: 130,
      },
      'contact_phone': {
        required: $('#edit-contact-phone').val().length > 0,
        maxlength: 10,
        minlength: 7
      },
      'contact_cellphone': {
        required: true,
        number: true,
        maxlength: 10,
        minlength: 10
      },
      'contact_email': {
        required: true,
        email: true,
      },
    };

    var validate_messages = {
      'company_name': {
        required: 'Este campo es obligatorio',
      },
      'url': {
        required: 'Este campo es obligatorio',
        url: 'Formato de url incorrecto, la url debe iniciar con "http://" o "https://"'
      },
      'sector': {
        required: 'Este campo es obligatorio',
      },
      'ciiu_code_0': {
        required: 'Este campo es obligatorio',
      },
      'descp_es': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 1000 caracteres',
      },
      'descp_en': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 1000 caracteres',
      },
      'contact_name': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 130 caracteres',
        lettersonly: 'Digite letras únicamente',
      },
      'contact_city': {
        required: 'Este campo es obligatorio',
      },
      'contact_charge': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 130 caracteres',
      },
      'contact_phone': {
        required: 'Este campo es obligatorio',
        maxlength: 'Digite máximo 10 dígitos',
        minlength: 'Digite mínimo 7 dígitos',
      },
      'contact_cellphone': {
        required: 'Este campo es obligatorio',
        number: 'Digite solo números',
        maxlength: 'Digite máximo 10 dígitos',
        minlength: 'Digite mínimo 10 dígitos',
      },
      'contact_email': {
        required: 'Este campo es obligatorio',
        email: 'Digite un email valido',
      },
    };

    $form.validate({
      ignore: ".ignore",
      rules: validate_rules,
      messages: validate_messages,
    });
  }


  /**
   * validate_register_exporter_form
   * @param  {object} $form
   */
  function validate_register_exporter_form($form) {
    var lang = $('html').attr('lang');
    var validate_rules = {
      'nit': {
        required: true,
        number: true,
      },
      'mail': {
        required: true,
        email: true,
      },
      'pass': {
        // required: true,
      },
      'data_protection': {
        required: true,
      },
      'habeas_data': {
        required: true,
      },
      'terms_of_use': {
        required: true,
      },
    };

    var validate_messages = {
      'nit': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
        number: lang == 'es' ? 'Este campo es numérico' : 'This field is numeric',
      },
      'mail': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
        email: lang == 'es' ? 'Digite un email valido' : 'This mail is invalid',
      },
      'pass': {
        // required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
      },
      'data_protection': {
        required: lang == 'es' ? 'Obligatorio' : 'Required',
      },
      'habeas_data': {
        required: lang == 'es' ? 'Obligatorio' : 'Required',
      },
      'terms_of_use': {
        required: lang == 'es' ? 'Obligatorio' : 'Required',
      },
    };

    $form.validate({
      ignore: ".ignore",
      rules: validate_rules,
      messages: validate_messages,
    });
  }


  /**
  * validate_register_buyer_form
  * @param  {[type]} $form
  */
  function validate_register_buyer_form($form) {
    var lang = $('html').attr('lang');
    var validate_rules = {
      'complete_name': {
        required: true,
        minlength: 4,
      },
      'mail': {
        required: true,
        email: true,
      },
      'country': {
        required: true,
      },
      'company': {
        required: true,
      },
      'interest_cat_1': {
        required: true,
      },
      'pass': {
        // required: true,
      },
    };

    var validate_messages = {
      'complete_name': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
        minlength: lang == 'es' ? 'Digite mínimo 4 caracteres' : 'Enter at least 4 characters',
      },
      'mail': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
        email: lang == 'es' ? 'Digite un email valido' : 'This mail is invalid',
      },
      'country': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
      },
      'company': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
      },
      'interest_cat_1': {
        required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
      },
      'pass': {
        // required: lang == 'es' ? 'Este campo es obligatorio' : 'This field is required',
      },
    };

    $form.validate({
      ignore: ".ignore",
      rules: validate_rules,
      messages: validate_messages,
    });
  }

  jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z," "]+$/i.test(value);
  }, "Letras únicamente por favor");


  /**
   * [validate_input_file description]
   * @param  {[type]} msg_file [description]
   * @param  {[type]} prev_img [description]
   * @return {[type]}          [description]
   */
  function validate_input_file(msg_file, prev_img) {
    msg_file.removeClass('error').text('');
    if (prev_img.length == 0) {
      msg_file
        .addClass('error')
        .text('Este campo es obligatorio')
        .parents('fieldset')
        .find('.js-form-file')
        .addClass('error');
      return false;
    }
    return true;
  }

  $.fn.inputFilter = function () {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
      this.value = this.value.replace(/\D/g, '');
      /* if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      } */
    });
  };

  Drupal.behaviors.cp_core_jquery_validate = {
    attach: function (context) {
      var $form = $('.ctn-form form'),
        type = $form.data('val-type'),
        $submit = $form.find('.form-submit'),
        msg_file = null,
        prev_img = null,
        ctn_file = null;

      if ($('body').hasClass('page-user-register')) {
        $form = $('.register-step-one-form');
        type = 'register_exporter';
        $submit = $form.find('.form-submit');
      }

      if ($('body').hasClass('page-buyer-register')) {
        $form = $('#register-buyer-form');
        type = 'register_buyer';
        $submit = $form.find('.form-submit');
      }

      $submit.click(function (e) {
        switch (type) {
          case 'product':
            ctn_file = $('.js-form-item-img-1');
            validate_product_form($form);
            break;

          case 'company':
            ctn_file = $('.js-form-item-img-comp');
            validate_company_form($form);
            break;

          case 'register_exporter':
            validate_register_exporter_form($form);
            break;

          case 'register_buyer':
            validate_register_buyer_form($form);
            break;
        }
        if (type == 'product' || type == 'company') {
          msg_file = ctn_file.find('.msg'),
            prev_img = ctn_file.find('.image-preview');
          return validate_input_file(msg_file, prev_img);
        }

      });

      $("#edit-nit").inputFilter();
    }
  }
}(jQuery, Drupal));




