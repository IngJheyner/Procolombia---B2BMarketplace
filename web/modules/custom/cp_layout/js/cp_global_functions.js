(function ($, Drupal) {
    const createOrOpenChat = (id_exportador) => {
        if (id_exportador) {
            let formData = new FormData();
            formData.append('entity_id_exportador', id_exportador);
            fetch('/chat/create_chat_room',
                {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.status == 'error') {
                        //open modal
                        $('#valid-login-msg').modal('show');
                        $('#nombre-empresa-modal-validate').text(data.company_name);
                    } else {
                        if (data.status === 'ok') {
                            let values = data.result_chat;
                            getChatMessagesSideBar(values.id, values.id_other_user, values.first_name + " " + values.last_name, values.description, values.company_name, values.company_logo, values.id_me);
                        } else {
                            let values = data.result_chat;
                            getChatMessagesSideBar(values.id, values.id_other_user, values.first_name + " " + values.last_name, values.description, values.company_name, values.company_logo, values.id_me);
                        }
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
                    $('#desc-error').text(Drupal.t("Error while opening chat, please try again later or contact support."));
                });
        }
    }
      // when click on close button change animation 

      
     
    Drupal.behaviors.cp_global_functions = {
        attach: function (context, settings) {
            //global functions
            window.createChat = (id_exportador) => {
                createOrOpenChat(id_exportador);
            }
        }
    };
}
    (jQuery, Drupal));