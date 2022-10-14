/*
 * Service for an main adviser.
 */
(function ($ ,Drupal) {
  'use strict';
  function init() {
    if (window.location.pathname.includes('/incentives/dashboard')) {
      getListOfCriterias();
    }
    if (window.location.pathname.includes('adviser/incentives/list')) {
      getListOfStatus();
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

    const isValidTex = (text) => {
      return String(text)
        .match(
          //REGULAR EXPRESSION TO VALIDATE TEXT

          /^[a-zA-Z0-9\s\.\,\-\_\(\)\:\;\=\/\|\\\'\"\[\]\{\}]+$/
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

    
  const getListOfCriterias = () => {
    let ident = 0;
    // console.log("LIST OF CRITERIAS");
    let formdata = new FormData();
    let html4 = '';
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };
      
      fetch("/adviser/incentives/get-criterias", requestOptions)
      .then(response => response.json())
      .then((result) => {
        let criteria_list = result.data;
        if (criteria_list.length > 0) {
          let html2 = '';
          // console.log(criteria_list);
          // console.log("ALL CRITERIAS");
          criteria_list.forEach((criteria) =>{
            html2 += `
              <li>
                  <p>${Drupal.t(criteria.id)}</p>
                  <p>${Drupal.t(criteria.characteristic)}</p>
                  <p>${Drupal.t(criteria.description)}</p>
                  <p>${Drupal.t(criteria.expiration_days)}</p>
                  <input type="checkbox" id='updateStateCriteria-${criteria.id}'
                    ${criteria.state == 1 ? `checked` : ``}
                  />
                  <button id='updateCriteria-${criteria.id}'>
                    EDITAR CRITERIA
                  </button>
                  <section id='criteria-business-rules-${criteria.id}'>

                  </section>
              </li>
            `
          });
          $('#criteria-table').html(html2);
        }
        return result;
      })
      .then((result) => {
        let criteria_list = result.data;
        if (criteria_list.length > 0) {
          // console.log(criteria_list);
          // console.log("La información");
          criteria_list.forEach((criteria) =>{
            // Function to show the modal if the administrator wants to update the benefit
            document.getElementById("updateCriteria-"+criteria.id).onclick = function() {
              showModalCriteria(criteria.id, criteria.characteristic, criteria.description, criteria.expiration_days, criteria.state);
            };
            //CALL THE FUNCTION TO UPDATE THE CRITERIA FOR EACH updateStateCriteria-ID
            updateStateCriteria(criteria.id, criteria.expiration_days);
          });
        }
      })
      .then((result) => {
        getBusinessRules();
      })
      .catch(error => console.log('error', error));
  }

function getBusinessRules () {
  let formdata = new FormData();
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };

  fetch("/adviser/incentives/get-business-rules", requestOptions)
    .then(response => response.json())
    .then((result) => {
      let business_rules_list = result.data;
      if (business_rules_list.length > 0) {
        let html = '';
        business_rules_list.forEach((business_rule) =>{
          if(business_rule.measurement_unit != null && business_rule.measurement_unit != '') {
            html= `
              <p>
                ${business_rule.id} ---
                ${Drupal.t(business_rule.measurement_unit)}
                ${business_rule.min_measure}
                ${business_rule.max_measure}
                ${business_rule.given_points}
              </p>
            `;
            $('#criteria-business-rules-'+business_rule.id_incentives_criteria).append(html);
          }
        });
        
      }
      return result;
    })
}

  function updateStateCriteria(id, exp) {
    document.getElementById("updateStateCriteria-"+id).onclick = function () {
      let formdata = new FormData();
      formdata.append("id", id);
      formdata.append("state", document.getElementById("updateStateCriteria-"+id).checked ? 1 : 0);
      formdata.append("expiration_days", exp);

      let requestOptions = {
        method: 'POST',
        body: formdata,
      };

      fetch("/adviser/incentives/update-criteria", requestOptions)
        .then(response => response.json())
        .then((result) => {
          console.log(result);
          getListOfCriterias();
        })
        .catch(error => console.log('error', error));
    }
  };

  function updateCriteria(id, state, exp) {

  }

  const closeModalCriteria = () => {
      $("#modalUpdateCriteria").hide();
      //CLEAN THE MODAL
      $("#criteria-id").val('');
      $("#criteria-expiration-days").val('');
      $("#criteria-description").text('');
      $("#criteria-characteristic").text('');
      $("#criteria-characteristic-label").text('');
      $("#criteria-state").prop("checked", false);
  }
  
  const showModalCriteria = (id, characteristic, description, expiration_days, state) => {
    console.log('id: ' + id + 'el testeo' );
    if (document.getElementById("modalUpdateCriteria").style.display == "none") {
      
      $("#criteria-id").val(id);
      $("#criteria-expiration-days").val(expiration_days);
      $("#criteria-description").text(description);
      $("#criteria-characteristic").text(characteristic);
      $("#criteria-characteristic-label").text(Drupal.t('Variable / Característica') + ' ' + characteristic);

      if(state == 1) {
        $("#criteria-state").prop("checked", true);
      } else {
        $("#criteria-state").prop("checked", false);;
      };

      let formdata = new FormData();
      let requestOptions = {
        method: 'POST',
        body: formdata,
      };
      //function to show all measures of the criteria if criteria.id == 1 or 2 or 3
      fetch("/adviser/incentives/get-business-rules", requestOptions)
      .then(response => response.json())
      .then((result) => {
        //AFTER ALL DATA CHARGED, THEN SHOW THE MODAL
        $("#modalUpdateCriteria").show();
        let business_rules_list = result.data;
        console.log("TESTING BUSINESS RULES LIST" + id);
        console.log(business_rules_list);
        //get the business rules of the criteria where criteria.id == 1
        let business_rules_list_filtered = business_rules_list.filter(business_rule => business_rule.id_incentives_criteria == id);
        console.log(business_rules_list_filtered);
          $('#min-measure-1').val(business_rules_list_filtered[0].min_measure);
          $('#max-measure-1').val(business_rules_list_filtered[0].max_measure);
          $('#points-1').val(business_rules_list_filtered[0].given_points);
          $('#total-points').val(business_rules_list_filtered[0].given_points);
          //Checking if is the first business rule
          if(id == 1 || id == 2 || id == 3) { 
            $('#min-measure-2').val(business_rules_list_filtered[1].min_measure);
            $('#max-measure-2').val(business_rules_list_filtered[1].max_measure);
            $('#points-2').val(business_rules_list_filtered[1].given_points);
            $('#min-measure-3').val(business_rules_list_filtered[2].min_measure);
            $('#max-measure-3').val(business_rules_list_filtered[2].max_measure);
            $('#points-3').val(business_rules_list_filtered[2].given_points);
            $('#total-points').val(business_rules_list_filtered[0].given_points);
            //#total-points read only
            $('#total-points').prop('readonly', true);
          } else {
            $('#total-points').prop('readonly', false);
            $('#id--others').val(business_rules_list_filtered[0].id);
          }
      })
      .catch(error => console.log('error', error));

      //function to show modalUpdateCriteria__businessRules if criteria.id == 1 or 2 or 3
      if (id == 1 || id == 2 || id == 3) {
          $("#modalUpdateCriteria__businessRules").show();

      } else {
        $("#modalUpdateCriteria__businessRules").hide();
      }
    } else {
      $("#modalUpdateCriteria").hide();
    }
    // console.log('La prueba' + criteria.id);
  }

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
        status_list.forEach((status) =>{
          html_td += `
            <tr>
              <td>
                <div class="incentive-image" id='ONLY-TESTING-${status.image_src}'>
                  <svg class="status_icon" xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
                    <linearGradient id="gradient_mobile">
                      <stop class="main-stop" offset="0%"></stop>
                      <stop class="alt-stop" offset="100%"></stop>
                    </linearGradient>
                    <path d="M458.622 255.92l45.985-45.005c13.708-12.977 7.316-36.039-10.664-40.339l-62.65-15.99 17.661-62.015c4.991-17.838-11.829-34.663-29.661-29.671l-61.994 17.667-15.984-62.671C337.085.197 313.765-6.276 300.99 7.228L256 53.57 211.011 7.229c-12.63-13.351-36.047-7.234-40.325 10.668l-15.984 62.671-61.995-17.667C74.87 57.907 58.056 74.738 63.046 92.572l17.661 62.015-62.65 15.99C.069 174.878-6.31 197.944 7.392 210.915l45.985 45.005-45.985 45.004c-13.708 12.977-7.316 36.039 10.664 40.339l62.65 15.99-17.661 62.015c-4.991 17.838 11.829 34.663 29.661 29.671l61.994-17.667 15.984 62.671c4.439 18.575 27.696 24.018 40.325 10.668L256 458.61l44.989 46.001c12.5 13.488 35.987 7.486 40.325-10.668l15.984-62.671 61.994 17.667c17.836 4.994 34.651-11.837 29.661-29.671l-17.661-62.015 62.65-15.99c17.987-4.302 24.366-27.367 10.664-40.339l-45.984-45.004z" fill="url(#gradient_mobile)"></path>
                  </svg>
                  <p>STATUS ${status.name}</p>
                </div>
              </td>
              <td>
                <div class="incentive-description">
                  <div class="input-group">
                        <input type="text" class="form-control status_min_points" aria-label="Recipient's username" aria-describedby="basic-addon2" id="status-min-points-${status.id}"
                        ${status.id == 1 ? ` value=${status.min_points} readonly` : `value=${status.min_points}`}
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        onkeypress="return event.charCode != 190"W
                        onkeypress="return event.charCode != 188"
                      />
                      <span class="input-group-text" id="status-span-min-${status.id}">${Drupal.t("Points")}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="incentive-status">
                  <div class="input-group">
                    <input type="text" class="form-control status_max_points" aria-label="Recipient's username"         
                      aria-describedby="basic-addon2" id="status-max-points-${status.id}"
                      ${status.id == status_list[0].id ? ` value='' readonly` : `value=${status.max_points}`}
                      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                      onkeypress="return event.charCode != 190"
                      onkeypress="return event.charCode != 188"
                    />
                    <span class="input-group-text status_span_max" id="status-span-max-${status.id}">${Drupal.t("Points")}</span>
                  </div>
                </div>
              </td>
            </tr>
          `;
        });
        $('#table-incentives-tbody').html(html_td);
        status_list.reverse().forEach((status) =>{
          html_st = `
          <th class="status" style="width: 200px"> 
            <svg id='ONLY-TESTING-${status.image_src}' class="status_icon" xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
                <linearGradient id="bronze">
                  <stop style="stop-color: #CD7F32;" offset="0%"></stop>
                  <stop style="stop-color: #8E402A;" offset="100%"></stop>
                </linearGradient>
                <path d="M458.622 255.92l45.985-45.005c13.708-12.977 7.316-36.039-10.664-40.339l-62.65-15.99 17.661-62.015c4.991-17.838-11.829-34.663-29.661-29.671l-61.994 17.667-15.984-62.671C337.085.197 313.765-6.276 300.99 7.228L256 53.57 211.011 7.229c-12.63-13.351-36.047-7.234-40.325 10.668l-15.984 62.671-61.995-17.667C74.87 57.907 58.056 74.738 63.046 92.572l17.661 62.015-62.65 15.99C.069 174.878-6.31 197.944 7.392 210.915l45.985 45.005-45.985 45.004c-13.708 12.977-7.316 36.039 10.664 40.339l62.65 15.99-17.661 62.015c-4.991 17.838 11.829 34.663 29.661 29.671l61.994-17.667 15.984 62.671c4.439 18.575 27.696 24.018 40.325 10.668L256 458.61l44.989 46.001c12.5 13.488 35.987 7.486 40.325-10.668l15.984-62.671 61.994 17.667c17.836 4.994 34.651-11.837 29.661-29.671l-17.661-62.015 62.65-15.99c17.987-4.302 24.366-27.367 10.664-40.339l-45.984-45.004z" fill="url(#bronze)"></path>
            </svg>
            <p>STATUS ${status.name}</p>
        </th>
          `;
          $('#table-incentives-head').append(html_st);
        });

        
        // $('#list-of-status').html(html2);
        $('#table-incentives-head').append(`
        <th class="option">
          Estado
        </th>
        <th class="option">
          Editar
        </th>
        `);
        
        
      }
      return result;
    })
    
    .catch(error => console.log('error', error));
  }

  let finalValidation = false;

  /*
   * Function to update all the status
   */
  function updateAllStatus () {
    
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
            console.log(first_status.id + ' ESTE ES EL ULTIMO');
            console.log(typeof(parseInt(first_status.id)));

            // IMPORTANT: WHE HAVE TO PARSE THE VALUE TO INT BECAUSE THE VALUE IS A STRING
            let iterator = 0;
            status_list.forEach((status) =>{
              
              $('#status-min-points-'+status.id).on('input', function() {
                console.log('TESTING min points');
              });
              $('#status-max-points-'+status.id).on('input', function() {
                console.log('TESTING max points');
              });

              //CHECKING THE FIRST STATUS - LOWER
              if(parseInt(status.id) === parseInt(first_status.id) ){
                if(($('#status-min-points-'+status.id).val()) !== '0'){
                  console.log('For the status ' + status.name + ' the min points must be 0');
                  isValidPoint = false;
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  
                }
                else if(parseInt($('#status-min-points-'+status.id).val()) ==
                parseInt($('#status-max-points-'+status.id).val())){
                  console.log('For the status ' + status.name + ' the max points must be higher to min points');
                  isValidPoint = false; 
                  $('#status-max-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-max-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                }else{
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-max-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-max-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                }
              }

              //CHECKING THE LAST STATUS - HIGHER
              else if(parseInt(status.id) === parseInt(last_status.id)){
                if($('#status-max-points-'+status.id).val() !== ''){
                  if($('#status-name').val() == ''
                  && $('#status-min-points').val() == ''
                  && $('#status-image-src').val() == ''
                  && validatingNewStatus == false){
                    console.log('For the status ' + status.name + ' the max points must be null');
                    $('#status-max-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                    $('#status-span-max-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                    isValidPoint = false; 
                  }else {
                    $('#status-max-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                    $('#status-span-max-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  }
                };
                if(parseInt($('#status-min-points-'+status.id).val()) <=
                parseInt($(('#status-max-points-'+status_list[iterator+1].id)).val())){
                  console.log('For the status ' + status.name + ' the min points must be higher than the last status max points');
                  isValidPoint = false;
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                } else {
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                }
                if(parseInt($('#status-min-points-'+status.id).val()) -
                parseInt($(('#status-max-points-'+status_list[iterator+1].id)).val()) !== 1){
                  console.log('For the status ' + status.name + ' V A L I D A C I O N  DE SECUENCIA');
                  isValidPoint = false;
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-min-points-'+status_list[iterator+1].id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status_list[iterator+1].id).css('border-color', 'rgb(186, 12, 47)');
                } else{
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-min-points-'+status_list[iterator+1].id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status_list[iterator+1].id).css('border-color', 'rgb(204, 204, 204)');
                }
              }

              //CHECKING THE STATUS IN THE MIDDLE
              else if(last_status.id !== status.id && first_status.id !== status.id) {
                //CHECK IF THE MIN POINTS ARE LOWER THAN THE MAX POINTS
                if(parseInt($('#status-min-points-'+status.id).val()) 
                  > parseInt($('#status-max-points-'+status.id).val())){
                  isValidPoint = false;
                  console.log('min points cannot be greater than max points');
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-max-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-max-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                }else if(parseInt($('#status-min-points-'+status.id).val()) == parseInt($('#status-max-points-'+status.id).val())) {
                  isValidPoint = false;
                  console.log('Min points cannot be equal to max points');
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-max-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-max-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                }else {
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-max-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-max-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                }
                if(parseInt($('#status-min-points-'+status.id).val()) <=
                parseInt($(('#status-max-points-'+status_list[iterator+1].id)).val())){
                  console.log('For the status ' + status.name + ' the min points must be higher than the last status max points');
                  isValidPoint = false; 
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                }else {
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                }
                if(parseInt($('#status-min-points-'+status.id).val()) -
                parseInt($(('#status-max-points-'+status_list[iterator+1].id)).val()) !== 1){
                  console.log('For the status ' + status.name + ' V A L I D A C I O N  DE SECUENCIA');
                  isValidPoint = false;
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-min-points-'+status_list[iterator+1].id).css('border-color', 'rgb(186, 12, 47)');
                  $('#status-span-min-'+status_list[iterator+1].id).css('border-color', 'rgb(186, 12, 47)');
                } else{
                  $('#status-min-points-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status.id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-min-points-'+status_list[iterator+1].id).css('border-color', 'rgb(204, 204, 204)');
                  $('#status-span-min-'+status_list[iterator+1].id).css('border-color', 'rgb(204, 204, 204)');
                }
              }
              iterator++;
            });
          //CHECKING WHEN NEW STATUS IS CREATED
          if($('#status-name').val() !== ''
            && $('#status-min-points').val() !== ''
            && $('#status-image-src').val() !== ''){
            if(parseInt($('.status_max_points').first().val()) != parseInt($('#status-min-points').val())-1){
              isValidPoint = false;
            }
          };
          if(isValidPoint) {
          let formdata = new FormData();
          let status_list = result.data;
          let array = [];
          status_list.forEach((status) =>{
              array.push({
                id: status.id,
                min_points: $("#status-min-points-"+status.id).val(),
                max_points: $("#status-max-points-"+status.id).val(),
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
            }
            //call function getListOfStatus to render the list of status
            getListOfStatus();

          })
          .catch(function (error) {
            alert(Drupal.t("Error while updating status. ") + error);
            // console.log(Drupal.t("Error while updating status. ") + error);
          });
        } else {
          console.log('Invalid points');
        }
        // return isValidPoint;
        // });
        if(isValidPoint == true){
          finalValidation = true;
        };
    })
    if(finalValidation == true){
      return true;
    }else{
      return false;
    }    
  }
  
  function getListOfBenefits () {
    let formdata2 = new FormData();
      let html_bf = '';
      let requestOptions2 = {
        method: 'POST',
        body: formdata2,
      };
      let ident = 0;
      fetch("/benefits/get_benefits", requestOptions2)
      .then(response => response.json())
      .then((result) => {
        let benefits_list = result.data;
        if (benefits_list.length > 0) {
          // console.log(benefits_list);
          // console.log("La información");
          benefits_list.forEach((benefits) =>{
            // html2 += `
            //   <li>
            //     <div id='column-benefit-${benefits.id}'>
            //       <p>
            //         ${Drupal.t(benefits.id)}
            //       </p>
            //       <p>
            //         ${Drupal.t(benefits.description)}
            //       </p>
            //       <p>${Drupal.t("State")}: ${Drupal.t(benefits.state)}</p>
            //       <input id='benefit-state-${benefits.id}' type="checkbox"
            //         ${benefits.state == 1 ? `checked` : ``}
            //       >
            //       <button id='updateBenefit-${benefits.id}' type='button'>
            //         EDIT
            //       </button>
            //     </div>
            //   </li>
            // `;
            html_bf += `
              <tr id='row-benefit-${benefits.id}'>
                <td id='column-benefit-${benefits.id}'>
                  <p>
                    ${Drupal.t(benefits.description)}
                  </p>
                </td>
                <td class="status">
                  <div class="swicher">
                    <input id="input-${benefits.id}" name="input-${benefits.id}" checked="" type="checkbox"
                      ${benefits.state == 1 ? `checked` : ``}
                    >
                    <label for="input-${benefits.id}" class="label-default"
                    ${
                      //AQUI SE PREGUNTARÁ POR EL ESTADO DEL BENEFICIO Y MODIFICARA EL LABEL
                      benefits.state == 1 ? `style="background-color: #00b050"` : `style="background-color: #e46c0a"`
                    }

                    ></label>
                  </div>
                </td>
                <td class="  width-edit" id='updateBenefit-${benefits.id}' type='button'>
                  <button onclick="openModalEdit(0)">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
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
        }
        return result;
      })
      .then((result) => {
        let benefits_list = result.data;
        if (benefits_list.length > 0) {
          // console.log(benefits_list);
          // console.log("La información");
          benefits_list.forEach((benefits) =>{
            $('#benefit-state-'+benefits.id).click(function(){
              updateBenefitCheckbox(benefits.id);
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
          benefits_list.forEach((benefits) =>{

            // Function to show the modal if the administrator wants to update the benefit
            document.getElementById("updateBenefit-"+benefits.id).onclick = function () {
              if (document.getElementById("modalUpdateBenefit").style.display == "none") {
                //with jquery
                $("#modalUpdateBenefit").css('display', 'flex');
                $("#update-benefit-description").val(benefits.description);
                $("#update-benefit-description-spanish").val(benefits.description_spanish);
                $("#update-benefit-state").val(benefits.state);
                $("#update-benefit-id").val(benefits.id);
                ident = benefits.id;
              } else {
                $("#modalUpdateBenefit").hide();
              }
              // console.log('La prueba' + benefits.id);
            };
            //with jquery
            $("#closeModalUpdateBenefit").click(function () {
              $("#modalUpdateBenefit").hide();
            });

          });
        }
       

      })
      .then(() =>  getRelationBenefitStatus ())
      .catch(error => console.log('error', error));
  }

  function updateBenefit(){
    // //function to update the benefit with jquery
    console.log("TESTING UPDATE BENEFIT");
      let formdata = new FormData();
      formdata.append("id", $("#update-benefit-id").val());
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
          $("#modalUpdateBenefit").hide();
          
        }
      })
      .then(() => {
        getListOfBenefits();
      })
      .catch(function (error) {
        alert(Drupal.t("Error while updating benefit. ") + error);
        console.log(Drupal.t("Error while updating benefit. ") + error);
      }); 
  }
  function updateBenefitCheckbox(id){
    // //function to update the benefit - only the status - with jquery
    console.log("TESTING UPDATE BENEFIT CHECKBOX");
    var benefit_state = 0;
    if ($('#benefit-state-' + id).is(':checked')) {
      benefit_state = 1;
    }

      let formdata = new FormData();
      formdata.append("id", id);
      formdata.append("state", benefit_state);
      let requestOptions = {
        method: 'POST',
        body: formdata,
      };
      fetch("/adviser/incentives/update-benefit-status", requestOptions)
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          // AQUI EJECUTARA UNA FUNCION
        }
      })
      .then(() => {
        getListOfBenefits();
      })
      .catch(function (error) {
        alert(Drupal.t("Error while updating benefit. ") + error);
        console.log(Drupal.t("Error while updating benefit. ") + error);
      }); 
  }

  function getRelationBenefitStatus () {
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

          relation.reverse().forEach((rel) =>{
            // html = `
            //     <div style="background-color: green; color: white;">
            //       <input id='input-${rel.id}' readonly type="text" value="${rel.id}"/>
            //       <input id='rel-state-${rel.id}' type="checkbox"
            //         ${rel.state == 1 ? `checked` : ``}
            //       >
            //     </div>
            // `;
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
            $('#column-benefit-'+rel.id_benefit).after(html_rel);
            $('#rel-state-'+rel.id).click(function () {
              updateRelStatusBenefits(rel.id, rel.id_benefit);
            }
            );
          });
          
        }
      })
      .catch(error => console.log('error', error));
  }

  function updateBusinessRulesAndCriteria (){
      //function to update the criteria with jquery
        if(validateModalCriteria()){
          // alert('VALIDANDO  2');
        let state_criteria;
        if ($("#criteria-state").is(":checked")) {
          state_criteria = 1;
        } else {
          state_criteria = 0;
        }
        let id_criteria = parseInt($("#criteria-id").val());
        let formdata = new FormData();
        formdata.append("id", id_criteria);
        formdata.append("state", state_criteria);
        formdata.append("expiration_days", $("#criteria-expiration-days").val());

        let cont = 0;
        //if the criteria.id == 1 or 2 or 3, update the business rules
        if (id_criteria == 1){
          cont = 0;
        } else if (id_criteria == 2){
          cont = 3;
        } else if (id_criteria == 3){
          cont = 6;
        } else {
          cont = 0;
        }
        if (id_criteria == 1 || id_criteria == 2 || id_criteria == 3){
          console.log('PROBANDO EL BUCLE');
          formdata.append("id_criteria_1", (1+cont));
          formdata.append("min_measure_1", $("#min-measure-1").val());
          formdata.append("max_measure_1", $("#max-measure-1").val());
          formdata.append("given_points_1", $("#points-1").val());
          formdata.append("id_criteria_2", 2+cont);
          formdata.append("min_measure_2", $("#min-measure-2").val());
          formdata.append("max_measure_2", $("#max-measure-2").val());
          formdata.append("given_points_2", $("#points-2").val());
          formdata.append("id_criteria_3", 3+cont);
          formdata.append("min_measure_3", $("#min-measure-3").val());
          formdata.append("max_measure_3", $("#max-measure-3").val());
          formdata.append("given_points_3", $("#points-3").val());
        } else {
          formdata.append("id-criteria", $("#id--others").val());
          formdata.append("points", $("#total-points").val());
        }

        let requestOptions = {
          method: 'POST',
          body: formdata,
        };
        if (id_criteria == 1 || id_criteria == 2 || id_criteria == 3){
          //function to update the specifications of the criteria - points, min and max -
          fetch("/adviser/incentives/update-business-rules-type1", requestOptions)
          .then(response => response.json())
          .then((result) => {
            if (result.status == 200) {
              $("#modalUpdateCriteria").hide();
              console.log('TESTING OKKK' + id_criteria);
            }
          })
          .catch(function (error) {
            alert(Drupal.t("Error while updating criteria. ") + error);
            console.log(Drupal.t("Error while updating criteria. ") + error);
          });
        } else if (id_criteria > 3) {
          //function to update the specifications of the criteria - points, min and max -
          fetch("/adviser/incentives/update-business-rules-type2", requestOptions)
          .then(response => response.json())
          .then((result) => {
            if (result.status == 200) {
              $("#modalUpdateCriteria").hide();
              console.log('TESTING DE LOS OTROS');
              console.log('TESTING OKKK' + id_criteria);
            }
          })
          .catch(function (error) {
            alert(Drupal.t("Error while updating criteria. ") + error);
            console.log(Drupal.t("Error while updating criteria. ") + error);
          });
        }

        fetch("/adviser/incentives/update-criteria", requestOptions)
        .then(response => response.json())
        .then((result) => {
          if (result.status == 200) {
            $("#modalUpdateCriteria").hide();
            console.log('TESTING OKKK' + id_criteria);
          }
          //call function getListOfCriterias to render the list of criterias
          getListOfCriterias();
          // getBusinessRules ();
        })
        .catch(function (error) {
          alert(Drupal.t("Error while updating criteria. ") + error);
          console.log(Drupal.t("Error while updating criteria. ") + error);
        });
      }
  }

  //VALIDATION OF THE MODAL FORM
  function validateModalCriteria () {
    // alert('VALIDANDO');
    let validateModalCriteria = true;
    let criteria = parseInt($("#criteria-id").val());
    let min_measure_1 = parseInt($("#min-measure-1").val());
    let max_measure_1 = parseInt($("#max-measure-1").val());
    let points_1 = parseInt($("#points-1").val());
    let min_measure_2 = parseInt($("#min-measure-2").val());
    let max_measure_2 = parseInt($("#max-measure-2").val());
    let points_2 = parseInt($("#points-2").val());
    let min_measure_3 = parseInt($("#min-measure-3").val());
    let max_measure_3 = parseInt($("#max-measure-3").val());
    let points_3 = parseInt($("#points-3").val());

    let criteria_expiration_days = parseInt($("#criteria-expiration-days").val());
    let total_points = parseInt($("#total-points").val());

    // //VALITATION OF THE FIRST THREE CRITERIAS
    if (criteria <= 3){
    //   //VALIDATING THE POINTS
      if (points_1 == 0 || points_1 == null || points_1 == undefined || points_1 == NaN){
        console.log(Drupal.t('The points cannot be equal to 0'));
        validateModalCriteria = false;
      };
      if (points_2 == 0 || points_2 == null || points_2 == undefined || points_2 == NaN){
        console.log(Drupal.t('The points cannot be equal to 0'));
        validateModalCriteria = false;
      };
      if (points_3 == 0 || points_3 == null || points_3 == undefined || points_3 == NaN){
        console.log(Drupal.t('The points cannot be equal to 0'));
        validateModalCriteria = false;
      };
      if (points_3 >= points_2){
        console.log(Drupal.t('The points of the second range must be greater than the first range'));
        validateModalCriteria = false;
      };
      if (points_2 >= points_1){
        console.log(Drupal.t('The points of the first range must be greater than the third range'));
        validateModalCriteria = false;
      };

      //VALIDATING THE FIRST CRITERIA
      if (criteria == 1){
        if(min_measure_1 != 0){
          validateModalCriteria = false;
          console.log(Drupal.t('The minimum measure of the first range must be 0'));
        };
        if(min_measure_1 >= max_measure_1){
          validateModalCriteria = false;
          console.log(Drupal.t('The minimum measure of the first range must be lower than the maximum measure'));
        };
        if(min_measure_2 >= max_measure_2){
          validateModalCriteria = false;
          console.log(Drupal.t('The minimum measure of the second range must be lower than the maximum measure'));
        }
        if(min_measure_3 >= max_measure_3){
          validateModalCriteria = false;
          console.log(Drupal.t('The minimum measure of the third range must be lower than the maximum measure'));
        }
        if(max_measure_1 != min_measure_2){
          validateModalCriteria = false;
          console.log(Drupal.t('The maximum measure of the first range must be equal to the minimum measure of the second range'));
        };
        if(max_measure_2 != min_measure_3){
          validateModalCriteria = false;
          console.log(Drupal.t('The maximum measure of the second range must be equal to the minimum measure of the third range'));
        };
      };
      //VALIDATING THE SECOND AND THIRD CRITERIA
      if (criteria == 2 || criteria == 3){
        if(max_measure_1 === 0 || max_measure_1 === null || max_measure_1 === undefined || max_measure_1 === ''){
          validateModalCriteria = false;
          console.log(Drupal.t('The measure of the first range must be greater than 0'));
        };
        if(max_measure_2 === 0 || max_measure_2 === null || max_measure_2 === undefined || max_measure_2 === ''){
          validateModalCriteria = false;
          console.log(Drupal.t('The measure of the second range must be greater than 0'));
        };
        if(max_measure_3 === 0 || max_measure_3 === null || max_measure_3 === undefined || max_measure_3 === ''){
          validateModalCriteria = false;
          console.log(Drupal.t('The measure of the third range must be greater than 0'));
        };
        if(max_measure_2 <= max_measure_3){
          validateModalCriteria = false;
          console.log(Drupal.t('The measure of the second must be higher than the third measure'));
        };
        if(max_measure_1 <= max_measure_2){
          validateModalCriteria = false;
          console.log(Drupal.t('The measure of the first must be higher than the second measure'));
        }
      };
    };
    //VALIDATION OF THE OTHER CRITERIAS
    if (criteria >= 4) {
      if (total_points == 0 || total_points == null || total_points == ''){ 
        validateModalCriteria = false;
        console.log(Drupal.t('The total points cannot be equal to 0'));
      };
    };
    //VALIDATION OF THE EXPIRATION DAYS
    if (criteria_expiration_days == 0 || criteria_expiration_days == '' || criteria_expiration_days == null){
      validateModalCriteria = false;
      console.log(Drupal.t('The expiration days cannot be equal to 0'));
    }
    return validateModalCriteria;
  }

  function createStatusValidations() {
    let isValid = true;
    if ($('#status-name').val() == '' || !isValidTex($('#status-name').val())) {
      $('#status-name').addClass('error');
      $('#status-name').css('border-color', 'rgb(186, 12, 47)');
      console.log("El nombre del estado no es válido");
      isValid = false;
    }
    else {
      $('#status-name').removeClass('error');
      $('#status-name').css('border-color', 'rgb(204, 204, 204)');
    };
    if ($('#status-min-points').val() == '' || !isValidNumber($('#status-min-points').val())) {
      $('#status-min-points').addClass('error');
      isValid = false;
      console.log("Los puntos para el nuevo status no son válidos");
      $('#status-min-points').css('border-color', 'rgb(186, 12, 47)');
    }
    else {
      $('#status-min-points').removeClass('error');
      $('#status-min-points').css('border-color', 'rgb(204, 204, 204)');
    };
    if(parseInt($('.status_max_points').first().val()) !== parseInt($('#status-min-points').val())-1){
      $('#status-min-points').addClass('error');
      $('#status-min-points').css('border-color', 'rgb(186, 12, 47)');
      console.log("El puntaje del nuevo status debe ser un punto mayor al del status anterior");
      isValid = false;
    } else {
      $('#status-max-points').removeClass('error');
      $('#status-max-points').css('border-color', 'rgb(204, 204, 204)');
    };
    if ($('#status-max-points').val() != '') {
      $('#status-max-points').addClass('error');
      $('#status-max-points').css('border-color', 'rgb(186, 12, 47)');
      console.log("Los puntos máximos para el nuevo status deben estar vacíos");
      isValid = false;
    }
    else {
      $('#status-max-points').removeClass('error');
      $('#status-max-points').css('border-color', 'rgb(204, 204, 204)');
    };
    if ($('#status-image-src').val() == '') {
      $('#status-image-src').addClass('error');
      $('#status-image-src').css('border-color', 'rgb(186, 12, 47)');
      console.log("La imagen no es válida");
      isValid = false;
    }
    else {
      $('#status-image-src').removeClass('error');
      $('#status-image-src').css('border-color', 'rgb(204, 204, 204)');
    };
    if(!isValidHexColor($('#status-emphasis-main-color').val())){
      $('#status-emphasis-main-color').addClass('error');
      $('#status-emphasis-main-color').css('border-color', 'rgb(186, 12, 47)');
      console.log("El color principal no es válido");
      isValid = false;
    } else {
      $('#status-emphasis-main-color').removeClass('error');
      $('#status-emphasis-main-color').css('border-color', 'rgb(204, 204, 204)');
    };
    if(!isValidHexColor($('#status-emphasis-secondary-color').val())){
      $('#status-emphasis-secondary-color').addClass('error');
      $('#status-emphasis-secondary-color').css('border-color', 'rgb(186, 12, 47)');
      console.log("El color secundario no es válido");
      isValid = false;
    }
    else {
      $('#status-emphasis-secondary-color').removeClass('error');
      $('#status-emphasis-secondary-color').css('border-color', 'rgb(204, 204, 204)');
    };
    return isValid;
  }

  function showModalCreateStatus () {
    // SHOW THE ERROR TO UPDATE THE LAST STATUS MAX POINTS
    $('.status_max_points').first().css('border-color', 'rgb(186, 12, 47)');
    $('.status_span_max').first().css('border-color', 'rgb(186, 12, 47)');
    console.log("Please edit this status to update the max points");
    //change each .status_min_points to readonly
    $('.status_min_points').each(function() {
      $(this).attr('readonly', true);
    });
    //change each .status_max_points to readonly except the first one
    $('.status_max_points').each(function() {
      $(this).attr('readonly', true);
    });
    //DISABLE THE BUTTON update-all-status
    $('#update-all-status').attr('disabled', true);
    $('#update-all-status').css('background', 'rgb(204, 204, 204)');
    //change the highest .status_max_points to writeable
    $('.status_max_points').first().attr('readonly', false);
    // function to track the changes in the max points higher status
    $('.status_max_points').first().on('input', function() {
      if (parseInt($('.status_max_points').first().val()) == '' || parseInt($('.status_max_points').first().val()) == 0 || parseInt($('.status_max_points').first().val()) == undefined) { 
        console.log('Please edit the max points for this status');
        $('.status_max_points').first().css('border-color', 'rgb(186, 12, 47)');
        $('.status_span_max').first().css('border-color', 'rgb(186, 12, 47)');
        //change color create-status-button
        $('#create-status').css('background', '#f0f0f0');
        $('#create-status').css('color', 'black');
        //remove to the button create-status the function to create the status on click
        $('#create-status').off('click');

      };
      if(parseInt($('.status_min_points').first().val()) == parseInt($('.status_max_points').first().val())) {
        console.log('Status cannot have the same min and max points');
        $('.status_max_points').first().css('border-color', 'rgb(186, 12, 47)');
        $('.status_span_max').first().css('border-color', 'rgb(186, 12, 47)');
        //change color create-status-button
        $('#create-status').css('background', '#f0f0f0');
        $('#create-status').css('color', 'black');
        $('#create-status').off('click');
      }
      else if (parseInt($('.status_min_points').first().val()) > parseInt($('.status_max_points').first().val())) {
        console.log('Min points cannot be higher than max points');
        $('.status_max_points').first().css('border-color', 'rgb(186, 12, 47)');
        $('.status_span_max').first().css('border-color', 'rgb(186, 12, 47)');
        //change color create-status-button
        $('#create-status').css('background', '#f0f0f0');
        $('#create-status').css('color', 'black');
        $('#create-status').off('click');
      } else if (parseInt($('.status_min_points').first().val()) < parseInt($('.status_max_points').first().val())){
        $('.status_max_points').first().css('border-color', 'rgb(204, 204, 204)');
        $('.status_span_max').first().css('border-color', 'rgb(204, 204, 204)');

        //change color create-status-button
        $('#create-status').css('background', '#005ca4');
        $('#create-status').css('color', 'white');

        //add to the button create-status the function to create the status on click
        $('#create-status').on('click', function() {
          showModalCreateStatusFinal();
        });
      }
    });

}

function showModalCreateStatusFinal() {
  if ($('#status-modal').css('display') == 'none') {
    $('#status-modal').show();
    validatingNewStatus = true;
  }
  else {
    $('#status-modal').hide();
    validatingNewStatus = false;
  }
}
  function createStatus () {
    var validationCreateStatus = true;
    $('.status_max_points').first().attr('readonly', false);
    if($('.status_max_points').first().val() == ''){
      console.log('Primero edite el maximo de puntos del anterior status');
      $('.status_max_points').first().css('border-color', 'rgb(186, 12, 47)');
      $('.status_span_max').first().css('border-color', 'rgb(186, 12, 47)');
    } else {
      if ($('#status-min-points').val() == '') {
        createStatusValidations();
        console.log('Ahora agregue el nuevo puntaje del status');
        $('#status-min-points').css('border-color', 'rgb(186, 12, 47)');
      } else {
        if(createStatusValidations()) {
          var data = {
            name: $('#status-name').val(),
            min_points: $('#status-min-points').val(),
            max_points: $('#status-max-points').val(),
            image_src: $('#status-image-src').val(),
            emphasis_main_color: $('#status-emphasis-main-color').val(),
            emphasis_secondary_color: $('#status-emphasis-secondary-color').val(),
          };
          var formData = new FormData();
          formData.append("name", data.name);
          formData.append("min_points", data.min_points);
          formData.append("max_points", data.max_points);
          formData.append("image_src", data.image_src);
          formData.append("emphasis_main_color", data.emphasis_main_color);
          formData.append("emphasis_secondary_color", data.emphasis_secondary_color);

          updateAllStatus();
          //if(finalValidation == true){
          fetch("/adviser/incentives/create-status", {
            method: "POST",
            body: formData,
          })
            .then(function (response) {
              console.log(formData);
              localStorage.setItem("description", formData.description);
              localStorage.setItem("name", formData.name);
              localStorage.setItem("min_points", formData.min_points);
              localStorage.setItem("max_points", formData.max_points);
              localStorage.setItem("image_src", formData.image_src);
              localStorage.setItem("emphasis_main_color", formData.emphasis_main_color);
              localStorage.setItem("emphasis_secondary_color", formData.emphasis_secondary_color);
              return response.json();
            })
            .then(function () {
              location.reload();
              $('.status_max_points').first().css('border-color', 'rgb(204, 204, 204)');
              $('.status_span_max').first().css('border-color', 'rgb(204, 204, 204)');
              $('#status-min-points').css('border-color', 'rgb(204, 204, 204)');
            })
            .catch(function (error) {
              alert(Drupal.t("Error while creating status. ") + error);
              console.log(Drupal.t("Error while creating status. ") + error);
            });
            // }
        } else {
          console.log('LAS VALIDACIONES NO PASARON LA PRUEBA');
        }
      }
    }
  }

  function showModalCreateBenefit () {
    //if benebit is hidden, show it
    if ($('#benefit-modal').css('display') == 'none') {
        $('#benefit-modal').show();
    }
    //if benefit is visible, hide it
    else {
        $('#benefit-modal').hide();
    }
  }

  function createBenefitValidations () {
    let isValid = true;
    var description = $('#benefit-description').val();
    if (description == '' || !isValidTex(description)) {
      $('#benefit-description').addClass('error');
      isValid = false;
      console.log('TESTING VALID BENEFIT')
    }
    else {
      $('#benefit-description').removeClass('error');
    }
    
    return isValid;
  }
  
  function createBenefit () {
    if (createBenefitValidations()) {
      //get the values of the fields
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
          console.log(formData);
          localStorage.setItem("description", formData.description);
          localStorage.setItem("description_spanish", formData.description_spanish);
          localStorage.setItem("state", formData.state);
          return response.json();
        }).then( function(){
          getListOfBenefits();
          showModalCreateBenefit();
        })
        .catch(function (error) {
          alert(Drupal.t("Error while creating incentive. ") + error);
          console.log(Drupal.t("Error while creating incentive. ") + error);
        });
      }
  }

  function updateRelStatusBenefits (id) {
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
        alert(Drupal.t("Error while updating incentive. ") + error);
        console.log(Drupal.t("Error while updating incentive. ") + error);
      });
  }

  Drupal.behaviors.cp_incentives = {
    attach: function (context, settings) {
      if (context == document) {
        console.log("ENTRO")
        //check if path is messages
          init();
          var url = window.location.href;
          
            // if(url.includes("adviser/incentives/list") || url.includes("adviser/incentives/dashboard")){
              $("#edit-criteria-close", context).click(function () {
                closeModalCriteria();
              });
              $("#edit-criteria-save", context).click(function () {
                updateBusinessRulesAndCriteria();
              });
              $('#save-status').on('click', function () {
                createStatus();
              });
              $('#update-all-status').on('click', function () {
                updateAllStatus();
              });
              $("#create-status", context).click(function () {
                showModalCreateStatus();
              });
              $("#updateBenefit", context).click(function () {
                updateBenefit();
              });
              $("#create-benefit", context).click(function () {
                showModalCreateBenefit();
              });
              $('#save-benefit').on('click', function () {
                  createBenefit();
              });
                
            // }
      };
    }
  }
}(jQuery, Drupal));
