
/*
 * Service for cp_messages_sidebar
 */
(function ($, Drupal) {
    'use strict';
    //globals
    var chat_selected = false;
    let last_id_message;
    var id_me = -1;
    var id_other_user = -1;
    var socket;
    var last_date = ''
    var new_messages = 0;
    var offset = 0;
    var length_fetch_message = 0;

    const showDateOrTimeMsg = (date) => {
        let today = moment().format('YYYY-MM-DD');
        let msgDate = moment(date).format('YYYY-MM-DD');
        if (today == msgDate) {
            return moment(date).format('hh:mm A');
        } else {
            return moment(date).format('DD/MM/YYYY hh:mm A');
        }
    }

    //request for get chat messages
    const fetchChatMessages = (chatId, offset, limit, refetch = false) => {
        var formdata = new FormData();
        formdata.append("id_chat", chatId);
        formdata.append("offset", offset);
        formdata.append("limit", limit);

        var requestOptions = {
            method: 'POST',
            body: formdata,
        };

        fetch("/chat/get_chat_messages", requestOptions)
            .then(response => response.json())
            .then((result) => {
                let msgList = result.data;
                length_fetch_message = msgList.length;
                CheckMessages(chatId);
                callGetListOfChats(0, 15);
                if (!refetch) {
                    renderChatMessages(msgList);
                    //scroll to bottom
                    var objDiv = document.getElementById("message-content-window");
                    objDiv.scrollTop = objDiv.scrollHeight;
                } else {
                    addRenderChatMessages(msgList);
                }
            })
            .catch(error => console.log('error', error));
    }

    //request for checked messages
    const CheckMessages = (chatId) => {
        var formdata = new FormData();
        formdata.append("id_chat", chatId);
        formdata.append("id_other_user", id_other_user);

        var requestOptions = {
            method: 'POST',
            body: formdata,
        };

        fetch("/chat/checked_messages", requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log("checked messages", result);
                new_messages = 0;
            })
            .catch(error => console.log('error', error));
    }

    //render chat messages
    const renderChatMessages = (msgList) => {
        let html = '';
        msgList.forEach((msg) => {
            if (last_date != moment(msg.updated).format("DD MMMM YYYY")) {
                html += `
        <li><div class="chat-day-title"><span class="title">${moment().format("DD MMMM YYYY") == moment(msg.updated).format("DD MMMM YYYY") ? 'Hoy' : moment(msg.updated).format("DD MMMM YYYY")}</span></div></li>
        `
            }
            if (msg.is_me) {
                html += `
        <li class="right">
          <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />
                `
                        :
                        `<div class="avatar-xs">
                  <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
                </div>`
                    }
            </div>

            <div class="user-chat-content">
              <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                  <div class="conversation-name">${msg.company_name} </div>
                  <p class="mb-0 text-msg-user">${msg.message}</p>
                  <p class="chat-time mb-0">
                    <i class='bx bx-time-five'></i>
                    <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
       </li>
        `
            } else {
                html += `
        <li class="">
          <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />`
                        :
                        `<div class="avatar-xs">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
             </div>`
                    }
            </div>

            <div class="user-chat-content">
              <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                  <div class="conversation-name">${msg.company_name}</div>
                  <p class="mb-0">${msg.message}</p>
                  <p class="chat-time mb-0">
                    <i class='bx bx-time-five'></i>
                    <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
       </li>
        `
            }
            last_date = moment(msg.updated).format("DD MMMM YYYY");
        });

        $('#chat-messages-window').html(html);
    }

    //add render chat messages when refetch
    const addRenderChatMessages = (msgList) => {
        let html = '';
        msgList.forEach((msg) => {
            if (last_date != moment(msg.updated).format("DD MMMM YYYY")) {
                html += `
        <li><div class="chat-day-title"><span class="title">${moment().format("DD MMMM YYYY") == moment(msg.updated).format("DD MMMM YYYY") ? 'Hoy' : moment(msg.updated).format("DD MMMM YYYY")}</span></div></li>
        `
            }
            if (msg.is_me) {
                html += `
        <li class="right">
          <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />
                `
                        :
                        `<div class="avatar-xs">
                  <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
                </div>`
                    }
            </div>

            <div class="user-chat-content">
              <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                  <div class="conversation-name">${msg.company_name} </div>
                  <p class="mb-0 text-msg-user">${msg.message}</p>
                  <p class="chat-time mb-0">
                    <i class='bx bx-time-five'></i>
                    <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
       </li>
        `
            } else {
                html += `
        <li class="">
          <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />`
                        :
                        `<div class="avatar-xs">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
             </div>`
                    }
            </div>

            <div class="user-chat-content">
              <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                  <div class="conversation-name">${msg.company_name}</div>
                  <p class="mb-0">${msg.message}</p>
                  <p class="chat-time mb-0">
                    <i class='bx bx-time-five'></i>
                    <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
       </li>
        `
            }
            last_date = moment(msg.updated).format("DD MMMM YYYY");
        });
        if ($("last-render-window").length == 0) {
            html += `<div id="last-render-window"></div>`;
        } else {
            $("#last-render-window").remove();
            html += `<div id="last-render-window"></div>`;
        }
        //put new html before old html
        $('#chat-messages-window').prepend(html);
        //scroll to #last-render element without animation
        $('#message-content-window').animate({
            scrollTop: $("#last-render-window").offset().top - 250
        }, 0);
    }

    //infitine scroll for list messages in chat
    $('#message-content-window').scroll(function () {
        if (length_fetch_message > 0) {
            if ($(this).scrollTop() == 0) {
                offset += 30;
                fetchChatMessages(chat_selected, offset, 30, true);
            }
        }
    });

    //request for send message
    const sendMessage = () => {
        //get val of input message

        let msg = $('#text-message-window').val();
        if (msg.length > 0) {
            var formdata = new FormData();
            formdata.append("id_chat", chat_selected);
            formdata.append("message", msg);
            formdata.append("files", []);

            var requestOptions = {
                method: 'POST',
                body: formdata,
            };

            fetch("/chat/create_message", requestOptions)
                .then(response => response.json())
                .then((result) => {
                    if (result.status == 'ok') {
                        console.log(result);
                        //remove value of input
                        $('#text-message-window').val('');
                        socket.emit('sendMessage', { room: chat_selected, message: result.data });
                        console.log({ user_id: id_other_user, message: result.data })
                        CheckMessages(result.data[0].id_chat);
                        callGetListOfChats(0, 15);
                        socket.emit('updateChatList', { user_id: id_other_user, message: result.data });
                        console.log("ENVIADO")
                        new_messages = 0;
                        $('#new-message-content-window').html('');
                    } else {
                        console.log(result);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    // **********************
    // *** Call functions ***
    // **********************
    Drupal.behaviors.cp_chat_window = {
        attach: function (context, settings) {
            //init 
            if (context == document) {
                console.log("ENTROOOOOOOOOOOOOOOOOO")
                socket = io('ws://44.210.73.93:5055');
                new EmojiPicker({
                    trigger: [
                        {
                            selector: '.emoji-selector',
                            insertInto: ['.text-message'],
                        }
                    ],
                });
            }

            //create function get chat messages
            window.getChatMessagesSideBar = (chatId, idOtherUser, fullName, description, companyName, companyLogo, idMe) => {
                //show chat box
                //init emoji
                
                $('#chat-window-modal').show();
                $('#right_messages').hide();

                //disconnect socket to room
                socket.emit('disconnectRoom', { room: chat_selected });
                fetchChatMessages(chatId, 0, 30);
                chat_selected = chatId;
                id_other_user = idOtherUser;
                id_me = idMe;
                //set text fullName in the id 
                $('#chat-company-name-window').text(companyName);
                $('#chat-user-name-window').text(fullName);
                $('#chat-user-description-window').text(description);

                //check if company logo exist
                console.log(companyLogo);
                if (companyLogo) {
                    $('#chat-company-logo-window').html(
                        `<img src="${companyLogo}" class="rounded-circle avatar-sm" alt="" />
            <span id="chat-user-status-window" class="user-status"></span>
            `
                    );
                } else {
                    $('#chat-company-logo-window').html(
                        `<div class="avatar-sm ">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${companyName.charAt(0)}</span>
              <span id="chat-user-status-window"  class="user-status"></span>
            </div>`
                    );
                }

                socket.emit('createRoom', { room: chatId, user_id: id_me });
                socket.on('userOnline', function (users) {
                    console.log(users);
                    if (users == 2) {
                        $('#chat-user-status-window').css('background', 'green');
                    } else {
                        $('#chat-user-status-window').css('background', 'red');
                    }
                });
            }

            //send message on click send
            $('#send-window', context).click(function () {
                sendMessage();
            });

            //if text-message is not empty, send message on enter
            $('#text-message-window', context).keypress(function (e) {
                if (e.which == 13) {
                    sendMessage();
                }
            });

            //receive message from the room
            socket.on('message', function (data) {
                if ($(`#typing-${id_other_user}-window`).length > 0) {
                    console.log('typing');
                    $(`#typing-${id_other_user}-window`).remove();
                }
                let msg = data.message[0];
                console.log(last_id_message);
                if (last_id_message != msg.id) {
                    last_id_message = data.id;
                    if (last_date != moment(msg.updated).format("DD MMMM YYYY")) {
                        $('#chat-messages-window').append(`
            <li><div class="chat-day-title"><span class="title">${moment().format("DD MMMM YYYY") == moment(msg.updated).format("DD MMMM YYYY") ? 'Hoy' : moment(msg.updated).format("DD MMMM YYYY")
                            }</span></div></li>
            `);
                        last_date = moment(msg.updated).format("DD MMMM YYYY");
                    }
                    if (id_other_user != msg.entity_id_sender) {
                        $('#chat-messages-window').append(`
            <li class="right">
              <div class="conversation-list">
                <div class="chat-avatar">
                ${msg.company_logo ? `
                  <img
                    src="${msg.company_logo}"
                    class="rounded-circle avatar-xs" alt="" />`
                                :
                                `<div class="avatar-xs">
                      <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg.company_name.charAt(0)}</span>
                    </div>`
                            }
                </div>

                <div class="user-chat-content">
                  <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                      <div class="conversation-name">${msg.company_name} </div>
                      <p class="mb-0">${msg.message}</p>
                      <p class="chat-time mb-0">
                        <i class='bx bx-time-five'></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </li>
          `);
                        var objDiv = document.getElementById("message-content-window");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    } else {
                        console.log('entro');
                        console.log(msg);
                        if (!msg.checked) {
                            new_messages += 1;
                            console.log(new_messages);
                            if ($('#new-messages-chat-window').length === 0) {
                                $('#chat-messages-window').append(`
                <li id="new-message-content-window"><div class="chat-day-title new-message-chat" ><span class="title" id="new-messages-chat-window">${new_messages + " Mensaje Nuevo"
                                    }</span></div></li>
                `);
                            } else {
                                $('#new-messages-chat-window').text(new_messages + " Mensajes Nuevos");
                            }
                        }
                        $('#chat-messages-window').append(`
            <li class="">
              <div class="conversation-list">
                <div class="chat-avatar">
                ${msg.company_logo ? `
                  <img
                    src="${msg.company_logo}"
                    class="rounded-circle avatar-xs" alt="" />
                    `
                                :
                                `<div class="avatar-xs">
                      <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg.company_name.charAt(0)}</span>
                    </div>`
                            }
                </div>

                <div class="user-chat-content">
                  <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                      <div class="conversation-name">${msg.company_name}</div>
                      <p class="mb-0">${msg.message}</p>
                      <p class="chat-time mb-0">
                        <i class='bx bx-time-five'></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                      </p>
                    </div>

                  </div>
                </div>
              </div>
          </li>
          `);
                        //Detect if scroll is at the bottom
                        var objDiv = document.getElementById("message-content-window");
                        if (objDiv.scrollHeight - objDiv.scrollTop - 100 <= objDiv.clientHeight) {
                            objDiv.scrollTop = objDiv.scrollHeight;
                        }
                    }
                }
                last_id_message = msg.id;
            })

            //detect if text-message is typing
            $('#text-message-window', context).on('input', function () {
                if (this.value.length > 0) {
                    console.log("typing");
                    socket.emit('typing', { room: chat_selected, typing: true, id_send: id_me });
                    socket.emit('typingChatList', { typing: true, user_id: id_me, id_other_user: id_other_user });
                } else {
                    console.log("no typing");
                    socket.emit('typing', { room: chat_selected, typing: false, id_send: id_me });
                    socket.emit('typingChatList', { typing: false, user_id: id_me, id_other_user: id_other_user });
                }
            });

            //receive typing
            socket.on('typing', function (data) {
                if (data.typing == true && id_other_user == data.id_send) {
                    console.log("typing socket");
                    if ($(`#typing-${data.id_send}-window`).length == 0) {
                        $('#chat-messages-window').append(
                            `
                <li class="typing-chat"  id="typing-${data.id_send}-window">
                  <div class="conversation-list">
                      <div class="user-chat-content">
                          <div class="ctext-wrap">
                              <div class="ctext-wrap-content">
                                  <p class="mb-0">
                                      Escribiendo<span class="animate-typing"><span class="dot ms-1"></span><span class="dot ms-1"></span><span class="dot ms-1"></span></span>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </li>
              `
                        );
                        //Detect if scroll is at the bottom
                        var objDiv = document.getElementById("message-content-window");
                        console.log(objDiv.scrollHeight - objDiv.scrollTop - 150);
                        console.log(objDiv.clientHeight);
                        if (objDiv.scrollHeight - objDiv.scrollTop - 150 <= objDiv.clientHeight) {
                            objDiv.scrollTop = objDiv.scrollHeight
                        }
                    }
                } else {
                    console.log("no typing socket");
                    if ($(`#typing-${data.id_send}-window`).length > 0) {
                        //remove id 
                        $(`#typing-${data.id_send}-window`).remove();
                    }
                }
            });

            //hide chat
            $('#close-window', context).click(function () {
                $('#chat-window-modal').hide();
            });
        }
    };

}(jQuery, Drupal));