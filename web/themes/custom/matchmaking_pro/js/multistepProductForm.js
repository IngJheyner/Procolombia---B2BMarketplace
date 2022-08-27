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

        if ($('.generic-modal:not(.generic-modal-legal-modal)').length) {
          let modal = $('.generic-modal:not(.generic-modal-legal-modal)');
          if (!modal.hasClass('modal-closed'))
          new bootstrap.Modal(modal, {});
          modal.once().show();
          $('.generic-modal:not(.generic-modal-legal-modal) .close').once().click(function() {
            $(this).closest('.generic-modal:not(.generic-modal-legal-modal)').addClass('modal-closed').hide();
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
