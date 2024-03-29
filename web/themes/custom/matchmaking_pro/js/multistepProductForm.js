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

        //Dashboard        
        $(context).find('body').once('.view-product-dashboard').each(function () {
          const productDashboard = $('.view-product-dashboard');
          const itemsPerPage = $('.form-item-items-per-page');
          itemsPerPage.appendTo(productDashboard);
          const noResults = $('#generic-modal-view-no-results');
          const btnOkNoResults = $('#generic-modal-view-no-results .modal-footer-left');
          const btncloseNoResults = $('#generic-modal-view-no-results .modal-header span[aria-hidden="true"]');

          if(noResults){
           $(noResults).addClass('show')
          }
          function closeNoResultsModal(btn){
            btn.click(()=>{
              noResults.removeClass('show')
            })
          }
          closeNoResultsModal(btnOkNoResults);
          closeNoResultsModal(btncloseNoResults);
        })
        //Paso 2 mover cambiar posicion contenedor
        let partidaAranTax = $('#edit-field-partida-arancelaria-tax-wrapper');
        let tooltipAranTax = $('.lightbulb-tooltip');
        function moveAranTax(){
          if ($(window).width() < 993) {
            $(partidaAranTax).appendTo('.step_2 .group-left');
            $(tooltipAranTax).appendTo(partidaAranTax);
         }
        }
        moveAranTax();
        $(window).resize(function() {
          if ($(window).width() < 993) {
           moveAranTax();
         }else{
          $(partidaAranTax).prependTo('.step_2 .group-right');
         }
        });

        //Ver mas de 3 items funciones variables
        const itemCtype = $('.js-form-item-field-pr-type-certifications .select2-selection__choice');
        const showMorecType = $('.show-more-cType');
        const showMorecTypeText = $('.show-more-cType span');
        const itemCountrie = $('.entities-list .item-container');
        const showMoreCountrie = $('.show-more-countries');
        const showMoreCountrieText = $('.show-more-countries span');
        const fieldCountryWrapper = $('#edit-field-pr-country-wrapper');
        showMoreCountrie.appendTo(fieldCountryWrapper);

        function toggleText(text){
          if(text.hasClass('show-less')){
            text.text(Drupal.t('View less'));
          }
          else{
           text.text(Drupal.t('View more'))
          }
         }
        function hideBtnShowMore (item, btn,btnText){
          if(item.length <= 3){
            btn.hide()
          }else{
            btn.show();
          }
          if (item.not('show-item').css('display') === 'flex' && btnText.hasClass('show-less')) {
            btnText.removeClass('show-less');
            btnText.text(Drupal.t('View more'))
          }
        }

        hideBtnShowMore(itemCountrie,showMoreCountrie,showMoreCountrieText);
        hideBtnShowMore(itemCtype,showMorecType,showMorecTypeText);

        // Agregar clases modales Drupal
          $('#entity_browser_iframe_paises').closest('.entity-browser-modal').addClass('countries-modal');
          $('.countries-modal').siblings('.ui-widget-overlay').addClass('overlay-countries');

         //Tooltips Campos validación campos requeridos
         $('.form-control.is-invalid').after('<span class="tooltip-is-invalid"><p>Este campo es requerido</p></span>');
         $('.form-select.is-invalid').after('<span class="tooltip-is-invalid"><p>Este campo es requerido</p></span>');
         $('#edit-field-pr-country-wrapper .is-invalid').after('<span class="tooltip-is-invalid"><p>Este campo es requerido</p></span>');

         $('.lightbulb-tooltip').click(()=>{
         $( '.lightbulb-tooltip span').toggle();
         });
        //Sumo select
          $('.view-display-id-page_1 .form-select:not(#edit-field-categorization-target-id)').SumoSelect({
            forceCustomRendering: true,
          });
          $('.view-display-id-dashboard_table .form-select:not(#edit-field-categorization-target-id)').SumoSelect({
            forceCustomRendering: true,
          });
          $('.view-id-products_advisor .form-select:not(#edit-field-categorization-target-id)').SumoSelect({
            forceCustomRendering: true,
          });
          $('#cp-core-multistep-form .form-select:not(#edit-field-categorization-target-id, #edit-field-partida-arancelaria-tax, #edit-field-pr-type-certifications, #edit-field-pr-target-market, #edit-field-pr-sales-channel)').SumoSelect({
            forceCustomRendering: true,
          });
          $('#edit-field-categorization-target-id').SumoSelect({
            forceCustomRendering: true,
            search:true,
            searchText: Drupal.t('Search'),
            noMatch: Drupal.t('No matches for "{0}"')
          });

          $('#edit-field-partida-arancelaria-tax').SumoSelect({
            forceCustomRendering: true,
            search:true,
            searchText: Drupal.t('Search'),
            noMatch: Drupal.t('No matches for "{0}"')
          });

          $('#edit-field-product-type').SumoSelect({
            forceCustomRendering: true,
          });

          $('#edit-field-categorization-wrapper').find('select').SumoSelect({
            forceCustomRendering: true,
          });

          $('#edit-field-pr-structured-features-wrapper').find('select').SumoSelect({
            forceCustomRendering: true,
          });

          $('#edit-field-states').SumoSelect({
            forceCustomRendering: true,
          });

          const requiredFieldSelect2 = $('.cp-core-multistep-form .form-select.required');
          $(requiredFieldSelect2).filter('.error.is-invalid').each(function(i) {
            $(this).closest('.js-form-type-select').addClass('is-invalid');
          });

          const imagesStep4 = $('.cp-core-multistep-form.step_4 input.js-form-file');
          $(imagesStep4).filter('.error.is-invalid').each(function(i) {
            $(this).closest('.js-form-type-managed-file').addClass('is-invalid');
          });

          if ($('.field--name-field-partida-arancelaria-tax .SumoSelect input.search-txt').length) {
            if ($('.field--name-field-partida-arancelaria-tax .SumoSelect input.search-txt').val().length > 0) {
              $('.field--name-field-partida-arancelaria-tax .SumoSelect .optWrapper ul.options').addClass('filtered');
            }
            else {
              $('.field--name-field-partida-arancelaria-tax .SumoSelect .optWrapper ul.options').removeClass('filtered');
            }
            $('.field--name-field-partida-arancelaria-tax .SumoSelect input.search-txt').once().keyup(function() {
              if ($(this).val().length > 0) {
                $('.field--name-field-partida-arancelaria-tax .SumoSelect .optWrapper ul.options').addClass('filtered');
              }
              else {
                $('.field--name-field-partida-arancelaria-tax .SumoSelect .optWrapper ul.options').removeClass('filtered');
              }
              setTimeout(function() {
                $('.field--name-field-partida-arancelaria-tax .SumoSelect .optWrapper ul.options.filtered li:not(.hidden)').each(function (index) {
                  if (index > 10) {
                    $(this).addClass('hidden');
                  }
                });
              }, 200);
            });
          }

          $('#edit-field-pr-product-availability').SumoSelect(
            {
              forceCustomRendering: true,
            }
          );
        //Agregar clase a campos obligatorios
        $('.field--name-field-pr-country summary').addClass('js-form-required form-required');
        $('.form-item-field-pr-terms-of-condition-value').addClass('js-form-required form-required');

        //MultistepForm Context once, modal paso 1 y ver mas paso 3
        $(context).find('body').once('.cp-core-multistep-form').each(function () {
          //Paso 3 Ajustes multiselect
          //Variables Multiselect paso 3
          $('#drupal-modal').css("background-color","red");
          const cerType = $('.js-form-item-field-pr-type-certifications');
          const fieldTargetMarket = $('.js-form-item-field-pr-target-market');
          const fieldSalesChanel = $('.js-form-item-field-pr-sales-channel');
      
          function createContainerItems(parentItem) {
            if ($(parentItem).length) {
              const containerItems = $(parentItem).append("<div class ='container-options'></div>");
              const itemsSelect = $(parentItem).find('.select2-selection__choice')
              const listChoice = [];
              if ($(itemsSelect).length) {
                for (const choice of itemsSelect) {
                  const idSelect = choice.dataset.select2Id; 
                  const item = document.createElement('div');
                  $(item).addClass('item');
                  $(item).attr("data-select", idSelect);
                  $(item).text($(choice).text().slice(1));
                  
                  $(item).on('click', function() {
                    const itemRemain = $(parentItem).find('.select2-selection__choice');
                    for (const itemIteration of itemRemain) {
                      if($(this).text() == $(itemIteration).text().slice(1)){
                        $(itemIteration).find('.select2-selection__choice__remove')[0].click();
                        $(this).remove();
                      }
                    }
                  })
                  listChoice.push(item);
                  $(parentItem).find('.container-options').append(...listChoice) 
                }
              }
            }
          }
          //Guarda items seleccionado cuando se cambia de paso
          $( document ).ready(function() {
            createContainerItems(cerType)
            createContainerItems(fieldTargetMarket)
            createContainerItems(fieldSalesChanel)            
          });

          //agregar elementos seleccionados
          function addchosenitems(data,containerItems) {
            const itemChoice = data.element;
            const nextItems = $(itemChoice).parent().next()[0];
            const idSelect = itemChoice.dataset.select2Id;            
            const item = document.createElement('div');
            $(item).addClass('item');
            $(item).attr("data-select", idSelect);
            $(item).text($(itemChoice).text())           
            $(containerItems).find('.container-options').append(item);

            $(item).on('click',(function() {
              const findNextItems = $(nextItems).find('.select2-selection__choice');
              for (const itemOf of findNextItems) {
                const text = $(itemOf).text().slice(1);
                if (text == $(itemChoice).text()) {
                  
                  $(itemOf).find('.select2-selection__choice__remove')[0].click();
                  $(item).remove();
                }
        
              }
              })
            )
          }
          
          //selecting Options
          $('#edit-field-pr-target-market').on('select2:select', function (e) {
            const data = e.params.data;
            addchosenitems(data, fieldTargetMarket)
          });       
          $('#edit-field-pr-type-certifications').on('select2:select', function (e) {
            const data = e.params.data;
            addchosenitems(data, cerType)            
          });

          $('#edit-field-pr-sales-channel').on('select2:select', function (e) {
            const data = e.params.data;
            addchosenitems(data, fieldSalesChanel)
          });

          //Removing select
          function removeOptions(data) {
            const itemRemove = data.element;
            const findContainerItems = $('.container-options').find('.item');
              for (const itemOf of findContainerItems) {
                const text = $(itemOf).text();
                if (text == $(itemRemove).text()) {
                  $(itemOf).remove();
                }        
              }
          }
          $('#edit-field-pr-type-certifications').on('select2:unselect', function (e) {
            const data = e.params.data;
            removeOptions(data)
          })
          $('#edit-field-pr-target-market').on('select2:unselect', function (e) {
            const data = e.params.data;
            removeOptions(data)
             
          })
          $('#edit-field-pr-sales-channel').on('select2:unselect', function (e) {
            const data = e.params.data;
            removeOptions(data)
          })

          //Paso 3 ver mas de 3 items
          showMoreCountrie.click(()=>{
            const itemCountrie = $('.entities-list .item-container');
            if(itemCountrie.length > 3){
              itemCountrie.slice(3).toggleClass('show-item');
             showMoreCountrieText.toggleClass('show-less');
             toggleText(showMoreCountrieText);
            }else{
              showMoreCountrieText.text(Drupal.t('View more'))
            }
          })

          // Agregar clase a los pasos anteriores
          const currentStep = $("li.current");
          currentStep.prevAll().addClass("completed");
          const textCurrent = currentStep.wrapInner("<span class='title-step'></span>");
          $(textCurrent).clone().appendTo(".cp-core-node-multistep-sidebar");

          //Modal Paso 1
          let modalFirstStep = document.querySelector('.step_1 .legal-modal');
          if (modalFirstStep) {
            let showFirstStepModal = new bootstrap.Modal(modalFirstStep, {});
            const btnCloseFirstSt = document.querySelector('.close');
            modalFirstStep.classList.remove('autoload');
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
          $('.generic-modal:not(.generic-modal-legal-modal) .close').once().click(function(e) {
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
            e.preventDefault();
            $(this).closest('form').find('button.cancel-confirm-submit').click();
          });
        }
        else if($('.cancel-confirm-question-modal').length) {
          $('.cancel-confirm-question-modal a.btn.btn-ok').once().click(function (e) {
            e.preventDefault();
            $(this).closest('form').find('button.cancel-confirm-submit').click();
          });
        }

        if ($('.save-publish-question-modal').length) {
          $('.save-publish-question-modal a.btn.btn-ok').once().click(function (e) {
            e.preventDefault();
            $(this).closest('form').find('button.save-and-publish').click();
          });
        }

        // Close drupal default modal.
        if ($('.node--view-mode-product-service-presave-preview .close').length) {
          $('.node--view-mode-product-service-presave-preview .close').once().click(function (e) {
            e.preventDefault();
            Drupal.dialog($('#drupal-modal').get(0)).close();
          });
        }
        if ($('.node--view-mode-product-service-presave-preview .goback-text').length) {
          $('.node--view-mode-product-service-presave-preview .goback-text').once().click(function (e) {
            e.preventDefault();
            Drupal.dialog($('#drupal-modal').get(0)).close();
          });
        }
        
        // Close the Contries entity browser in modal.
        if ($('form .entity-browser-paises-close').length) {
          $('form .entity-browser-paises-close').once().click(function (e) {
            e.preventDefault();
            parent.jQuery(parent.document).find('.entity-browser-modal-iframe').parents('.ui-dialog').eq(0).find('.ui-dialog-titlebar-close').click();
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
        
        if ($('a.insert-video.btn').length) {
          if ($('input[name="field_pr_video_2[0][value]"]').val() != '') {
            $('a.insert-video.btn').hide();
            $('input[name="field_pr_video_2[0][value]"]').closest('.form-wrapper').show();
          }

          $('a.insert-video.btn').once().click(function (e) {
            e.preventDefault();
            $('input[name="field_pr_video_2[0][value]"]').closest('.form-wrapper').show();
            $(this).hide();
          });
        }
        
        if ($('input#edit-field-pr-video-0-value').length) {
          $('input#edit-field-pr-video-0-value').once().change(function(e) {
            if ($(this).val() != "") {
              $(this).trigger('state:empty');
            }
          });
        }
        if ($('input#edit-field-pr-video-2-0-value').length) {
          $('input#edit-field-pr-video-2-0-value').once().change(function(e) {
            if ($(this).val() != "") {
              $(this).trigger('state:empty');
            }
          });
        }

        if ($('form.cp-core-multistep-edit-form').length) {
          var advise = Drupal.t('Also remember to update the information in English.');
          $('.form-item-title-0-value input').once().change(function() {
            $('<small class="advise">' + advise + '</small>').insertAfter(this);
          });
          $('.form-item-field-body-0-value textarea').once().change(function() {
            $('<small class="advise">' + advise + '</small>').insertAfter(this);
          });
          $('.form-item-field-file-0 input').once().change(function() {
            $('<small class="advise">' + advise + '</small>').appendTo('.group-left .field--name-field-file.field--widget-cp-core-file-generic ');
          });
          $('.form-item-field-aditional-information-0-value textarea').once().change(function() {
            $('<small class="advise">' + advise + '</small>').insertAfter(this);
          });
          $('.field--name-field-pr-video button').once().click(function() {
            $('<small class="advise">' + advise + '</small>').appendTo('.form-item-field-pr-video-0-value');
          });
        }

        if ($('.cp-core-multistep-form.step_3 .select2-search--inline')) {
          $('.cp-core-multistep-form.step_3 select.select2-widget').once().change(function() {
            let elem = this;
            setTimeout(function() {
              $(elem).closest('.js-form-item').find('.select2-search__field').attr('placeholder', Drupal.t('Enter the keyword or select an option'));
            }, 100, elem);
          });
        }

      }
    };
  })(jQuery, Drupal);
