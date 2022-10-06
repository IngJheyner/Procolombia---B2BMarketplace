/*
 * Service for cp_contact
 */
(function ($, Drupal) {

  const createOrOpenChat = () => {
    //check if id_exportador is set
    let id_exportador = $('#id_exportador').val()
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
          } else {
            if (data.status === 'ok') {
              let values = data.result_chat;
              getChatMessagesSideBar(values.id, values.id_other_user, values.first_name + " " + values.last_name, values.description, values.company_name, values.company_logo, values.id_me);
            } else {
              let values = data.result_chat;
              getChatMessagesSideBar(values.id, values.id_other_user, values.first_name + " " + values.last_name, values.description, values.company_name, values.company_logo, values.id_me);
            }
          }
        }).catch(error => {
          console.log(error);
        });
    }
  }

  Drupal.behaviors.cp_contact = {
    attach: function (context, settings) {
      //when click contact-button
      $('#contact-button', context).click(function () {
        console.log("CLICK")
        createOrOpenChat();
      });
    }
  };
}(jQuery, Drupal));