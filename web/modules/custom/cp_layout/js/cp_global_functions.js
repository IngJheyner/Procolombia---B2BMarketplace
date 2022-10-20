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
                }).catch(error => {
                    console.log(error);
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