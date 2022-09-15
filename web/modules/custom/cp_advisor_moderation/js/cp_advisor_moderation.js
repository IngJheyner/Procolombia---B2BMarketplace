/**
 * @file
 * Suscriptor file.
 */
(function ($, Drupal) {'use strict';
  $('#btn-modal-reject').click(function () {
    console.log('hola')
    $('#edit-reject').trigger('click');
  })
  $('#btn-modal-approve').click(function () {
    console.log('hola')
    $('#edit-approve').trigger('click');
  })
}(jQuery, Drupal));
