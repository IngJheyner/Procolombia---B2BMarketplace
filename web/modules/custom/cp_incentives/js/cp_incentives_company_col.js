/*
 * Service for a Colombian company
 */
(function ($, Drupal) {
  'use strict';
  function init() {
    if (window.location.pathname.includes('dashboard/col/user/incentives')) {
      getIncentivePlan();
      getHowLevelUp();
      const swiper = new Swiper('.slider-incentives', {
        // Optional parameters
        slidesPerView: 2,
        spaceBetween: 10,
        loop: true,
        pagination: {
          el: ".swiper-pagination-1",
          dynamicBullets: true,
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        },
      });
      var new_swiper = new Swiper(".product-slider-swiper", {
        slidesPerView: 2,
        spaceBetween: 5,
      });
    }
  }
  var typeName = 'Create new status';
  var commentsOnType = Drupal.t('@type', { '@type': typeName });
  console.log(commentsOnType);
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
          status_list.slice().reverse().forEach((status) => {
            html2 += `
            <div class="swiper-slide">
              <div class="incentive-card">
                <div class="incentive-card__banner" style="background: transparent linear-gradient(180deg, ${status.emphasis_main_color} 0%, ${status.emphasis_secondary_color} 100%) 0% 0% no-repeat padding-box;">
                </div>
                <div class="incentive-card__header d-flex">
                    <div class="incentive-card__header__icon">
                        <img src="${status.image_src}" alt="">
                    </div>
                    <div class="incentive-card__header__title">
                        <p>Status<span class="ms-1">${Drupal.t(status.name)}</span></p>
                        <p class="sub-tittle">
                        ${status.id == status_list[0].id ?
                ` ${Drupal.t("Over")} ${status.min_points} ${Drupal.t("points")}
                          `
                :
                `${status.min_points} a ${status.max_points} puntos`
              }
                       </p>
                    </div>
                </div>
                <div class="incentive-card__body" id='status-content-${status.id}'>
                </div>
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
              // console.log(benefit_list);
              console.log("La información testing");
              benefit_list.forEach((benefit) => {
                // console.log(benefit.id_status + ' ESTE ES EL ID ');
                console.log(benefit.emphasis_secondary_color);
                //if window.location.pathname.includes('dashboard/col/user/incentives')
                if (window.location.href.indexOf("/en/") != -1) {
                  html = `
                  <div class="item-check">
                    <div class="item-check__icon"
                      style= "
                        ${parseInt(benefit.id_status) >= 3 ? 'color: '+benefit.emphasis_secondary_color+';' : ''}
                      "
                    >
                        <i class='bx bx-check'></i>
                    </div>
                    <div class="item-check__text">
                        <p>${benefit.incentives_description}</p>
                    </div>
                  </div>
                `;
                } else if (window.location.href.indexOf("/es/") != -1) {
                  html = `
                  <div class="item-check">
                    <div class="item-check__icon"
                      style= "
                        ${parseInt(benefit.id_status) >= 3 ? 'color: '+benefit.emphasis_secondary_color+';' : ''}
                      "
                    >
                        <i class='bx bx-check'></i>
                    </div>
                    <div class="item-check__text">
                        <p>${benefit.incentives_description_spanish}</p>
                    </div>
                  </div>
                `;
                }
                $('#status-content-' + benefit.id_status).append(html);
              });

            }
          })
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
  }

  // function getIncentivePlan () {
  //     

  function getHowLevelUp() {
    let formdata = new FormData();
    let html = '';
    let requestOptions = {
      method: 'POST',
      body: formdata,
    };
    fetch("/user/incentives/get_incentives", requestOptions)
      .then(response => response.json())
      .then((result) => {
        let html2 = '';
        let points = result.data;
        console.log(points);
        var criterium = '';
        if (points.length > 0) {
          console.log(points);
          console.log("La información");

          points.forEach((points) => {
            // console.log(typeof(parseInt(points.id)) + "NNOONO");
            if (points.criteria_state == '1') {

              if (points.criteria_characteristic == 'Response time in chat') {
                if (points.min_measure == 0) {
                  criterium = Drupal.t('Response time in chat less than 1 hour');
                } else if (points.min_measure == 1) {
                  criterium = Drupal.t('Response time in chat between ') +
                    points.min_measure + Drupal.t(' hour and ') + points.max_measure + Drupal.t(' hours.');
                } else {
                  criterium = Drupal.t('Response time in chat between ') +
                    points.min_measure + Drupal.t(' hours and ') + points.max_measure + Drupal.t(' hours.');
                }

              } else if (points.criteria_characteristic == "International buyer's qualification") {
                criterium = Drupal.t("International buyer's rating of ") + points.max_measure + Drupal.t('-star appreciation');
              }
              else if (points.criteria_characteristic == 'Views of product or service') {
                criterium = Drupal.t('Views of product or service') + Drupal.t(' greater than or equal to ') + points.max_measure + Drupal.t(' views.');
              }
              else if (points.criteria_characteristic == 'Achievement report') {
                criterium = Drupal.t('You will accumulate points for each achievement reported and verified in CRM-Neo with the Status "Certified"');
              }
              else if (points.criteria_characteristic == 'Updating products or services') {
                criterium = Drupal.t('You will accumulate points for each product or service update in the system.');
              }
              else if (points.criteria_characteristic == 'Company profile update') {
                criterium = Drupal.t("You will accumulate points for each update in the company's profile.");
              }
              else if (points.criteria_characteristic == 'Referrals') {
                criterium = Drupal.t('You will accumulate points for each referral in the platform.');
                html2 += `
                            <div class="body-item-list">
                              <p>${criterium}</p>
                              <p class="last">+ ${points.given_points} ${Drupal.t('points')}</p>
                            </div>
                            `;
              }
              else if (points.criteria_characteristic == 'Meeting Report') {
                criterium = Drupal.t('You will accumulate points per meeting reported on the platform in the dashboard of companies with interaction.');
              }
              else if (points.criteria_characteristic == 'Sample shipment report') {
                criterium = Drupal.t('You will accumulate points for reporting a sample shipment on the platform in the dashboard of companies with interaction.');
              }
              else if (points.criteria_characteristic == 'Exportation Report') {
                criterium = Drupal.t('You will accumulate points for reporting an exportation on the platform in the dashboard of companies with interaction.');
              }
              else {
                criterium = points.criteria_characteristic;
              }
              html2 += `
              <div class="body-item-list">
                <p>${criterium}</p>
                <p class="last">+ ${points.given_points} ${Drupal.t('points')}</p>
              </div>
            `
            }
          });
          $('#how-get-points').html(html2);
        }
      })
      .catch(error => console.log('error', error));

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
        if (code == 'No code') {
          console.log('NO CODE');            //create the reference code
          var formData = new FormData();
          createReferenceCode();
        } else {
          console.log('IT HAS CODE');
          //asign val code to input
          $('#reference-code').val(code);
          console.log(code);
          $('#codeModal').modal('show');
        }
      }
      )
      .catch(error => console.log('error', error));
  }

  function createReferenceCode() {
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

        if (url.includes("dashboard/col/user/incentives")) {
          $("#how-get-points-close", context).click(function () {
            showHowGetPoints();
          });
          $("#how-get-points-open", context).click(function () {
            showHowGetPoints();
          });
          $('#create-reference-code').click(function () {
            getReferenceCode();
          });
        }
      }

      //openCodeModal
      $('#openCodeModal').click(function () {
        createReferenceCode();
      });
      //if click in button copy reference code
      $('#copy-reference-code').click(function () {
        //copy to clipboard with jquery
        let text = $('#reference-code').val();
        navigator.clipboard.writeText(text).then(function () {
          console.log('Async: Copying to clipboard was successful!');
          $('#your-code').hide()
          $('#success-code').show();
        }, function (err) {
          console.error('Async: Could not copy text: ', err);
        });
      });

      //open howGetPoints
      $('#how-get-points-open').click(function () {
        $('#how-get-points').show();
      });
    }
  }
}(jQuery, Drupal));
