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
        // Agregar clase a los pasos anteriores
       
        const currentStep = $("li.current");
        currentStep.prevAll().addClass("completed");
        const textCurrent = currentStep.wrapInner("<span></span>");

        //Cargar modales 
        $(context).find('body').once('legal-modal').each(function () {
          //Creación de contenedor que envuel multipaso y formlario
        const divContainer = document.createElement('div')
        divContainer.classList.add('form-container', 'row');
        const fieldGroupElement = document.querySelector('.field-group-html-element');
        fieldGroupElement.classList.add('col');
        fieldGroupElement.classList.remove('col-12');
        const cpMultistepSitebar = document.querySelector('.cp-core-node-multistep-sidebar');
        cpMultistepSitebar.classList.add('col')
        const footerForm = document.getElementById('edit-footer-form');
        footerForm.classList.add('col-10');
        function wrap (toWrap, wrapper) {
          wrapper = wrapper || document.createElement('div');
          toWrap.parentNode.appendChild(wrapper);
          return wrapper.appendChild(toWrap);
        };
        wrap(cpMultistepSitebar,divContainer);
        wrap(fieldGroupElement,divContainer);
        wrap(footerForm,divContainer);

          //Variables para mostrar y ocultar el modal
          let modalFirstStep = document.getElementById('legal-modal');
          modalFirstStep.classList.add('modal');
          let showFirstStepModal = new bootstrap.Modal(modalFirstStep, {})
          const btnAgreeFirstSt = document.querySelector('.agree-stp1');
          const btnCloseFirstSt = document.querySelector('.modal-top-close')
  
          //Variables para Agregar un contenedor con los elementos del modal custom.
          let newDiv = document.createElement("div");				
          const modalContainer = modalFirstStep.appendChild(newDiv);
          const modalHeader = document.querySelector('.modal-top');
          const modalBody = document.querySelector('.modal-body');
          const modalFooter = document.querySelector('.modal-footer');
          // Estruturación del modal custom
          modalContainer.classList.add('modal-container');
          modalHeader.classList.add('modal-header')
          modalContainer.appendChild(modalHeader);
          modalContainer.appendChild(modalBody);
          modalContainer.appendChild(modalFooter);
          //Cargar modal primer paso cuando el formulario se abre la primera vez    
          document.addEventListener('load', function(e) {
                    
              //Mostrar modal cuando la pagina se abre por primera vez y ocultar modal cual se da clic en aceptar
              if(window.location.hash !== "#cp-core-multistep-form" ) {
                  showFirstStepModal.show();
                  hideModal(btnAgreeFirstSt,showFirstStepModal);					
              }else{
                showFirstStepModal.hide();
              }                      
              hideModal(btnAgreeFirstSt,showFirstStepModal)
              function hideModal(btn, modal){
                btn.addEventListener('click',()=>{
                modal.hide();                          
                })
              }
          }, true);
          
        });
      }
    };
  })(jQuery, Drupal);