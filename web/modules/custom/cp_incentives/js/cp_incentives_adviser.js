/*
 * Service for an main adviser.
 */
(function ($, Drupal) {
  'use strict';
  function init() {
    if (window.location.pathname.includes('/incentives/dashboard')) {
      getListOfCriterias();
    }
    if (window.location.pathname.includes('/dashboard/incentives/list')) {
      getListOfBenefits();
      // getRelationBenefitStatus();

    }

  }
  // VALIDATION TO CREATE NEW STATUS AND ADD INFORMATION ABOUT THE STATUS[LENGHT]-1
  let validatingNewStatus = false;
  const isValidNumber = (number) => {
    return String(number)
      .match(
        //REGULAR EXPRESSION TO VALIDATE NUMBER
        /^[0-9]+$/
      );
  };

  const isValidText = (text) => {
    return String(text)
      .match(
        //REGULAR EXPRESSION TO VALIDATE TEXT

        /^[a-zA-Z0-9\s\.\,\-\_\(\)\:\;\=\/\|\\\'\"\[\]\{\}]+$/
      );
  };

  const isValidTextSpanish = (text) => {
    return String(text)
      .match(
        //REGULAR EXPRESSION TO VALIDATE TEXT SPANISH
        /^[a-zA-Z0-9\s\.\,\-\_\(\)\:\;\=\/\|\\\'\"\[\]\{\}\ñ\Ñ\á\é\í\ó\ú\Á\É\Í\Ó\Ú]+$/
      );
  };
  //is valid hex rgb color
  const isValidHexColor = (color) => {
    return String(color)

      .match(
        //REGULAR EXPRESSION TO VALIDATE # PLUS 6 HEXADECIMAL CHARACTERS
        /^#[0-9a-fA-F]{6}$/
      );
  };


  // const getListOfCriterias = () => {
  //   let ident = 0;
  //   // console.log("LIST OF CRITERIAS");
  //   let formdata = new FormData();
  //   let html4 = '';
  //   let requestOptions = {
  //     method: 'POST',
  //     body: formdata,
  //   };

  //   fetch("/adviser/incentives/get-criterias", requestOptions)
  //     .then(response => response.json())
  //     .then((result) => {
  //       let criteria_list = result.data;
  //       if (criteria_list.length > 0) {
  //         let html2 = '';
  //         // console.log(criteria_list);
  //         // console.log("ALL CRITERIAS");
  //         criteria_list.forEach((criteria) => {
  //           html2 += `
  //             <li>
  //                 <p>${Drupal.t(criteria.id)}</p>
  //                 <p>${Drupal.t(criteria.characteristic)}</p>
  //                 <p>${Drupal.t(criteria.description)}</p>
  //                 <p>${Drupal.t(criteria.expiration_days)}</p>
  //                 <input type="checkbox" id='updateStateCriteria-${criteria.id}'
  //                   ${criteria.state == 1 ? `checked` : ``}
  //                 />
  //                 <button id='updateCriteria-${criteria.id}'>
  //                   EDITAR CRITERIA
  //                 </button>
  //                 <section id='criteria-business-rules-${criteria.id}'>

  //                 </section>
  //             </li>
  //           `
  //         });
  //         $('#criteria-table').html(html2);
  //       }
  //       return result;
  //     })
  //     .then((result) => {
  //       let criteria_list = result.data;
  //       if (criteria_list.length > 0) {
  //         // console.log(criteria_list);
  //         // console.log("La información");
  //         criteria_list.forEach((criteria) => {
  //           // Function to show the modal if the administrator wants to update the benefit
  //           document.getElementById("updateCriteria-" + criteria.id).onclick = function () {
  //             showModalCriteria(criteria.id, criteria.characteristic, criteria.description, criteria.expiration_days, criteria.state);
  //           };
  //           //CALL THE FUNCTION TO UPDATE THE CRITERIA FOR EACH updateStateCriteria-ID
  //           updateStateCriteria(criteria.id, criteria.expiration_days);
  //         });
  //       }
  //     })
  //     .then((result) => {
  //       getBusinessRules();
  //     })
  //     .catch(error => console.log('error', error));
  // }

  // function getBusinessRules() {
  //   let formdata = new FormData();
  //   let requestOptions = {
  //     method: 'POST',
  //     body: formdata,
  //   };

  //   fetch("/adviser/incentives/get-business-rules", requestOptions)
  //     .then(response => response.json())
  //     .then((result) => {
  //       let business_rules_list = result.data;
  //       if (business_rules_list.length > 0) {
  //         let html = '';
  //         business_rules_list.forEach((business_rule) => {
  //           if (business_rule.measurement_unit != null && business_rule.measurement_unit != '') {
  //             html = `
  //             <p>
  //               ${business_rule.id} ---
  //               ${Drupal.t(business_rule.measurement_unit)}
  //               ${business_rule.min_measure}
  //               ${business_rule.max_measure}
  //               ${business_rule.given_points}
  //             </p>
  //           `;
  //             $('#criteria-business-rules-' + business_rule.id_incentives_criteria).append(html);
  //           }
  //         });

  //       }
  //       return result;
  //     })
  // }

  // function updateStateCriteria(id, exp) {
  //   document.getElementById("updateStateCriteria-" + id).onclick = function () {
  //     let formdata = new FormData();
  //     formdata.append("id", id);
  //     formdata.append("state", document.getElementById("updateStateCriteria-" + id).checked ? 1 : 0);
  //     formdata.append("expiration_days", exp);

  //     let requestOptions = {
  //       method: 'POST',
  //       body: formdata,
  //     };

  //     fetch("/adviser/incentives/update-criteria", requestOptions)
  //       .then(response => response.json())
  //       .then((result) => {
  //         console.log(result);
  //         getListOfCriterias();
  //       })
  //       .catch(error => console.log('error', error));
  //   }
  // };

  // function updateCriteria(id, state, exp) {

  // }

  // const closeModalCriteria = () => {
  //   $("#modalUpdateCriteria").hide();
  //   //CLEAN THE MODAL
  //   $("#criteria-id").val('');
  //   $("#criteria-expiration-days").val('');
  //   $("#criteria-description").text('');
  //   $("#criteria-characteristic").text('');
  //   $("#criteria-characteristic-label").text('');
  //   $("#criteria-state").prop("checked", false);
  // }

  // const showModalCriteria = (id, characteristic, description, expiration_days, state) => {
  //   console.log('id: ' + id + 'el testeo');
  //   if (document.getElementById("modalUpdateCriteria").style.display == "none") {

  //     $("#criteria-id").val(id);
  //     $("#criteria-expiration-days").val(expiration_days);
  //     $("#criteria-description").text(description);
  //     $("#criteria-characteristic").text(characteristic);
  //     $("#criteria-characteristic-label").text(Drupal.t('Variable / Característica') + ' ' + characteristic);

  //     if (state == 1) {
  //       $("#criteria-state").prop("checked", true);
  //     } else {
  //       $("#criteria-state").prop("checked", false);;
  //     };

  //     let formdata = new FormData();
  //     let requestOptions = {
  //       method: 'POST',
  //       body: formdata,
  //     };
  //     //function to show all measures of the criteria if criteria.id == 1 or 2 or 3
  //     fetch("/adviser/incentives/get-business-rules", requestOptions)
  //       .then(response => response.json())
  //       .then((result) => {
  //         //AFTER ALL DATA CHARGED, THEN SHOW THE MODAL
  //         $("#modalUpdateCriteria").show();
  //         let business_rules_list = result.data;
  //         console.log("TESTING BUSINESS RULES LIST" + id);
  //         console.log(business_rules_list);
  //         //get the business rules of the criteria where criteria.id == 1
  //         let business_rules_list_filtered = business_rules_list.filter(business_rule => business_rule.id_incentives_criteria == id);
  //         console.log(business_rules_list_filtered);
  //         $('#min-measure-1').val(business_rules_list_filtered[0].min_measure);
  //         $('#max-measure-1').val(business_rules_list_filtered[0].max_measure);
  //         $('#points-1').val(business_rules_list_filtered[0].given_points);
  //         $('#total-points').val(business_rules_list_filtered[0].given_points);
  //         //Checking if is the first business rule
  //         if (id == 1 || id == 2 || id == 3) {
  //           $('#min-measure-2').val(business_rules_list_filtered[1].min_measure);
  //           $('#max-measure-2').val(business_rules_list_filtered[1].max_measure);
  //           $('#points-2').val(business_rules_list_filtered[1].given_points);
  //           $('#min-measure-3').val(business_rules_list_filtered[2].min_measure);
  //           $('#max-measure-3').val(business_rules_list_filtered[2].max_measure);
  //           $('#points-3').val(business_rules_list_filtered[2].given_points);
  //           $('#total-points').val(business_rules_list_filtered[0].given_points);
  //           //#total-points read only
  //           $('#total-points').prop('readonly', true);
  //         } else {
  //           $('#total-points').prop('readonly', false);
  //           $('#id--others').val(business_rules_list_filtered[0].id);
  //         }
  //       })
  //       .catch(error => console.log('error', error));

  //     //function to show modalUpdateCriteria__businessRules if criteria.id == 1 or 2 or 3
  //     if (id == 1 || id == 2 || id == 3) {
  //       $("#modalUpdateCriteria__businessRules").show();

  //     } else {
  //       $("#modalUpdateCriteria__businessRules").hide();
  //     }
  //   } else {
  //     $("#modalUpdateCriteria").hide();
  //   }
  //   // console.log('La prueba' + criteria.id);
  // }

  const getListOfStatus = () => {
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
          let html_td = '';
          let html_st = '';
          status_list.forEach((status) => {
            html_td += `
            <tr>
              <td>
                <div class="incentive-image" id='ONLY-TESTING-${status.image_src}'>
                  <div class="status_image">
                    <img src="${status.image_src}" alt="status" class="" id="status-image-${status.id}">
                  </div>
                  <p>STATUS ${status.name}</p>
                </div>
              </td>
              <td>
                <div class="incentive-description">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control
                      status_min_points"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      id="status-min-points-${status.id}"
                      ${status.id == 1 ? ` value=${status.min_points} readonly` : `value=${status.min_points}`}
                      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                      onkeypress="return event.charCode != 190"
                      onkeypress="return event.charCode != 188"
                    />
                    <div class="input_error">
                      <span class="input-group-text" id="status-span-min-${status.id}">${Drupal.t("Points")}</span>
                      <i id="error_status-min-points-${status.id}" class="bx bxs-info-circle toltip_i" style="display: none;">
                        <span id="error_status-min-points-${status.id}_message" class="tooltiptext_error">
                          ${Drupal.t("Required field")}
                        </span>
                      </i>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="incentive-status">
                  <div class="input-group">
                    <input type="text"
                      class="form-control status_max_points"
                      aria-label="Recipient's username"         
                      aria-describedby="basic-addon2"
                      id="status-max-points-${status.id}"
                      ${status.id == status_list[0].id ? ` ` : `value=${status.max_points}`}
                      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                      onkeypress="return event.charCode != 190"
                      onkeypress="return event.charCode != 188"
                    />
                    
                    <div class="input_error">
                      <span class="input-group-text status_span_max" id="status-span-max-${status.id}">${Drupal.t("Points")}</span>
                      <i id="error_status-max-points-${status.id}" class="bx bxs-info-circle toltip_i" style="display: none;">
                        <span id="error_status-max-points-${status.id}_message" class="tooltiptext_error">
                          ${Drupal.t("Required field")}
                        </span>
                      </i>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          `;
          });
          $('#table-incentives-tbody').html(html_td);
          status_list.reverse().forEach((status) => {
            html_st = `
          <th class="status" style="min-width: 200px"> 
            <div class="status_image_2">
              <img src="${status.image_src}" alt="status" class="" id="status-image-${status.id}">
            </div>
            <p>STATUS ${status.name}</p>
        </th>
          `;
            $('#table-incentives-head').append(html_st);
          });


          // $('#list-of-status').html(html2);
          $('#table-incentives-head').append(`
        <th style="min-width: 99px;" class="option">
          ${Drupal.t("State")}
        </th>
        <th class="option">
          ${Drupal.t("Edit")}
        </th>
        `);


        }
        return result;
      })

      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t('Unexpected error'));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while getting status list."));
        // console.log(Drupal.t("Error while updating status. ") + error);
      });
  }

  let finalValidation = false;

  /*
   * Function to update all the status
   */
  function updateAllStatus() {

    let formdata = new FormData();
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };
    fetch("/status/get_status", requestOptions)
      .then(response => response.json())
      .then((result) => {

        //function to update the status
        // $('#update-all-status').click(function () {
        //VALIDATIONS FOR POINTS
        let isValidPoint = true;
        let status_list = result.data;
        let last_status = status_list[0];
        let first_status = status_list[status_list.length - 1];

        // IMPORTANT: WHE HAVE TO PARSE THE VALUE TO INT CAUSE THE VALUE IS A STRING
        let iterator = 0;
        status_list.forEach((status) => {

          $('#status-min-points-' + status.id).on('input', function () {
            console.log('TESTING min points');
          });
          $('#status-max-points-' + status.id).on('input', function () {
            console.log('TESTING max points');
          });

          var message = '';
          
          //CHECKING THE FIRST STATUS - LOWER
          if (parseInt(status.id) === parseInt(first_status.id)) {
            if (($('#status-min-points-' + status.id).val()) !== '0') {
              isValidPoint = false;
              $('#status-min-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points must be 0');
              $('#error_status-min-points-'+status.id+'_message').text(message);
              $('#error_status-min-points-'+status.id).show();

            }
            else if (parseInt($('#status-min-points-' + status.id).val()) ==
              parseInt($('#status-max-points-' + status.id).val())) {
              isValidPoint = false;
              console.log("PRUEBA DE LOWER");
              $('#status-max-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the maximum points must be higher to minimum points');
              $('#error_status-max-points-'+status.id+'_message').text(message);
              $('#error_status-max-points-'+status.id).show();
            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-max-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-max-points-'+status.id).hide();
            }
          }

          //CHECKING THE LAST STATUS - HIGHER
          else if (parseInt(status.id) === parseInt(last_status.id)) {
            // if ($('#status-max-points-' + status.id).val() !== '') {
            //   if ($('#status-name').val() == ''
            //     && $('#status-min-points').val() == ''
            //     && $('#status-image-src').val() == ''
            //     && validatingNewStatus == false) {
            //     console.log('For the status ' + status.name + ' the max points must be null');
            //     $('#status-max-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
            //     $('#status-span-max-' + status.id).css('border-color', 'rgb(186, 12, 47)');
            //     isValidPoint = false;
            //   } else {
            //     $('#status-max-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
            //     $('#status-span-max-' + status.id).css('border-color', 'rgb(204, 204, 204)');
            //   }
            // };
            if (parseInt($('#status-min-points-' + status.id).val()) <=
              parseInt($(('#status-max-points-' + status_list[iterator + 1].id)).val())) {
              isValidPoint = false;
              $('#status-min-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points must be higher than the last status maximum points');
              $('#error_status-min-points-'+status.id+'_message').text(message);
              $('#error_status-min-points-'+status.id).show();
            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-min-points-'+status.id).hide();
            }
            if (parseInt($('#status-min-points-' + status.id).val()) -
              parseInt($(('#status-max-points-' + status_list[iterator + 1].id)).val()) !== 1) {
              // console.log('For the status ' + status.name + ' V A L I D A C I O N  DE SECUENCIA');
              isValidPoint = false;
              $('#status-min-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-min-points-' + status_list[iterator + 1].id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status_list[iterator + 1].id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points must be one point higher than the ') + status_list[iterator + 1].name + Drupal.t(' status maximum points');
              $('#error_status-min-points-'+status.id+'_message').text(message);
              $('#error_status-min-points-'+status.id).show();
              
            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-min-points-' + status_list[iterator + 1].id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status_list[iterator + 1].id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-min-points-'+status.id).hide();
            }
          }

          //CHECKING THE STATUS IN THE MIDDLE
          else if (last_status.id !== status.id && first_status.id !== status.id) {
            //CHECK IF THE MIN POINTS ARE LOWER THAN THE MAX POINTS
            if (parseInt($('#status-min-points-' + status.id).val())
              > parseInt($('#status-max-points-' + status.id).val())) {
              isValidPoint = false;
  
              $('#status-max-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points cannot be greater than the maximum points');
              $('#error_status-max-points-'+status.id+'_message').text(message);
              $('#error_status-max-points-'+status.id).show();

            } else if (parseInt($('#status-min-points-' + status.id).val()) == parseInt($('#status-max-points-' + status.id).val())) {
              isValidPoint = false;
  
              $('#status-max-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points cannot be equal to maximum points');
              $('#error_status-max-points-'+status.id+'_message').text(message);
              $('#error_status-max-points-'+status.id).show();

            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-max-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-max-points-'+status.id).hide();
            }
            if (parseInt($('#status-min-points-' + status.id).val()) <=
              parseInt($(('#status-max-points-' + status_list[iterator + 1].id)).val())) {
              isValidPoint = false;
              $('#status-min-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points must be one point higher than the ') + status_list[iterator + 1].name + Drupal.t(' status maximum points');
              $('#error_status-min-points-'+status.id+'_message').text(message);
              $('#error_status-min-points-'+status.id).show();
            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
            };
            if (parseInt($('#status-min-points-' + status.id).val()) -
              parseInt($(('#status-max-points-' + status_list[iterator + 1].id)).val()) !== 1) {
              isValidPoint = false;
              $('#status-min-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-min-points-' + status_list[iterator + 1].id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-min-' + status_list[iterator + 1].id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('For the status ') + status.name + Drupal.t(' the minimum points must be one point higher than the ') + status_list[iterator + 1].name + Drupal.t(' status maximum points');
              $('#error_status-min-points-'+status.id+'_message').text(message);
              $('#error_status-min-points-'+status.id).show();
            } else {
              $('#status-min-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-min-points-' + status_list[iterator + 1].id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-min-' + status_list[iterator + 1].id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-min-points-'+status.id).hide();
            }
          }
          //Checking if the maximum status empty.
          if(last_status.id !== status.id){
            if ($('#status-max-points-' + status.id).val() == '') {
              isValidPoint = false;
              $('#status-max-points-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(186, 12, 47)');
              message = Drupal.t('This field is required');
              $('#error_status-max-points-'+status.id+'_message').text(message);
              $('#error_status-max-points-'+status.id).show();
            } else {
              $('#status-max-points-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#status-span-max-' + status.id).css('border-color', 'rgb(204, 204, 204)');
              $('#error_status-max-points-'+status.id).hide();
            }
          }
          iterator++;
        });

        if (isValidPoint) {
          let formdata = new FormData();
          let status_list = result.data;
          let array = [];
          status_list.forEach((status) => {
            array.push({
              id: status.id,
              min_points: $("#status-min-points-" + status.id).val(),
              max_points: $("#status-max-points-" + status.id).val(),
            })
          });
          // console.log(array);
          formdata.append('status_list', JSON.stringify(array));
          // console.log(formdata);
          let requestOptions = {
            method: 'POST',
            body: formdata,
          };
          fetch("/adviser/incentives/update-all-status", requestOptions)
            .then(response => response.json())
            .then((result) => {
              if (result.status == 200) {
                $("#modalUpdateStatus").hide();
                console.log('ESTA ES LA FORM' + formdata);
              } else {
                // Display flex for alert-message-layout.
                $('#alert-message-layout').css('display', 'flex');
                // Show the button.
                $('#error-button').show();
                // Change button text.
                $('#error-button').text(Drupal.t('Contact Support'));
                // Animation for alert-message-layout.
                $("#alert-message-layout").css("animation-name", "fadeInUpBig");
                // Change text of alert-message-layout tittle.
                $('#error-tittle').text(Drupal.t('Unexpected error'));
                // Change text of lert-message-layout message.
                $('#desc-error').text(Drupal.t("Error while updating status."));
              }
              //call function getListOfStatus to render the list of status
              getListOfBenefits();
            })
            .catch(function (error) {
              // Display flex for alert-message-layout.
              $('#alert-message-layout').css('display', 'flex');
              // Show the button.
              $('#error-button').show();
              // Change button text.
              $('#error-button').text(Drupal.t('Contact Support'));
              // Animation for alert-message-layout.
              $("#alert-message-layout").css("animation-name", "fadeInUpBig");
              // Change text of alert-message-layout tittle.
              $('#error-tittle').text(Drupal.t('Unexpected error'));
              // Change text of lert-message-layout message.
              $('#desc-error').text(Drupal.t("Error while updating status."));

              
              // console.log(Drupal.t("Error while updating status. ") + error);
            });
        } else {
          console.log(Drupal.t('Invalid points'));
        }
        // return isValidPoint;
        // });
        if (isValidPoint == true) {
          finalValidation = true;
        };
      })
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t('Unexpected error'));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while getting status list after updating."));
        // console.log(Drupal.t("Error while updating status. ") + error);
      });
    if (finalValidation == true) {
      return true;
    } else {
      return false;
    }
  }

  function getListOfBenefits() {
    let formdata2 = new FormData();
    let html_bf = '';
    let requestOptions2 = {
      method: 'POST',
      body: formdata2,
    };
    let ident = 0;
    var active = '';
      var inactive = '';
      if (window.location.href.indexOf("/en/") > -1) {
          active = 'Active';
          inactive = 'Inactive';
      } else {
          active = 'Activo';
          inactive = 'Inactivo';
      }

    fetch("/benefits/get_benefits", requestOptions2)
      .then(response => response.json())
      .then((result) => {
        let benefits_list = result.data;
        if (benefits_list.length > 0) {
          // console.log(benefits_list);
          // console.log("La información");
          //clean
          $('#table-incentives').html('');
          $('#table-incentives-head').html('');
          $('#table-incentives-head').append(`
              <th style="min-width: 800px;">
                <p class="tittle-table">
                    ${Drupal.t("BENEFITS ACCORDING TO PROCOLOMBIA AFILIATE'S STATUS CLASSIFICATION")}
                </p>
              </th>
          `);
          benefits_list.forEach((benefits) => {
            let obj_benefits = JSON.stringify(benefits);
            //replace " for '
            obj_benefits = obj_benefits.replace(/"/g, "'");
            html_bf += `
              <tr id='row-benefit-${benefits.id}'>
                <td id='column-benefit-${benefits.id}'>
                  ${window.location.href.indexOf("/en/") != -1 ? `
                      <p>${benefits.description}</p>
                    ` : `
                      <p>${benefits.description_spanish}</p>
                      `
                  }
                </td>
                <td class="status">
                  <div class="swicher">
                    <input id="input-${benefits.id}" name="input-${benefits.id}" type="checkbox"
                      ${benefits.state == 1 ? `checked` : ``}
                      onclick="updateBenefitRow(${benefits.id}, ${benefits.state})"
                    >
                    <label for="input-${benefits.id}" class="label-default"></label>
                      ${
                        //AQUI SE PREGUNTARÁ POR EL ESTADO DEL BENEFICIO Y MODIFICARA EL LABEL
                        benefits.state == 1 ? 
                        `<p class="text-na text-align-center m-0" style="color:#A1A5AA">${active}</p>` :
                        `<p class="text-na text-align-center m-0" style="color:#A1A5AA">${inactive}</p>`
                      }
                  </div>
                </td>
                <td class="  width-edit" type='button'>
                  <button data-bs-toggle="modal" onclick="renderModalEditBenefit(${obj_benefits})">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32" >
                      <defs>
                          <linearGradient id="pen" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                          <stop offset="0" stop-color="#005ca4"></stop>
                          <stop offset="1" stop-color="#008cce"></stop>
                          </linearGradient>
                          <linearGradient id="box" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                          <stop offset="0" stop-color="#d88d00"></stop>
                          <stop offset="1" stop-color="#edc500"></stop>
                          </linearGradient>
                      </defs>
                      <g id="Grupo_2425" data-name="Grupo 2425" transform="translate(-2081 -244)">
                          <rect id="Rectángulo_2984" data-name="Rectángulo 2984" width="32" height="32" transform="translate(2081 244)" fill="none"></rect>
                          <g id="Grupo_1447" data-name="Grupo 1447" transform="translate(2088 250)">
                          <path id="Trazado_119" data-name="Trazado 119" d="M619.529,455.877l-.268.268-.005,0a1.263,1.263,0,0,1-1.76.022l-1.63-1.63a.632.632,0,1,1,.894-.894l1.376,1.375h0a.316.316,0,0,0,.447,0s.008,0,.012,0l.038-.038a1.263,1.263,0,0,0,0-1.787l-1.116-1.118a1.265,1.265,0,0,0-1.788,0l-1.45,1.451a2.52,2.52,0,0,1-1.763.717H602.88a1.58,1.58,0,0,0-1.58,1.58v12.007a1.58,1.58,0,0,0,1.58,1.58h12.007a1.581,1.581,0,0,0,1.58-1.58v-8.127a.316.316,0,0,0-.539-.223s0,0,0,0l-3.51,3.51a2.514,2.514,0,0,1-1.344.7,1.279,1.279,0,0,1-.292.037h-.1c-.038,0-.074,0-.113,0h-2.319a1.264,1.264,0,0,1-1.264-1.264v-2.319c0-.038,0-.075,0-.113v-.1a1.279,1.279,0,0,1,.037-.292,2.515,2.515,0,0,1,.7-1.344l1.343-1.342,0,0a.631.631,0,1,1,.855.925l-1.308,1.308a1.257,1.257,0,0,0-.359,1c0,.018-.005.035-.005.053v.948a1.264,1.264,0,0,0,1.264,1.264h.948c.018,0,.035,0,.052-.005a1.256,1.256,0,0,0,1-.359l4.06-4.06a1.226,1.226,0,0,1,.886-.315,1.264,1.264,0,0,1,1.264,1.264v9.163a2.527,2.527,0,0,1-2.528,2.528H602.564a2.528,2.528,0,0,1-2.528-2.528V455.511a2.529,2.529,0,0,1,2.528-2.528h9.953a1.255,1.255,0,0,0,.883-.361l1.438-1.438a2.528,2.528,0,0,1,3.575,0l1.118,1.118a2.528,2.528,0,0,1,0,3.575" transform="translate(-600.036 -450.445)" fill-rule="evenodd" fill="url(#pen)"></path>
                          <path id="Trazado_120" data-name="Trazado 120" d="M632.984,464.382a.948.948,0,1,1-.948.948.949.949,0,0,1,.948-.948" transform="translate(-621.925 -459.978)" fill-rule="evenodd" fill="url(#box)"></path>
                          </g>
                      </g>
                  </svg>                        
                  </button>
                </td> 
              </tr>
            `;
          });

          $('#table-incentives').html(html_bf);
          getListOfStatus();
        }
        return result;
      })
      .then((result) => {
        let benefits_list = result.data;
        if (benefits_list.length > 0) {
          // console.log(benefits_list);
          // console.log("La información");
          benefits_list.forEach((benefits) => {
            $('#benefit-state-' + benefits.id).click(function () {
              // updateBenefitCheckbox(benefits.id);
            });
          });
        }
        return result;
      })
      .then((result) => {
        let benefits_list = result.data;
        if (benefits_list.length > 0) {
          // console.log(benefits_list);
          // console.log("La información");
          benefits_list.forEach((benefits) => {

            // Function to show the modal if the administrator wants to update the benefit
            $("#updateBenefit-" + benefits.id).click = function () {
              //if modal is hiden with jquery
              console.log(benefits.description);


              $("#update-benefit-description").val(benefits.description);
              $("#update-benefit-description-spanish").val(benefits.description_spanish);
              $("#update-benefit-state").val(benefits.state);
              $("#update-benefit-id").val(benefits.id);
              ident = benefits.id;
            };
            //with jquery
            $("#closeModalUpdateBenefit").click(function () {
              $("#modalUpdateBenefit").hide();
            });

          });
        }


      })
      .then(() => getRelationBenefitStatus())
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t('Unexpected error'));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while getting benefits list."));
        // console.log(Drupal.t("Error while updating status. ") + error);
      });
  }

  function updateBenefit(id) {
    if (updateBenefitValidations()) {
      $('#loading_edit_benefit').show();
      $('#edit_benefit_button').hide();
      // //function to update the benefit with jquery
      console.log("TESTING UPDATE BENEFIT");
      let formdata = new FormData();
      formdata.append("id", id);
      formdata.append("description", $("#update-benefit-description").val());
      formdata.append("description_spanish", $("#update-benefit-description-spanish").val());
      formdata.append("state", $("#update-benefit-state").val());
      let requestOptions = {
        method: 'POST',
        body: formdata,
      };
      fetch("/adviser/incentives/update-benefit", requestOptions)
        .then(response => response.json())
        .then((result) => {
          console.log(result);
          if (result.status == 200) {
            getListOfBenefits();
            $("#modalUpdateBenefit").modal('hide');
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t('Unexpected error'));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while updating benefit."));
          }
        })
        .catch(function (error) {
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t('Unexpected error'));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while updating benefit."));

        }).finally(() => {
          $('#loading_edit_benefit').hide();
          $('#edit_benefit_button').show();
        });
    }
  }

  // function updateBenefitCheckbox(id) {
  //   // //function to update the benefit - only the status - with jquery
  //   console.log("TESTING UPDATE BENEFIT CHECKBOX");
  //   var benefit_state = 0;
  //   if ($('#benefit-state-' + id).is(':checked')) {
  //     benefit_state = 1;
  //   }

  //   let formdata = new FormData();
  //   formdata.append("id", id);
  //   formdata.append("state", benefit_state);
  //   let requestOptions = {
  //     method: 'POST',
  //     body: formdata,
  //   };
  //   fetch("/adviser/incentives/update-benefit-status", requestOptions)
  //     .then(response => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       if (result.status == 200) {
  //         // AQUI EJECUTARA UNA FUNCION
  //       }
  //     })
  //     .then(() => {
  //       getListOfBenefits();
  //     })
  //     .catch(function (error) {
  //       // Display flex for alert-message-layout.
  //       $('#alert-message-layout').css('display', 'flex');
  //       // Show the button.
  //       $('#error-button').show();
  //       // Change button text.
  //       $('#error-button').text(Drupal.t('Contact Support'));
  //       // Animation for alert-message-layout.
  //       $("#alert-message-layout").css("animation-name", "fadeInUpBig");
  //       // Change text of alert-message-layout tittle.
  //       $('#error-tittle').text(Drupal.t('Unexpected error'));
  //       // Change text of lert-message-layout message.
  //       $('#desc-error').text(Drupal.t("Error while updating benefit."));
  //     });
  // }

  function getRelationBenefitStatus() {
    let formdata = new FormData();
    let html = '';
    let html_rel = '';
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };
    fetch("/rel_status_benefits/get_rel_status_benefits", requestOptions)
      .then(response => response.json())
      .then((result) => {
        let relation = result.data;
        if (relation.length > 0) {

          relation.reverse().forEach((rel) => {
            html_rel = `
              <td class="status">
                <label class="tick">
                  <input type="checkbox" id='rel-state-${rel.id}'
                    ${rel.state == 1 ? `checked` : ``}
                  >
                  <span class="check"></span>
                </label>
              </td>
            `;
            // $('#column-benefit-'+rel.id_benefit).append(html);
            $('#column-benefit-' + rel.id_benefit).after(html_rel);
            $('#rel-state-' + rel.id).click(function () {
              updateRelStatusBenefits(rel.id, rel.id_benefit);
            }
            );
          });

        }
      })
      .catch(function (error) {
        // Display flex for alert-message-layout.
        $('#alert-message-layout').css('display', 'flex');
        // Show the button.
        $('#error-button').show();
        // Change button text.
        $('#error-button').text(Drupal.t('Contact Support'));
        // Animation for alert-message-layout.
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        // Change text of alert-message-layout tittle.
        $('#error-tittle').text(Drupal.t('Unexpected error'));
        // Change text of lert-message-layout message.
        $('#desc-error').text(Drupal.t("Error while getting relationship between status and benefits."));
        // console.log(Drupal.t("Error while updating status. ") + error);
      });
  }

  function createStatusValidations() {
    var message = '';
    let isValid = true;
    if ($('#status-name').val() == '') {
      $('#status-name').addClass('error');
      $('#status-name').css('border-color', 'rgb(186, 12, 47)');
      isValid = false;

      message = Drupal.t("This field is required.");
      $("#error_status-name").show();
      $("#error_status-name_message").text(message);
    }
    else if (!isValidText($('#status-name').val())) {
      $('#status-name').addClass('error');
      $('#status-name').css('border-color', 'rgb(186, 12, 47)');
      isValid = false;

      message = Drupal.t("The name of the status is not valid.");
      $("#error_status-name").show();
      $("#error_status-name_message").text(message);
    }
    else {
      $('#status-name').removeClass('error');
      $('#status-name').css('border-color', 'rgb(204, 204, 204)');
      $("#error_status-name").hide();
    };
    
    if ($('#status-min-points').val() == '') {
      $('#status-min-points').addClass('error');
      isValid = false;
      $('#status-min-points').css('border-color', 'rgb(186, 12, 47)');
      $('#span-status-min-points').css('border-color', 'rgb(186, 12, 47)');

      message = Drupal.t("This field is required.");
      $("#error_status-min-points").show();
      $("#error_status-min-points_message").text(message);
    }
    else if (!isValidNumber($('#status-min-points').val())) {
      $('#status-min-points').addClass('error');
      isValid = false;
      $('#status-min-points').css('border-color', 'rgb(186, 12, 47)');
      $('#span-status-min-points').css('border-color', 'rgb(186, 12, 47)');

      message = Drupal.t("Minimum points for new status are not valid.");
      $("#error_status-min-points").show();
      $("#error_status-min-points_message").text(message);
    }
    else {
      $('#status-min-points').removeClass('error');
      $('#status-min-points').css('border-color', 'rgb(204, 204, 204)');
      $('#span-status-min-points').css('border-color', 'rgb(204, 204, 204)');
      $("#error_status-min-points").hide();
    };
    if($('#status-max-points').val() !== ''){
      if (!isValidNumber($('#status-max-points').val())) {
        $('#status-max-points').addClass('error');
        isValid = false;
        console.log("Los puntos máximos para el nuevo status no son válidos");
        $('#status-max-points').css('border-color', 'rgb(186, 12, 47)');
        $('#span-status-max-points').css('border-color', 'rgb(186, 12, 47)');

        message = Drupal.t("Maximum points for new status are not valid.");
        $("#error_status-max-points").show();
        $("#error_status-max-points_message").text(message);
      }
      else {
        if(parseInt($('#status-max-points').val()) <= parseInt($('#status-min-points').val())){
          console.log("prueba menor");
          isValid = false;
          $('#status-max-points').css('border-color', 'rgb(186, 12, 47)');
          $('#span-status-max-points').css('border-color', 'rgb(186, 12, 47)');
          message = Drupal.t("Maximum points for new status must be higher than minimum points.");
          $("#error_status-max-points").show();
          $("#error_status-max-points_message").text(message);
        }
        else {
          $('#status-max-points').removeClass('error');
          $('#status-max-points').css('border-color', 'rgb(204, 204, 204)');
          $('#span-status-max-points').css('border-color', 'rgb(204, 204, 204)');
          $("#error_status-max-points").hide();
        };
      };
    }else {
      $('#status-max-points').removeClass('error');
          $('#status-max-points').css('border-color', 'rgb(204, 204, 204)');
          $('#span-status-max-points').css('border-color', 'rgb(204, 204, 204)');
          $("#error_status-max-points").hide();
    }

    if (!isValidHexColor($('#status-emphasis-main-color').val())) {
      $('#status-emphasis-main-color').addClass('error');
      $('#status-emphasis-main-color').css('border-color', 'rgb(186, 12, 47)');
      console.log("El color principal no es válido");
      isValid = false;
    } else {
      $('#status-emphasis-main-color').removeClass('error');
      $('#status-emphasis-main-color').css('border-color', 'rgb(204, 204, 204)');
    };
    if (!isValidHexColor($('#status-emphasis-secondary-color').val())) {
      $('#status-emphasis-secondary-color').addClass('error');
      $('#status-emphasis-secondary-color').css('border-color', 'rgb(186, 12, 47)');
      console.log("El color secundario no es válido");
      isValid = false;
    }
    else {
      $('#status-emphasis-secondary-color').removeClass('error');
      $('#status-emphasis-secondary-color').css('border-color', 'rgb(204, 204, 204)');
    };
    //if id img is empty then the image is not valid
    if ($('#img').val() == '') {
      $('#img-input').addClass('error');
      $('#img-input').css('border-color', 'rgb(186, 12, 47)');
      console.log("You must upload an image for the status");
      isValid = false;
      message = Drupal.t("You must select an image.");
      $("#error_img").show();
      $("#error_img_message").text(message);
    }
    else {
      //if imput img doesnt have the string jpg or png then the image is not valid
      if ($('#img').val().indexOf('.png') == -1) {
        $('#img-input').addClass('error');
        $('#img-input').css('border-color', 'rgb(186, 12, 47)');
        isValid = false;
        message = Drupal.t("Image format is not valid, must be a .png file.");
        $("#error_img").show();
        $("#error_img_message").text(message);
      }
      else {
        $('#img-input').removeClass('error');
        $('#img-input').css('border-color', '#d8dde1');
        $("#error_img").hide();
      };
    };
    
    return isValid;
  }

  function createStatus() {
    var validationCreateStatus = true;
    if (createStatusValidations()) {
      $('#save-status').hide();
      $('#loading_create_status').show();
      //get file of status-image-src 
      var file = $('#img').prop('files')[0];
      var data = {
        name: $('#status-name').val(),
        min_points: $('#status-min-points').val(),
        max_points: $('#status-max-points').val(),
        image_src: file,
        emphasis_main_color: $('#status-emphasis-main-color').val(),
        emphasis_secondary_color: $('#status-emphasis-secondary-color').val(),
      };
      console.log(data)
      var formData = new FormData();
      formData.append("name", data.name);
      formData.append("min_points", data.min_points);
      formData.append("max_points", data.max_points);
      formData.append("image_src", data.image_src);
      formData.append("emphasis_main_color", data.emphasis_main_color);
      formData.append("emphasis_secondary_color", data.emphasis_secondary_color);


      fetch("/adviser/incentives/create-status", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          //location.reload();
          $('.status_max_points').first().css('border-color', 'rgb(204, 204, 204)');
          $('.status_span_max').first().css('border-color', 'rgb(204, 204, 204)');
          $('#status-min-points').css('border-color', 'rgb(204, 204, 204)');
          getListOfBenefits();
          $('#create-status-modal').modal('hide');
        })
        .catch(function (error) {
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t('Unexpected error'));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating status."));
          // console.log(Drupal.t("Error while updating status. ") + error);

        }).finally(function () {
          $('#save-status').show();
          $('#loading_create_status').hide();

        });
    } else {
      console.log('LAS VALIDACIONES NO PASARON LA PRUEBA');
    }
  }

  function showModalCreateBenefit() {
    //if benebit is hidden, show it
    if ($('#benefit-modal').css('display') == 'none') {
      $('#benefit-modal').show();
    }
    //if benefit is visible, hide it
    else {
      $('#benefit-modal').hide();
    }
  }

  function createBenefitValidations() {
    var message = "";
    let isValid = true;
    var description = $('#benefit-description').val();
    var description_spanish = $('#benefit-description-spanish').val();
    if (description == '') {
      $('#benefit-description').addClass('error');
      isValid = false;
      $('#benefit-description').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description in English can't be empty");
      
      $("#error_benefit-description").show();
      $("#error_benefit-description_message").text(message);

    } else if (!isValidText(description)) {
      $('#benefit-description').addClass('error');
      isValid = false;
      $('#benefit-description').css('border-color', 'rgb(186, 12, 47)');

      message = Drupal.t("Description can't contain special characters");

      $("#error_benefit-description").show();
      $("#error_benefit-description_message").text(message);
    }
    else {
      $('#benefit-description').removeClass('error');
      $('#benefit-description').css('border-color', 'rgb(204, 204, 204)');
      $("#error_benefit-description").hide();
    };

    if (description_spanish == '') {
      $('#benefit-description-spanish').addClass('error');
      isValid = false;
      $('#benefit-description-spanish').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description in Spanish can't be empty");

      $("#error_benefit-description-spanish").show();
      $("#error_benefit-description-spanish_message").text(message);
    }
    else if (!isValidTextSpanish(description_spanish)) {
      $('#benefit-description-spanish').addClass('error');
      isValid = false;
      $('#benefit-description-spanish').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description in spanish can't contain special characters");

      $("#error_benefit-description-spanish").show();
      $("#error_benefit-description-spanish_message").text(message);
    }
    else {
      $('#benefit-description-spanish').removeClass('error');
      $('#benefit-description-spanish').css('border-color', 'rgb(204, 204, 204)');
      $("#error_benefit-description-spanish").hide();
    };

    return isValid;
  }

  function updateBenefitValidations() {
    var message = "";
    let isValid = true;
    var description = $('#update-benefit-description').val();
    var description_spanish = $('#update-benefit-description-spanish').val();
    if (description == '') {
      $('#update-benefit-description').addClass('error');
      isValid = false;
      $('#update-benefit-description').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description in English can't be empty");
      
      $("#error_update-benefit-description").show();
      $("#error_update-benefit-description_message").text(message);

    } else if (!isValidTextSpanish(description)) {
      $('#update-benefit-description').addClass('error');
      isValid = false;
      $('#update-benefit-description').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description can't contain special characters");
      
      $("#error_update-benefit-description").show();
      $("#error_update-benefit-description_message").text(message);
      
    }
    else {
      $('#update-benefit-description').removeClass('error');
      $('#update-benefit-description').css('border-color', 'rgb(204, 204, 204)');
      $("#error_update-benefit-description").hide();
    };
    if (description_spanish == '') {
      $('#update-benefit-description-spanish').addClass('error');
      isValid = false;
      $('#update-benefit-description-spanish').css('border-color', 'rgb(186, 12, 47)');
      message = Drupal.t("Description in Spanish can't be empty");
      
      $("#error_update-benefit-description-spanish").show();
      $("#error_update-benefit-description-spanish_message").text(message);
    }
    else if (!isValidTextSpanish(description_spanish)) {
      $('#update-benefit-description-spanish').addClass('error');
      isValid = false;
      $('#update-benefit-description-spanish').css('border-color', 'rgb(186, 12, 47)');
      console.log('La descripción no puede contener caracteres especiales');
      message = Drupal.t("Description can't contain special characters");
      
      $("#error_update-benefit-description-spanish").show();
      $("#error_update-benefit-description-spanish_message").text(message);
    }
    else {
      $('#update-benefit-description-spanish').removeClass('error');
      $('#update-benefit-description-spanish').css('border-color', 'rgb(204, 204, 204)');
      $("#error_update-benefit-description-spanish").hide();
    };

    return isValid;
  }

  function createBenefit() {
    if (createBenefitValidations()) {
      //get the values of the fields
      $('#save-benefit').hide()
      $('#loading_create_benefit').show()
      var data = {
        description: $('#benefit-description').val(),
        description_spanish: $('#benefit-description-spanish').val(),
        state: 1,
      };
      var formData = new FormData();
      formData.append("description", data.description);
      formData.append("description_spanish", data.description_spanish);
      formData.append("state", data.state);

      fetch("/adviser/incentives/create-benefit", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status == 200) {
            getListOfBenefits();
            $('#create-benefit-modal').modal('hide');
          } else {
            // Display flex for alert-message-layout.
            $('#alert-message-layout').css('display', 'flex');
            // Show the button.
            $('#error-button').show();
            // Change button text.
            $('#error-button').text(Drupal.t('Contact Support'));
            // Animation for alert-message-layout.
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            // Change text of alert-message-layout tittle.
            $('#error-tittle').text(Drupal.t('Unexpected error'));
            // Change text of lert-message-layout message.
            $('#desc-error').text(Drupal.t("Error while creating benefit."));
          }
          $('#save-benefit').show()
          $('#loading_create_benefit').hide()
        })
        .catch(function (error) {
          $('#save-benefit').show()
          $('#loading_create_benefit').hide()
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t('Unexpected error'));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while creating benefit."));
          // console.log(Drupal.t("Error while updating status. ") + error);
        });
    }
  }

  function updateRelStatusBenefits(id) {
    //if checkbox is checked, rel_state = 1, else 0
    var rel_state = 0;
    if ($('#rel-state-' + id).is(':checked')) {
      rel_state = 1;
    }
    var data = {
      id_rel: id,
      rel_state: rel_state,
    };
    var formData = new FormData();
    formData.append("id_rel", data.id_rel);
    formData.append("rel_state", rel_state);

    fetch("/adviser/incentives/update-rel-status-benefits", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        console.log(formData);
        localStorage.setItem("id_rel", formData.id_rel);
        localStorage.setItem("rel_state", formData.rel_state);
        return response.json();
      })
      .catch(function (error) {
        $("#alert-message-layout").css("animation-name", "fadeInUpBig");
        $("#alert-message-layout").show();
        console.log(Drupal.t("Error while updating incentive. ") + error);
      });
  }

  const openModalEditBenefit = (benefit) => {
    //set values
    $('#update-benefit-state').val(benefit.state);
    $('#update-benefit-description').val(benefit.description);
    $('#update-benefit-description-spanish').val(benefit.description_spanish);

    //put onclick event
    $('#edit_benefit_button').attr('onclick', 'updateBenefitCall(' + benefit.id + ')');
    $('#modalUpdateBenefit').modal('show');
    $('#update-benefit-description').css('border-color', 'rgb(204, 204, 204)');
    $('#update-benefit-description-spanish').css('border-color', 'rgb(204, 204, 204)');
  }
  function updateBenefitRow(id, state) {
    let formData = new FormData();
    formData.append('id', id);
    if (state == 1) {
        formData.append('state', 0);
    } else {
        formData.append('state', 1);
    }

    fetch('/adviser/incentives/update-benefit-status', {
        method: 'POST',
        body: formData
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.status == 200) {
            //reload table
        } else {
          // Display flex for alert-message-layout.
          $('#alert-message-layout').css('display', 'flex');
          // Show the button.
          $('#error-button').show();
          // Change button text.
          $('#error-button').text(Drupal.t('Contact Support'));
          // Animation for alert-message-layout.
          $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          // Change text of alert-message-layout tittle.
          $('#error-tittle').text(Drupal.t('Unexpected error'));
          // Change text of lert-message-layout message.
          $('#desc-error').text(Drupal.t("Error while updating benefit state."));
        }
    }).catch(function (error) {
         // Display flex for alert-message-layout.
         $('#alert-message-layout').css('display', 'flex');
         // Show the button.
         $('#error-button').show();
         // Change button text.
         $('#error-button').text(Drupal.t('Contact Support'));
         // Animation for alert-message-layout.
         $("#alert-message-layout").css("animation-name", "fadeInUpBig");
         // Change text of alert-message-layout tittle.
         $('#error-tittle').text(Drupal.t('Unexpected error'));
         // Change text of lert-message-layout message.
         $('#desc-error').text(Drupal.t("Error while updating benefit state."));
    }).finally(function () {
      getListOfBenefits();
    });
    

}

  Drupal.behaviors.cp_incentives = {
    attach: function (context, settings) {
      if (context == document) {
        console.log("ENTRO")
        //check if path is messages
        init();
        var url = window.location.href;
        $("#create-new-status").click(function () {
          $('#img-input').css('border-color', '#d8dde1');
          $('#error_img').hide();
          $('#text-archive').text('');
        });
        // if(url.includes("adviser/incentives/list") || url.includes("adviser/incentives/dashboard")){
        // $("#edit-criteria-close", context).click(function () {
        //   closeModalCriteria();
        // });
        $("#edit-criteria-save", context).click(function () {
          updateBusinessRulesAndCriteria();
        });
        $('#save-status').on('click', function () {
          console.log("save status");
          createStatus();
        });
        $('#update-all-status').on('click', function () {
          updateAllStatus();
        });
        $("#updateBenefit", context).click(function () {
          updateBenefit();
        });
        $("#create-benefit", context).click(function () {
          showModalCreateBenefit();
          $('#benefit-description').removeClass('error');
          $('#benefit-description').css('border-color', 'rgb(204, 204, 204)');
          $("#error_benefit-description").hide();

          $('#benefit-description-spanish').removeClass('error');
          $('#benefit-description-spanish').css('border-color', 'rgb(204, 204, 204)');
          $("#error_benefit-description-spanish").hide();
        });

        $('#save-benefit').on('click', function () {
          createBenefit();
        });

        window.renderModalEditBenefit = function (benefit) {
          console.log(benefit);
          $('#error_update-benefit-description').hide();
          $('#error_update-benefit-description-spanish').hide();
          openModalEditBenefit(benefit);
        }

        window.updateBenefitCall = function (id) {
          console.log(id);
          updateBenefit(id);
        }
        window.updateBenefitRow = function (index, state) {
          updateBenefitRow(index, state);
      }

        //check if #img change
        $('#img').change(function () {
          //get name of file
          var fileName = $(this).val().split('\\').pop();
          //replace the "Choose a file" label
          $('#text-archive').html(fileName);
        })
      };
    }
  }
}(jQuery, Drupal));
