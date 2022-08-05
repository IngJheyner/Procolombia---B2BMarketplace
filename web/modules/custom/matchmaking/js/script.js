(function ($, Drupal) {
    'use strict';
  
    Drupal.behaviors.addMatch = {
      attach : function(context, settings) {
        $(".adicionar-match", context).click(function(){
          let alto = 0;
          let altoconfimar=0;
          if(window.innerHeight > 485){
            alto = 485
          }else{
            alto = window.innerHeight
          }
          $( "#dialog-add-match" ).dialog({
            modal: true,
            width: '50%',
            height: alto,
            dialogClass: 'adicionar-match',
            buttons: {
              CANCELAR: function() {
                $( this ).dialog( "close" );
                $("#variable").val('');
                $("#add-peso").val('');
                $("#match").val('');
                $(".variable-sobrepasa").hide();
                $(".variable-correcta").hide();
              },
              CREAR:function(){
                $(".variable-sobrepasa").hide();
                $(".variable-correcta").hide();
                  var val = $("#variable").val();
                  var peso = $("#add-peso").val();
                  var pesototal = $(".peso-total").text();
                  var estado = $("#estado").val();
                  var match = $("#match").val();
                 /* var val = $("#variable").val();
                  var val = $("#variable").val();*/
                  if($("#variable").val() == "") {
                    alert('Porfavor escoja una variable');
                    $('#variable').css("border","2px solid red");
                    return false;
                  }
                  if($("#match").val() == "") {
                    alert('Porfavor escoja un Match');
                    $('#match').css("border","2px solid red");
                    return false;
                  }
                  if(peso == "") {
                    alert('El peso no puede ser vacio');
                    $('#add-peso').css("border","2px solid red");
                    console.log(peso);
                    return false;
                  }
                  if(parseInt(peso) > 100) {
                    alert('El Peso no puede ser mayor que 100');
                    $('#add-peso').css("border","2px solid red");
                    return false;
                  }
                  if((parseInt(pesototal)+parseInt(peso)) > 100){
                    console.log((parseInt(pesototal)+parseInt(peso)));
                    $(".variable-sobrepasa").show();
                    $(".variable-confirm").text(val)
                    altoconfimar = 325
                    $(".sobrepaso-total").text('total un '+ ((parseInt(pesototal)+parseInt(peso))-100)+'%.')
                    if($('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').length == 0){
                      $('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').hide()
                    }  
                  }else{
                    altoconfimar = 280
                    $(".variable-correcta").show();
                    $(".variable-confirm").text(val)
                    if($('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').length == 0){
                      $('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').show()
                    }  
                  }
                

                $( "#confirmacion-crear-match" ).dialog({
                  modal: true,
                  width: 460,
                  icon: 'icon-confirm-crear-match',
                  height: altoconfimar,
                  dialogClass: 'confirmacion-crear-match',
                  buttons: {
                    SI:function(){

                      $(".table").find('tbody')
                        .append($('<tr>')
                            .append($('<td>')
                                .append('<input type="checkbox">')
                            )
                            .append($('<td>')
                                .append($("#variable").val()+'<input class="variable variable-1" hidden="" value="'+$("#variable").val()+'">')
                            )
                            .append($('<td>')
                                .append('<div class="wrapper-peso">'+
                                      '<input class="form-element peso peso-1" value="'+$("#add-peso").val()+'" type="number" id="peso" name="peso" maxlength="2" size="2" max="99" min="0" placeholder="" required="required" aria-required="true">'+
                                      '<i>%</i>'+
                                      '</div>'
                                      )
                            )
                            .append($('<td>')
                                .append('<input class="estado-o" type="hidden" value="'+estado+'">'+
                                        '<div class="field--type-boolean field--name-status field--widget-boolean-checkbox js-form-wrapper form-wrapper" data-drupal-selector="edit-status-wrapper" id="edit-status-wrapper"><div class="js-form-item form-item js-form-type-checkbox form-type--checkbox form-type--boolean js-form-item-status-value form-item--status-value">'+
                                          '<input data-drupal-selector="edit-status-value" type="checkbox" id="edit-status-value" name="status[value]" value="1" checked="checked" class="form-checkbox form-boolean form-boolean--type-checkbox">'+
                                            '<span class="checkbox-toggle">'+
                                              '<span class="checkbox-toggle__inner"></span>'+
                                            '</span>'+
                                            '<label for="edit-status-value" class="form-item__label option">Activo</label>'+
                                          '</div>'+
                                        '</div>')
                            )
                            .append($('<td>')
                                .append('<select  class="form-element match" required>'+
                                              '<option value="Años de Experiencia">Años de Experiencia</option>'+
                                              '<option value="Canal de Venta">Canal de Venta</option>'+
                                              '<option value="Cantidad Mínima Requerida">Cantidad Mínima Requerida</option>'+
                                              '<option value="Características Producto (Descripción)">Características Producto (Descripción)</option>'+
                                              '<option value="Características Producto (Estructuradas)">Características Producto (Estructuradas)</option>'+
                                              '<option value="Categoría">Categoría</option>'+
                                              '<option value="Idiomas de Negociación">Idiomas de Negociación</option>'+
                                              '<option value="Modelo de negocio">Modelo de negocio</option>'+
                                              '<option value="País de destino del Producto">País de destino del Producto</option>'+
                                              '<option value="Subcategoría">Subcategoría</option>'+
                                              '<option value="Subpartida Arancelaria">Subpartida Arancelaria</option>'+
                                              '<option value="Temporada de Compra">Temporada de Compra</option>'+
                                              '<option value="Tipo de Comprador">Tipo de Comprador</option>'+
                                            '</select>')
                            )
                            .append($('<td>')
                                .append('<img class="editar-teble-online" src="/modules/custom/matchmaking/css/assets/editar.png" alt="Icono Editar">')
                            )
                        );
                        $('.table').find("tbody").find("tr:last").find('td:eq(4)').find('.match').val($("#match").val());
                        $( this ).dialog( "close" );
                        $('#dialog-add-match').dialog( "close" );
                        $("#variable").val('');
                        $("#add-peso").val('');
                        $("#match").val('');
                        $('.save-edition').attr('style', 'display:initial !important');
                      
                    },
                    NO: function() {
                      $( this ).dialog( "close" );
                    }
                  }
                });
              }
            }
          });
        });
  
        $(window).once().on('dialog:afterclose', function(dialog, $element, settings) {

          console.log('modal is Closed!');

        });
        $('#dialog-add-match').once().on('dialogclose', function(event) {
          $("#variable").val('');
          $("#add-peso").val('');
          $("#match").val('');
      });
      
      $('#confirmacion-crear-match').once().on('dialogopen', function(event) {
        if($('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').length == 0){
          $('.confirmacion-crear-match').find('.ui-dialog-buttonpane').prepend('<p class="pregunta">¿Desa Continuar ?</p')
        }
        if($(".variable-correcta").is(':visible')){
          $('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').hide()
        }else{
          $('.confirmacion-crear-match').find('.ui-dialog-buttonpane').find('.pregunta').show()
        }

        
      });


    }
      
    };
    Drupal.behaviors.saveMatch = {
      attach : function(context, settings) {
          $(".save-edition", context).click(function(){

            var data = [];
            var item = {}
           $.when($('.table > tbody  > tr').each(function(index, tr) { 
              var item = {
                "variable" :$(this).find('.variable').val(),
                "peso" :$(this).find('.peso').val(),
                "estado" :$(this).find('.estado-o').val(),
                "match" :$(this).find('.match').val(),
              }
               data.push(item);
              
            })).then(function () {
                $.ajax({
                  type: 'POST',
                  // make sure you respect the same origin policy with this url:
                  // http://en.wikipedia.org/wiki/Same_origin_policy
                  url: '/admin/matchmaking/savematch',
                  data:{"data": data},
                  success: function(msg){
                    
                    alert('Los registros fueron actualizados correctamente');
                    $('.match').attr('disabled',true)
                    $('.peso').attr('disabled',true)
                    $('.save-edition').attr('style', 'display:none !important');
                    window.location.reload();
                  },
                  error:function(msg){
                    alert('un error ha ocurrido '+msg);
                  }
              });
            });
  
          });
          $(".peso", context).click(function(){
            $('.save-edition').attr('style', 'display:initial !important');
          });
        }
  };

  Drupal.behaviors.OtherFunctionsMatch = {
    attach : function(context, settings) {
      jQuery(".estado", context).click(function(){
        if(!$(this).is(':checked')){
          console.log('Not Checked');
          $(this).parent().parent().parent().find('.estado-o').val(0);
          $(this).parent().parent().parent().parent().find('.peso').val(0);
          $('.save-edition').attr('style', 'display:initial !important');
          //$(this).parent().parent().parent().parent().find('.peso').attr('disabled',true);
          $(this).parent().find('.form-item__label').text('Inactivo');
        }else{
          //$(this).parent().parent().parent().parent().find('.peso').attr('disabled',false);
          $('.save-edition').attr('style', 'display:initial !important');
          $(this).parent().parent().parent().find('.estado-o').val(1);
          $(this).parent().find('.form-item__label').text('Activo');
        }
        
      });
      jQuery(".editar-teble-online", context).click(function(){
        jQuery(this).parent().parent().find('.match').attr('disabled',false)
        jQuery(this).parent().parent().find('.peso').attr('disabled',false)
        $('.save-edition').attr('style', 'display:initial !important');
        
      });
      $(".match", context).each(function(){
        $(this).val($(this).parent().find('.match-o').val());
      });
      $(".estado", context).each(function(){
        //console.log($(this).parent().parent().parent().find('.estado-o').val());
        if($(this).parent().parent().parent().find('.estado-o').val() == 0){
          //$(this).parent().parent().parent().parent().find('.peso').attr('disabled',true);
          $(this).removeAttr('Checked');
          $(this).parent().find('.form-item__label').text('Inactivo');
        }
        
      });

      $('.check-all', context).click(function(){
        if($(this).prop('checked')){
          $(".table tbody tr").find("td:eq(0) input:checkbox").prop("checked", true);
        }else{
          $(".table tbody tr").find("td:eq(0) input:checkbox").prop("checked", false);
        }
        
      })
      
      
    }
};
  

  })(jQuery, Drupal); 