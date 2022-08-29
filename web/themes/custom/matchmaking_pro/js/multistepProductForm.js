/**
 * @file
 * Global utilities.
 *
 */
 (function($, Drupal) {

    'use strict';

    Drupal.behaviors.matchmaking_pro = {
      attach: function(context, settings) {
        // Custom code here

        // Open modal for all generic items.
        if ($('.generic-modal:not(.generic-modal-legal-modal)').length) {
          let modal = $('.generic-modal.autoload:not(.generic-modal-legal-modal)');
          if (!modal.hasClass('modal-closed') && !modal.hasClass('no-autoload')) {
            new bootstrap.Modal(modal, {});
            modal.once().show();
          }
          $('.generic-modal:not(.generic-modal-legal-modal) .close').once().click(function() {
            $(this).closest('.generic-modal:not(.generic-modal-legal-modal)').addClass('modal-closed').hide();
          });
        }

        if ($('.button.add-other').length) {
          $('.button.add-other').once().click(function (e) {
            e.preventDefault();
            let modal = $('#generic-modal-add-other-question-modal');
            new bootstrap.Modal(modal, {});
            modal.once().show();
          });
        }

        if ($('.save-publish-button').length) {
          $('.save-publish-button').once().click(function (e) {
            e.preventDefault();
            let modal = $('#generic-modal-save-publish-question-modal');
            new bootstrap.Modal(modal, {});
            modal.once().show();
            Drupal.behaviors.attach();
          });
        }

        if ($('.save-publish-question-modal').length) {
          $('.save-publish-question-modal a.btn.btn-ok').once().click(function (e) {
            $(this).closest('form').find('button.save-and-publish').click();
          });
        }



        // Close drupal default modal.
        if ($('.node--view-mode-product-service-presave-preview .close').length) {
          $('.node--view-mode-product-service-presave-preview .close').once().click(function () {
            Drupal.dialog($('#drupal-modal').get(0)).close();
          });
        }

        // Close the Contries entity browser in modal.
        if ($('form .entity-browser-paises-close').length) {
          $('form .entity-browser-paises-close').once().click(function (e) {
            e.preventDefault();
            $(".entity-browser-modal .ui-dialog-titlebar-close").click();
          });
        }

        if ($('.product-list-links .select-all').length) {
          $('.product-list-links .select-all').once().click(function (e) {
            e.preventDefault();
            $('.product-list .form-check-input').prop('checked', true);
          });
        }

        if ($('.product-list-links .unselect-all').length) {
          $('.product-list-links .unselect-all').once().click(function (e) {
            e.preventDefault();
            $('.product-list .form-check-input').prop('checked', false);
          });
        }

        //Cargar modales
        $(context).find('body').once('.cp-core-multistep-form').each(function () {

          // Agregar clase a los pasos anteriores
          const currentStep = $("li.current");
          currentStep.prevAll().addClass("completed");
          const textCurrent = currentStep.wrapInner("<span class='title-step'></span>");
          $(textCurrent).clone().appendTo(".cp-core-node-multistep-sidebar");

          //Creación Variables del legal modal
          let modalFirstStep = document.getElementById('generic-modal-legal-modal');
          let showFirstStepModal = new bootstrap.Modal(modalFirstStep, {});
          const btnCloseFirstSt = document.querySelector('.close');


          hideModal(btnCloseFirstSt,showFirstStepModal)
              function hideModal(btn, modal){
                btn.addEventListener('click',()=>{
                modal.hide();
                })
              }

          //Cargar modal primer paso cuando el formulario se abre la primera vez
          document.addEventListener('load', function(e) {
            showFirstStepModal.show();
              //Mostrar modal cuando la pagina se abre por primera vez y ocultar modal cual se da clic en aceptar
              if(window.location.hash !== "#cp-core-multistep-form" ) {
                  showFirstStepModal.show();
                  hideModal(btnCloseFirstSt,showFirstStepModal);
                  document.body.classList.add('multistep-form')
              }else{
                showFirstStepModal.hide();
              }

          }, true);

        });
      }
    };
  })(jQuery, Drupal);
