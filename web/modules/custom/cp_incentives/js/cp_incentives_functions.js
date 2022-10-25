// /*
//  * Service to create a new point for an user.
//  */
// (function ($ ,Drupal) {
//   'use strict';

//   /**
//    * 
//    * @param {*} id_incentives_criteria 
//    * @param {*} entity_id_company_col 
//    * @param {*} entity_id_buyer 
//    * @param {*} points 
//    * @param {*} expiration_days 
//    */
//   function createPoint(id_incentives_criteria, entity_id_company_col, entity_id_buyer, points, expiration_days){
//     // var data = {
//     //   id_incentives_criteria: id_incentives_criteria,
//     //   entity_id_company_col: entity_id_company_col,
//     //   entity_id_buyer: entity_id_buyer,
//     //   points: points,
//     //   expiration_days: expiration_days
//     // };
//     var formData = new FormData();
//     formData.append("id_incentives_criteria", id_incentives_criteria);
//     formData.append("entity_id_company_col", entity_id_company_col);
//     formData.append("entity_id_buyer", entity_id_buyer);
//     formData.append("points", points);
//     formData.append("expiration_days", expiration_days);
    
//     fetch("/functions/create-points", {
//         method: "POST",
//         body: formData,
//     })
//       .then(function (response) {
//       console.log(formData);
//       localStorage.setItem("id_incentives_criteria", id_incentives_criteria);
//       localStorage.setItem("entity_id_company_col", entity_id_company_col);
//       localStorage.setItem("entity_id_buyer", entity_id_buyer);
//       localStorage.setItem("points", points);
//       localStorage.setItem("expiration_days", expiration_days);
//       return response.json();
//       })
//         .catch(function (error) {
//         // Display flex for alert-message-layout.
//         $('#alert-message-layout').css('display', 'flex');
//         // Show the button.
//         $('#error-button').show();
//         // Change button text.
//         $('#error-button').text(Drupal.t('Contact Support'));
//         // Animation for alert-message-layout.
//         $("#alert-message-layout").css("animation-name", "fadeInUpBig");
//         // Change text of alert-message-layout tittle.
//         $('#error-tittle').text(Drupal.t('Unexpected error'));
//         // Change text of lert-message-layout message.
//         $('#desc-error').text(Drupal.t("Failed while creating a new point for a Colombian Company. Please try again later or contact support."));
//       });
//   };
  
//     Drupal.behaviors.cp_incentives = {
//       attach: function (context, settings) {
//         if (context == document) {
//           console.log("ENTRO")
//           //check if path is messages
//             var url = window.location.href;
//             if(url.includes("dashboard/col/user/incentives")){
//               $("#create-points", context).click(function () {
//                 createPoint(1, 1, 0, 10, 60);
//               });
//           }
//         };
//       }
//     }
// }(jQuery, Drupal));