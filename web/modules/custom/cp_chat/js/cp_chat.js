
/*
 * Service for Check NIT
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
  function init() {
    getListOfChats(0, 15);

    //init emoji
    new EmojiPicker({
      trigger: [
        {
          selector: '.emoji-selector',
          insertInto: ['.text-message'],
        }
      ],
    });
  }

  const getListOfChats = (offset, limit) => {
    var formdata = new FormData();
    formdata.append("offset", offset);
    formdata.append("limit", limit);

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    fetch("/chat/get_chat_rooms", requestOptions)
      .then(response => response.json())
      .then((result) => {
        let chatList = result.data;
        if (chatList.length > 0) {
          console.log(chatList[0])
          id_me = chatList[0].id_me;
          id_other_user = chatList[0].id_other_user;
        }
        socket.emit('createChatList', { user_id: id_me });
        renderChatList(chatList);
      })
      .catch(error => console.log('error', error));
  }

  //check with moment is date is today show time
  //if not show date
  const showDateOrTime = (date) => {
    let today = moment().format('YYYY-MM-DD');
    let msgDate = moment(date).format('YYYY-MM-DD');
    if (today == msgDate) {
      return moment(date).format('hh:mm A');
    } else {
      //from now in spanish
      return moment(date).fromNow();
    }
  }

  const showDateOrTimeMsg = (date) => {
    let today = moment().format('YYYY-MM-DD');
    let msgDate = moment(date).format('YYYY-MM-DD');
    if (today == msgDate) {
      return moment(date).format('hh:mm A');
    } else {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    }
  }


  const renderChatList = (chatList) => {
    let html = '';
    let countNewMessages = 0;
    chatList.forEach((chat) => {
      html += `
      <li id="conversation0" class="" onclick="getChatMessages(${chat.id}, ${chat.id_other_user}, '${chat.first_name + " " + chat.last_name}' ,'${chat.description}', '${chat.company_name}', ${chat?.company_logo ? "'" + chat?.company_logo + "'" : 'null'}, ${chat.id_me} )">
        <div class="d-flex" id="chat">
          <div class="chat-user-img online align-self-center me-3 ms-0">
          ${chat.company_logo ? `
            <img
              src="${chat.company_logo}"
              class="rounded-circle avatar-sm" alt="" />
              `
          :
          `<div class="avatar-sm">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${chat.company_name.charAt(0)}</span>
            </div>`
        }
          </div>
          <div class="flex-grow-1 overflow-hidden text-msg">
            <h5 class="text-truncate mb-1">${chat.company_name}</h5>
            <span class="chat-user-name text-truncate mb-0"><strong>Nombre del contacto:</strong><p class="name"> ${chat.first_name + " " + chat.last_name}</p></span>
            <p class="chat-user-message text-truncate mb-0" id="last_message_chat_list-${id_other_user}">${chat.last_message.length > 0 ? chat.last_message[0].message : 'Nuevo Chat'}</p>
            <p class="chat-user-message text-truncate mb-0 list-tipyn" style="display:none" id="typingChat-${id_other_user}">Escribiendo<span class="animate-typing"><span class="dot ms-1"></span><span class="dot ms-1"></span><span class="dot ms-1"></span></span></p>
          </div>
          <div class="time text-truncate"><span> ${showDateOrTime(chat.updated)}</span></div>
           <div class="mt-2 unread-message" style="background-color: trasnparent;border-radius:100px;display: flex;align-items: center;" id="unRead1">
           <span class="badge text-white bg-danger rounded-pill" style="font-size: 11px;padding: 6px 7px;line-height: inherit !important;display: ${chat.count_checked > 0 ? "flex" : "none"};align-items: center;">${chat.count_checked}</span>
           <span class="badge text-muted rounded-pill" style="font-size: 1.3rem;padding:4px;">
              <i class="bx bx-dots-horizontal-rounded"></i>
            </span>
           </div>
          </div>
      </li>
      `
      countNewMessages += parseInt(chat.count_checked);
    });

    if (countNewMessages > 0) {
      $('#count-message').text(countNewMessages);
      $('#count-message').show(countNewMessages);
    } else {
      $('#count-message').hide(countNewMessages);
    }
    $('#chat-list').html(html);
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
        getListOfChats(0, 15);
        if (!refetch) {
          renderChatMessages(msgList);
          //scroll to bottom
          var objDiv = document.getElementById("message-content");
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

    $('#chat-messages').html(html);
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
    if ($("last-render").length == 0) {
      html += `<div id="last-render"></div>`;
    } else {
      $("#last-render").remove();
      html += `<div id="last-render"></div>`;
    }
    //put new html before old html
    $('#chat-messages').prepend(html);
    //scroll to #last-render element without animation
    $('#message-content').animate({
      scrollTop: $("#last-render").offset().top - 250
    }, 0);
  }

  //request for send message
  const sendMessage = () => {
    //get val of input message

    let msg = $('#text-message').val();
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
            $('#text-message').val('');
            socket.emit('sendMessage', { room: chat_selected, message: result.data });
            console.log({ user_id: id_other_user, message: result.data })
            CheckMessages(result.data[0].id_chat);
            getListOfChats(0, 15);
            socket.emit('updateChatList', { user_id: id_other_user, message: result.data });
            console.log("ENVIADO")
            new_messages = 0;
            $('#new-message-content').html('');
          } else {
            console.log(result);
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  //infitine scroll for list messages in chat
  $('#message-content').scroll(function () {
    if (length_fetch_message > 0) {
      if ($(this).scrollTop() == 0) {
        offset += 30;
        fetchChatMessages(chat_selected, offset, 30, true);
      }
    }
  });

  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_chat = {
    attach: function (context, settings) {
      //init 
      if (context == document) {
        console.log("ENTRO")
        //check if path is messages
        if (window.location.pathname.includes('messages')) {
          init();
        }
        socket = io('ws://44.210.73.93:5055');
      }
      //create function get chat messages
      window.getChatMessages = (chatId, idOtherUser, fullName, description, companyName, companyLogo, idMe) => {
        //show chat box
        $('#chat-fill').show();
        $('#chat-empty').hide();

        //disconnect socket to room
        socket.emit('disconnectRoom', { room: chat_selected });
        fetchChatMessages(chatId, 0, 30);
        chat_selected = chatId;
        id_other_user = idOtherUser;
        id_me = idMe;
        //set text fullName in the id 
        $('#chat-company-name').text(companyName);
        $('#chat-user-name').text(fullName);
        $('#chat-user-description').text(description);

        //check if company logo exist
        console.log(companyLogo);
        if (companyLogo) {
          $('#chat-company-logo').html(
            `<img src="${companyLogo}" class="rounded-circle avatar-sm" alt="" />
            <span id="chat-user-status" class="user-status"></span>
            `
          );
        } else {
          $('#chat-company-logo').html(
            `<div class="avatar-sm ">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${companyName.charAt(0)}</span>
              <span id="chat-user-status"  class="user-status"></span>
            </div>`
          );
        }

        socket.emit('createRoom', { room: chatId, user_id: id_me });
        socket.on('userOnline', function (users) {
          console.log(users);
          if (users == 2) {
            $('#chat-user-status').css('background', 'green');
          } else {
            $('#chat-user-status').css('background', 'red');
          }
        });
      }

      //send message on click send
      $('#send', context).click(function () {
        sendMessage();
      });

      //if text-message is not empty, send message on enter
      $('#text-message', context).keypress(function (e) {
        if (e.which == 13) {
          sendMessage();
        }
      });

      //receive message from the room
      socket.on('message', function (data) {
        if ($(`#typing-${id_other_user}`).length > 0) {
          console.log('typing');
          $(`#typing-${id_other_user}`).remove();
        }
        let msg = data.message[0];
        console.log(last_id_message);
        if (last_id_message != msg.id) {
          last_id_message = data.id;
          if (last_date != moment(msg.updated).format("DD MMMM YYYY")) {
            $('#chat-messages').append(`
            <li><div class="chat-day-title"><span class="title">${moment().format("DD MMMM YYYY") == moment(msg.updated).format("DD MMMM YYYY") ? 'Hoy' : moment(msg.updated).format("DD MMMM YYYY")
              }</span></div></li>
            `);
            last_date = moment(msg.updated).format("DD MMMM YYYY");
          }
          if (id_other_user != msg.entity_id_sender) {
            $('#chat-messages').append(`
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
            var objDiv = document.getElementById("message-content");
            objDiv.scrollTop = objDiv.scrollHeight;
          } else {
            console.log('entro');
            console.log(msg);
            if (!msg.checked) {
              new_messages += 1;
              console.log(new_messages);
              if ($('#new-messages-chat').length === 0) {
                $('#chat-messages').append(`
                <li id="new-message-content"><div class="chat-day-title new-message-chat" ><span class="title" id="new-messages-chat">${new_messages + " Mensaje Nuevo"
                  }</span></div></li>
                `);
              } else {
                $('#new-messages-chat').text(new_messages + " Mensajes Nuevos");
              }
            }
            $('#chat-messages').append(`
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
            var objDiv = document.getElementById("message-content");
            if (objDiv.scrollHeight - objDiv.scrollTop - 100 <= objDiv.clientHeight) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          }
        }
        last_id_message = msg.id;
      })

      //detect if text-message is typing
      $('#text-message', context).on('input', function () {
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
          if ($(`#typing-${data.id_send}`).length == 0) {
            $('#chat-messages').append(
              `
                <li class="typing-chat"  id="typing-${data.id_send}">
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
            var objDiv = document.getElementById("message-content");
            console.log(objDiv.scrollHeight - objDiv.scrollTop - 150);
            console.log(objDiv.clientHeight);
            if (objDiv.scrollHeight - objDiv.scrollTop - 150 <= objDiv.clientHeight) {
              objDiv.scrollTop = objDiv.scrollHeight
            }
          }
        } else {
          console.log("no typing socket");
          if ($(`#typing-${data.id_send}`).length > 0) {
            //remove id 
            $(`#typing-${data.id_send}`).remove();
          }
        }
      });

      //receive typingChat
      socket.on('typingChat', function (data) {
        console.log("typing socket chat");
        console.log(data);
        if (data.typing == true) {
          console.log(`#last_message_chat_list-${data.user_id}`);
          $(`#typingChat-${data.user_id}`).show();
          $(`#last_message_chat_list-${data.user_id}`).hide();
        } else {
          $(`#typingChat-${data.user_id}`).hide();
          $(`#last_message_chat_list-${data.user_id}`).show();
        }
      });

      //receive refreshChatList
      socket.on('refreshChatList', function (data) {
        let msg = data.message[0];
        if (msg.entity_id_sender != id_me) {
          console.log("refreshChatList");
          console.log(data);
          getListOfChats(0, 15);
        }
      });

      //joinChatList
      /*socket.on('joinChatList', function (data) {
        console.log("joinChatList");
        console.log(data);
      });*/

      //hide chat
      $('#hide-chat', context).click(function () {
        $('#chat-fill').hide();
        $('#chat-empty').show();
        socket.emit('disconnectRoom', { room: chat_selected });
      });
    }
  };

}(jQuery, Drupal));