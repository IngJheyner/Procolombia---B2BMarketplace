/**
 * @file
 * Suscriptor file.
 */


(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.countriesTrigger = {
    attach: function(context, settings) {
      if ($('#entity-browser-paises-form', context).length) {
        const checks = context.querySelectorAll('.form-checkbox');
        const btnSelect = context.querySelector('#edit-submit');
        btnSelect.disabled = true;

        Array.from(checks).map(check => {
          check.addEventListener('change', () => {
            let checked = context.querySelectorAll('.form-checkbox:checked')
            btnSelect.disabled = !checked.length
          })
        })
      }
    }
  }

}(jQuery, Drupal));
