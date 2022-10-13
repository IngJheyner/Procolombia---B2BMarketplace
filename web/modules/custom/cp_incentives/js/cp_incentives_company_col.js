/*
 * Service for a Colombian company
 */
(function ($ ,Drupal) {
    'use strict';
    function init() {
      if (window.location.pathname.includes('dashboard/col/user/incentives')) {
        getIncentivePlan();
        getHowLevelUp();
      }
    }

    const getIncentivePlan = () => {
      let formdata = new FormData();
      let requestOptions = {
        method: 'POST',
        body: formdata,
      };
      fetch("/status/get_status", requestOptions)
      .then(response => response.json())
      .then((result) => {
        let status_list = result.data;
        if (status_list.length > 0) {
          let html2 = '';
          // console.log(status_list);
          // console.log(status_list.length);
          status_list.forEach((status) =>{
            html2 += `
                <div id= 'status-${status.id}'>
                  <p>
                    <strong>Status ${Drupal.t(status.name)}</strong>
                  </p>
                  <p>
                    ${status.image_src}
                  </p>
                  ${status.id == status_list[0].id ? 
                    `<p>Mayor a ${status.min_points} puntos</p>` 
                    :
                    `<p>${status.min_points} a ${status.max_points} puntos</p>` 
                  }
                  <div id='status-content-${status.id}'>
                  </div>
                </div>
            `
            
          });
          $('#list-of-incentive-plan').html(html2);
        }
        return result;
      })
      .then(() => {
        let formdata = new FormData();
        let html = '';
        let requestOptions = {
          method: 'POST',
          body: formdata,
        };
      
        fetch("/user/get_benefits", requestOptions)
          .then(response => response.json())
          .then((result) => {

            let html = '';
            let benefit_list = result.data;
            if (benefit_list.length > 0) {
              console.log(benefit_list);
              console.log("La información testing");
              benefit_list.forEach((benefit) =>{
                console.log(benefit.id_status + ' ESTE ES EL ID ');


                html = `
                  <li>
                    <strong>${benefit.incentives_description}</strong>
                  </li>
                      
                `;
                $('#status-content-'+benefit.id_status).append(html);
              });
              
            }
          })
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
    }

// function getIncentivePlan () {
//     
  
function getHowLevelUp () {
    let formdata = new FormData();
    let html = '';
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };
    fetch("/incentives/get_incentives", requestOptions)
        .then(response => response.json())
        .then((result) => {
            let html2 = '';
          let points = result.data;
          var criterium = '';
            if (points.length > 0) {
                console.log(points);
                console.log("La información");
                
                points.forEach((points) =>{
                    if(points.criteria_state >= 1) {
                        if(points.criteria_characteristic == 'Tiempo de respuesta en el chat') {
                            if(points.min_measure == 0){
                                criterium = Drupal.t('Tiempos de respuesta en el chat menor a 1 hora');
                            }else if (points.min_measure == 1){
                                criterium = Drupal.t('Tiempos de respuesta en el chat entre ') +
                                points.min_measure + Drupal.t(' hora a ') + points.max_measure + Drupal.t(' horas');
                            } else {
                                criterium = Drupal.t('Tiempos de respuesta en el chat entre ') +
                                points.min_measure + Drupal.t(' horas a ') + points.max_measure + Drupal.t(' horas');
                            }
                            
                        } else if (points.criteria_characteristic == 'Calificacion del comprador internacional') {
                            criterium = Drupal.t('Calificacion del comprador internacional al tener ') + points.max_measure + Drupal.t(' estrellas de apreciación.');
                        }
                        else if (points.criteria_characteristic == 'Numero de visualizaciones de producto o servicio') {
                            criterium = Drupal.t('Numero de visualizaciones de producto o servicio mayor o igual a ') + points.max_measure + Drupal.t(' vistas.');
                        }
                        else if (points.criteria_characteristic == 'Reporte de logros') {
                            criterium = Drupal.t('Acumulará puntos por cada logro reportado y verificado en el CMR-Neo con el estado "Certificado".');
                        }
                        else if (points.criteria_characteristic == 'Actualizacion de productos o servicios') {
                            criterium = Drupal.t('Acumulará puntos por cada actualización en el sistema de los productos o servicios.');
                        }
                        else if (points.criteria_characteristic == 'Actualizacion perfil de empresa') {
                            criterium = Drupal.t('Acumulará puntos por cada actualización de perfil de su empresa.');
                        }
                        else if (points.criteria_characteristic == 'Referidos') {
                            criterium = Drupal.t('Acumulará puntos por cada referido en la plataforma.');
                        }
                        else if (points.criteria_characteristic == 'Referidos') {
                            criterium = Drupal.t('Referidos empresas exportadoras colombianas para que se registren en la plataforma.');
                        }
                        else{
                            criterium = points.criteria_characteristic;
                        }
                        html2 += `
                        <li style="color: blue;">
                            <p>
                                ${criterium}
                            </p>
                            <p>
                                + ${points.max_measure} puntos
                            </p>
                        </li>
                        `
                    } else {}
                    
                });
                $('#how-get-points').html(html2);
            }
                
            
            
            })
            .catch(error => console.log('error', error));

  }

    //function to show how-get-points section
    function showHowGetPoints() {
      if($('#how-get-points').css('display') == 'none'){
        $('#how-get-points').show();
      } else {
        $('#how-get-points').hide();
      }
    }
    function getReferenceCode() {
      let formdata = new FormData();
      let html = '';
      let requestOptions = {
        method: 'POST',
        body: formdata,
      };
      fetch("/user/get-reference-code", requestOptions)
        .then(response => response.json())
        .then((result) => {
          console.log('TESTINGGGGG11'); 
          let code = result.data;
          console.log(code);
          if (code == 'No code') {
            console.log('NO CODE');            //create the reference code
            var formData = new FormData();
            createReferenceCode();
          } else {
            console.log('IT HAS CODE');
            $('#reference-code').val(code);
          }
        }
        )
        .catch(error => console.log('error', error));
    }

    function createReferenceCode () {
      fetch("/user/create-reference-code", {
        method: "POST",
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        getReferenceCode();
        console.log(result);
        console.log("EL CÓDIGO FUE CREADO");
      })
    }
    
  Drupal.behaviors.cp_incentives_users = {
    attach: function (context, settings) {
      if (context == document) {
        console.log("ENTRO")
        //check if path is messages
          init();
          var url = window.location.href;
          
          if(url.includes("dashboard/col/user/incentives")){
            $("#how-get-points-close", context).click(function () {
              showHowGetPoints();
            });
            $("#how-get-points-open", context).click(function () {
              showHowGetPoints();
            });
            $('#create-reference-code').click(function(){
              getReferenceCode();
            });
          }
      }
    }
  }
}(jQuery, Drupal));
