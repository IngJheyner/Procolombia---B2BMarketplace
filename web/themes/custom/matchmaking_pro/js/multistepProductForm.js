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

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })

        //Cargar modales
        $(context).find('body').once('.cp-core-multistep-form').each(function () {    
          //Uso de Sumo select para personlizar campos tipo select
          $('#edit-field-product-type').SumoSelect();
          $('#edit-field-categorization-parent').SumoSelect();
          $('#edit-field-categorization').SumoSelect();
          $('#edit-field-partida-arancelaria-tax').SumoSelect();
          $('#edit-field-pr-product-availability').SumoSelect();

          // Agregar clase a los pasos anteriores
          const currentStep = $("li.current");
          currentStep.prevAll().addClass("completed");
          const textCurrent = currentStep.wrapInner("<span class='title-step'></span>");
          $(textCurrent).clone().appendTo(".cp-core-node-multistep-sidebar");

          //Creación Variables del legal modal
          let modalFirstStep = document.getElementById('generic-modal-legal-modal');
            modalFirstStep.classList.remove('autoload');
          if (modalFirstStep) {
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
                //Mostrar modal cuando la pagina se abre por primera vez y ocultar modal cual se da clic en aceptar
                if(window.location.hash !== "#cp-core-multistep-form" ) {
                    showFirstStepModal.show();
                    hideModal(btnCloseFirstSt,showFirstStepModal);
                    document.body.classList.add('multistep-form')
                }else{
                  showFirstStepModal.hide();
                }

            }, true);
          }
        });

        // Open modal for all generic items.
        if ($('.generic-modal:not(.generic-modal-legal-modal)').length) {
          let modal = $('.generic-modal.autoload:not(.generic-modal-legal-modal)');
          if (modal.length && !modal.hasClass('modal-closed') && !modal.hasClass('no-autoload')) {
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
            if (modal.length) {
              new bootstrap.Modal(modal, {});
              modal.once().show();
            }
          });
        }

        if ($('.save-publish-button').length) {
          $('.save-publish-button').once().click(function (e) {
            e.preventDefault();
            let modal = $('#generic-modal-save-publish-question-modal');
            if (modal.length) {
              new bootstrap.Modal(modal, {});
              modal.once().show();
            }
          });
        }

        if ($('.cancel-confirm-link').length) {
          $('.cancel-confirm-link').once().click(function (e) {
            e.preventDefault();
            let modal = $('.cancel-confirm-question-modal');
            if (modal.length) {
              new bootstrap.Modal(modal, {});
              modal.once().show();
            }
          });
        }

        if ($('.save-publish-question-modal').length) {
          $('.cancel-confirm-question-modal a.btn.btn-ok').once().click(function (e) {
            $(this).closest('form').find('button.cancel-confirm-submit').click();
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

        if ($('.generic-modal.modal .modal-header button.close').length) {
          $('.generic-modal.modal .modal-header button.close').once().click(function(e) {
            e.preventDefault();
            $(this).closest('.generic-modal.modal').hide();
          });
        }

        if ($('.generic-modal.modal .btn-cancel').length) {
          $('.generic-modal.modal .btn-cancel').once().click(function(e) {
            e.preventDefault();
            $(this).closest('.generic-modal.modal').hide();
          });
        }
        if ($('.generic-modal.modal .modal-header-close').length) {
          $('.generic-modal.modal .modal-header-close').once().click(function(e) {
            e.preventDefault();
            $(this).closest('.generic-modal.modal').hide();
          });
        }



      }
    };
  })(jQuery, Drupal);
