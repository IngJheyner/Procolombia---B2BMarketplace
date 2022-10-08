
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
  var first_date = '';
  var new_messages = 0;
  var offset = 0;
  var length_fetch_message = 0;
  // 0 = 'All', 1 = 'Unread', 2 = 'Read', 3 = 'Deleted'
  var filter_type = 0;
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

    switch (filter_type) {
      case 1:
        formdata.append("unread", true);
        break;
      case 2:
        formdata.append("read", true);
        break;
      case 3:
        formdata.append("deleted", true);
        break;
    }

    //get val of input search message and append to formdata
    let search_message = $('#search-message').val();
    if (search_message) {
      formdata.append("message", search_message);
    }

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
      <li id="conversation0" class="">
        <div class="d-flex" id="chat">
          <div class="chat-user-img online align-self-center me-3 ms-0" onclick="getChatMessages(${chat.id}, ${chat.id_other_user}, '${chat.first_name + " " + chat.last_name}' ,'${chat.description}', '${chat.company_name}', ${chat?.company_logo ? "'" + chat?.company_logo + "'" : 'null'}, ${chat.id_me} )">
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
          <div class="flex-grow-1 overflow-hidden text-msg" onclick="getChatMessages(${chat.id}, ${chat.id_other_user}, '${chat.first_name + " " + chat.last_name}' ,'${chat.description}', '${chat.company_name}', ${chat?.company_logo ? "'" + chat?.company_logo + "'" : 'null'}, ${chat.id_me} )">
            <h5 class="text-truncate mb-1">${chat.company_name}</h5>
            <span class="chat-user-name text-truncate mb-0"><strong>Nombre del contacto:</strong><p class="name"> ${chat.first_name + " " + chat.last_name}</p></span>
            <p class="chat-user-message text-truncate mb-0" id="last_message_chat_list-${id_other_user}">${chat.last_message.length > 0 ? chat.last_message[0].message : 'Nuevo Chat'}</p>
            <p class="chat-user-message text-truncate mb-0 list-tipyn" style="display:none" id="typingChat-${id_other_user}">Escribiendo<span class="animate-typing"><span class="dot ms-1"></span><span class="dot ms-1"></span><span class="dot ms-1"></span></span></p>
          </div>
          <div class="time text-truncate"><span> ${showDateOrTime(chat.updated)}</span></div>
           <div class="mt-2 unread-message" style="background-color: trasnparent;border-radius:100px;display: flex;align-items: center;" id="unRead1">
           <span class="badge text-white bg-danger rounded-pill" style="font-size: 11px;padding: 6px 7px;line-height: inherit !important;display: ${chat.count_checked > 0 ? "flex" : "none"};align-items: center;">${chat.count_checked}</span>
           <span class="badge text-muted rounded-pill" style="font-size: 1.3rem;padding:4px;">
              <div class="align-self-start dropdown show">
                  <a onclick="showDropdownList(${chat.id})" aria-haspopup="true" class="dropdown-list" aria-expanded="true">
                  <i class="bx bx-dots-horizontal-rounded"></i>
                  </a>
                  <div tabindex="-1" id="dropdown-list-${chat.id}" role="menu" aria-hidden="false" class="dropdown-menu" style="position: absolute;will-change: transform;top: 16px;min-width: 28px;left: -70px;" x-placement="top-start">
                    <button onclick="deleteChat(${chat.id}, '${chat.first_name + " " + chat.last_name}', '${chat.company_name}')"  type="button" tabindex="0" role="menuitem" class="dropdown-item">Eliminar <i class='bx bx-trash'></i></button>
                  </div>
              </div>
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
        //get firts date
        if (msgList.length > 0) {
          first_date = moment(msgList[0].updated).format('YYYY-MM-DD');
        }
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
      console.log("msg", msg);
      if (msg.files) {
        //get properties of file in url
        let name = msg.files.split("/").pop();
        let extension = name.split(".").pop();

        let icon = '';
        //check if is image
        if (extension == 'doc' || extension == 'docx' || extension == 'pdf' || extension == 'xls' || extension == 'xlsx' || extension == 'ppt' || extension == 'pptx' || extension == 'txt' || extension == 'csv') {
          //change icon 
          icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #fff; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>';
        } else {
          if (extension == 'zip' || extension == 'rar') {
            icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>';
          } else {
            icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>';
          }
        }

        if (msg.is_me) {
          html += `
       <li class="right">
        <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />`
              :
              `<div class="avatar-xs">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
             </div>
             `
            }
            </div>
            ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  
              <div class="ctext-wrap-content">
              <div class="conversation-name">${msg.company_name}</div>
                  <ul class="list-inline message-img mb-0">
                      <li class="list-inline-item message-img-list">
                        <div>
                            <img src="${msg.files}" alt="chat" class="rounded border">
                        </div>
                      </li>
                     
                  </ul>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                    </p>
                  </div>
                    </div>
                  </div>
              </div>
            </li>
            `
              :
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                    <div class="conversation-name">${msg.company_name}</div>
                    <div class="p-2 mb-2 card">
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-3 ms-0">
                              <div class="avatar-title bg-soft-primary text-primary rounded ">
                                  ${icon}
                              </div>
                          </div>
                          <div class="flex-grow-1">
                              <div class="text-start">
                                <h5 class="text-break mb-1">
                                ${name}
                                </h5>
                              </div>
                          </div>
                          <div class="ms-4">
                              <ul class="list-inline mb-0 ">
                                <li class="list-inline-item">
                                <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                </li>
                              </ul>
                          </div>
                        </div>
                    </div>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                    </p>
                  </div>
              </div>
            </div>
        </div>
      </li>
            `}`;
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
             </div>
             `
            }
            </div>
            ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  
              <div class="ctext-wrap-content">
              <div class="conversation-name">${msg.company_name}</div>
                  <ul class="list-inline message-img mb-0">
                      <li class="list-inline-item message-img-list">
                        <div>
                            <img src="${msg.files}" alt="chat" class="rounded border">
                        </div>
                      </li>
                     
                  </ul>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                    </p>
                  </div>
                    </div>
                  </div>
              </div>
            </li>
            `
              :
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                    <div class="conversation-name">${msg.company_name}</div>
                    <div class="p-2 mb-2 card">
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-3 ms-0">
                              <div class="avatar-title bg-soft-primary text-primary rounded ">
                                  ${icon}
                              </div>
                          </div>
                          <div class="flex-grow-1">
                              <div class="text-start">
                                <h5 class="text-break mb-1">
                                ${name}
                                </h5>
                              </div>
                          </div>
                          <div class="ms-4">
                              <ul class="list-inline mb-0 ">
                                <li class="list-inline-item">
                                    <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                </li>
                                </li>
                              </ul>
                          </div>
                        </div>
                    </div>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                    </p>
                  </div>
              </div>
            </div>
        </div>
      </li>
            `}`;
        }
      } else {
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
                <div class="dropdown align-self-start">
                      <a class="dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <i class='bx bx-dots-vertical-rounded' ></i>
                      </a>
                      <div class="dropdown-menu" data-popper-placement="top-start">
                          <a class="dropdown-item" href="#">Eliminar <i class='bx bx-trash' ></i></a>
                      </div>
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
      console.log("msg", msg);
      if (msg.files) {
        //get properties of file in url
        let name = msg.files.split("/").pop();
        let extension = name.split(".").pop();

        let icon = '';
        //check if is image
        if (extension == 'doc' || extension == 'docx' || extension == 'pdf' || extension == 'xls' || extension == 'xlsx' || extension == 'ppt' || extension == 'pptx' || extension == 'txt' || extension == 'csv') {
          //change icon 
          icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #fff; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>';
        } else {
          if (extension == 'zip' || extension == 'rar') {
            icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>';
          } else {
            icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>';
          }
        }

        if (msg.is_me) {
          html += `
       <li class="right">
        <div class="conversation-list">
            <div class="chat-avatar">
            ${msg.company_logo ? `
              <img
                src="${msg.company_logo}"
                class="rounded-circle avatar-xs" alt="" />`
              :
              `<div class="avatar-xs">
              <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
             </div>
             `
            }
            </div>
            ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  
              <div class="ctext-wrap-content">
              <div class="conversation-name">${msg.company_name}</div>
                  <ul class="list-inline message-img mb-0">
                      <li class="list-inline-item message-img-list">
                        <div>
                            <img src="${msg.files}" alt="chat" class="rounded border">
                        </div>
                      </li>
                     
                  </ul>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                    </p>
                  </div>
                    </div>
                  </div>
              </div>
            </li>
            `
              :
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                    <div class="conversation-name">${msg.company_name}</div>
                    <div class="p-2 mb-2 card">
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-3 ms-0">
                              <div class="avatar-title bg-soft-primary text-primary rounded ">
                                  ${icon}
                              </div>
                          </div>
                          <div class="flex-grow-1">
                              <div class="text-start">
                                <h5 class="text-break mb-1">
                                ${name}
                                </h5>
                              </div>
                          </div>
                          <div class="ms-4">
                              <ul class="list-inline mb-0 ">
                                <li class="list-inline-item">
                                <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                </li>
                              </ul>
                          </div>
                        </div>
                    </div>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                    </p>
                  </div>
              </div>
            </div>
        </div>
      </li>
            `}`;
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
             </div>
             `
            }
            </div>
            ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  
              <div class="ctext-wrap-content">
              <div class="conversation-name">${msg.company_name}</div>
                  <ul class="list-inline message-img mb-0">
                      <li class="list-inline-item message-img-list">
                        <div>
                            <img src="${msg.files}" alt="chat" class="rounded border">
                        </div>
                      </li>
                     
                  </ul>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                    </p>
                  </div>
                    </div>
                  </div>
              </div>
            </li>
            `
              :
              `<div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                    <div class="conversation-name">${msg.company_name}</div>
                    <div class="p-2 mb-2 card">
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-3 ms-0">
                              <div class="avatar-title bg-soft-primary text-primary rounded ">
                                  ${icon}
                              </div>
                          </div>
                          <div class="flex-grow-1">
                              <div class="text-start">
                                <h5 class="text-break mb-1">
                                ${name}
                                </h5>
                              </div>
                          </div>
                          <div class="ms-4">
                              <ul class="list-inline mb-0 ">
                                <li class="list-inline-item">
                                    <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                </li>
                                </li>
                              </ul>
                          </div>
                        </div>
                    </div>
                    <p class="mb-0">${msg.message}</p>
                    <p class="chat-time mb-0">
                        <i class="bx bx-time-five"></i>
                        <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                    </p>
                  </div>
              </div>
            </div>
        </div>
      </li>
            `}`;
        }
      } else {
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
                <div class="dropdown align-self-start">
                      <a class="dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <i class='bx bx-dots-vertical-rounded' ></i>
                      </a>
                      <div class="dropdown-menu" data-popper-placement="top-start">
                          <a class="dropdown-item" href="#">Eliminar <i class='bx bx-trash' ></i></a>
                      </div>
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
      //file-message or image-message are not empty send file
      if ($('#file-message').val() != '') {
        formdata.append("files", $('#file-message')[0].files[0]);
      } else {
        if ($('#image-message').val() != '') {
          formdata.append("files", $('#image-message')[0].files[0]);
        } else {
          formdata.append("files", []);
        }
      }

      var requestOptions = {
        method: 'POST',
        body: formdata,
      };

      fetch("/chat/create_message", requestOptions)
        .then(response => response.json())
        .then((result) => {
          if (result.status == 'ok') {
            console.log(result);
            closePreview();
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
            alert("Error");
          }
        })
        .catch(error => alert('error', error));
    }
  }

  let stopComplete = false;
  //infitine scroll for list messages in chat
  $('#message-content').scroll(function () {
    if (length_fetch_message > 0) {
      if ($(this).scrollTop() == 0) {
        offset += 30;
        fetchChatMessages(chat_selected, offset, 30, true);
      }
      stopComplete = false;
    } else {
      if (!stopComplete) {
        //get text of id chat-company-name
        let name = $('#chat-company-name').text();

        let html = `
          <li class="text-center mb-3">
            <div class="">
              <div class="user-chat-content">
                <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                    <p class="mb-0">${first_date}</p>
                    <p class="mb-0" style="color:#005CA4">Contacto con la empresa ${name}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        `
        $('#chat-messages').prepend(html);
        stopComplete = true;
      }
    }
  });

  //get file message
  const getFileMessage = () => {
    //remove image of input
    $('#image-src').val('');
    //get file of input
    let file = $('#file-message').prop('files')[0];
    //get name of file
    let name = file.name;
    $('#message-image').hide();
    $('#messages').hide();
    //get file extension
    let file_extension = name.split('.').pop();
    console.log("file_extension", file_extension);
    //set name of file in input
    $('#file-name').text(name);
    //set extension of file in input
    $('#file-extension').text(file_extension);
    //set size of file in input
    let sizeInKb = file.size / 1024;
    $('#file-size').text(sizeInKb.toFixed(2) + " KB");
    //detect extension if is document, zip and the rest is unknown
    if (file_extension == 'doc' || file_extension == 'docx' || file_extension == 'pdf' || file_extension == 'xls' || file_extension == 'xlsx' || file_extension == 'ppt' || file_extension == 'pptx' || file_extension == 'txt' || file_extension == 'csv') {
      //change icon 
      $('#file-icon').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1"  viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #0085ca; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>');
    } else {
      if (file_extension == 'zip' || file_extension == 'rar') {
        $('#file-icon').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#606266;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>');

      } else {
        $('#file-icon').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#606266;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>');
      }
    }
    $('#message-file').css('display', 'flex');
  }

  //get image and show in preview
  const getImageMessage = () => {
    //get file of input
    $('#file-message').val('');
    let file = $('#image-message').prop('files')[0];
    console.log("file_extension", URL.createObjectURL(file));
    $('#messages').hide();
    $('#message-file').hide();
    $('#message-src').attr('src', URL.createObjectURL(file));
    $('#message-image').css('display', 'flex');
  }
  //close preview
  const closePreview = () => {
    //remove file of input
    $('#file-message').val('');
    //remove image of input
    $('#image-message').val('');
    $('#message-image').hide();
    $('#message-file').hide();
    $('#messages').show();
  }

  const deleteChatApi = (chat_id) => {
    //form data
    let formData = new FormData();
    formData.append('id_chat', chat_id);

    //fetch
    fetch('/chat/delete_chat', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status == 'ok') {
          //hide modal
          socket.emit('updateChatList', { user_id: id_other_user, message: [{ delete_chat: true }] });
          $('#chat-fill').hide();
          $('#chat-empty').show();
          $('#modal-delete').modal('hide');
          //fetch chat
          getListOfChats(0, 15);
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        alert(error);
      });
  }



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
          socket = io('ws://44.210.73.93:5055');
        }
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
        $('#delete-chat-in-message').attr('onclick', `deleteChat(${chatId}, '${fullName}', '${companyName}')`);
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
            if (msg.files) {
              //get properties of file in url
              let name = msg.files.split("/").pop();
              let extension = name.split(".").pop();

              let icon = '';
              //check if is image
              if (extension == 'doc' || extension == 'docx' || extension == 'pdf' || extension == 'xls' || extension == 'xlsx' || extension == 'ppt' || extension == 'pptx' || extension == 'txt' || extension == 'csv') {
                //change icon 
                icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1"  viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #fff; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>';
              } else {
                if (extension == 'zip' || extension == 'rar') {
                  icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>';
                } else {
                  icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>';
                }
              }
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
                     <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
                    </div>
                    `
                }
                   </div>
                   ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
                  `<div class="user-chat-content">
                     <div class="ctext-wrap">
                         
                     <div class="ctext-wrap-content">
                     <div class="conversation-name">${msg.company_name}</div>
                         <ul class="list-inline message-img mb-0">
                             <li class="list-inline-item message-img-list">
                               <div>
                                   <img src="${msg.files}" alt="chat" class="rounded border">
                               </div>
                             </li>
                            
                         </ul>
                           <p class="mb-0">${msg.message}</p>
                           <p class="chat-time mb-0">
                               <i class="bx bx-time-five"></i>
                               <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                           </p>
                         </div>
                           </div>
                         </div>
                     </div>
                   </li>
                   `
                  :
                  `<div class="user-chat-content">
                     <div class="ctext-wrap">
                         <div class="ctext-wrap-content">
                           <div class="conversation-name">${msg.company_name}</div>
                           <div class="p-2 mb-2 card">
                               <div class="d-flex align-items-center">
                                 <div class="avatar-sm me-3 ms-0">
                                     <div class="avatar-title bg-soft-primary text-primary rounded ">
                                         ${icon}
                                     </div>
                                 </div>
                                 <div class="flex-grow-1">
                                     <div class="text-start">
                                       <h5 class="text-break mb-1">
                                       ${name}
                                       </h5>
                                     </div>
                                 </div>
                                 <div class="ms-4">
                                     <ul class="list-inline mb-0 ">
                                       <li class="list-inline-item">
                                       <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                       </li>
                                     </ul>
                                 </div>
                               </div>
                           </div>
                           <p class="mb-0">${msg.message}</p>
                           <p class="chat-time mb-0">
                               <i class="bx bx-time-five"></i>
                               <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                           </p>
                         </div>
                     </div>
                   </div>
               </div>
             </li>
                   `}`);
            } else {
              $('#chat-messages').append(`
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
                      <div class="dropdown align-self-start">
                            <a class="dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <i class='bx bx-dots-vertical-rounded' ></i>
                            </a>
                            <div class="dropdown-menu" data-popper-placement="top-start">
                                <a class="dropdown-item" href="#">Eliminar <i class='bx bx-trash' ></i></a>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
             </li>
              `);
            }
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
            if (msg.files) {
              //get properties of file in url
              let name = msg.files.split("/").pop();
              let extension = name.split(".").pop();

              let icon = '';
              //check if is image
              if (extension == 'doc' || extension == 'docx' || extension == 'pdf' || extension == 'xls' || extension == 'xlsx' || extension == 'ppt' || extension == 'pptx' || extension == 'txt' || extension == 'csv') {
                //change icon 
                icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #fff; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>';
              } else {
                if (extension == 'zip' || extension == 'rar') {
                  icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>';
                } else {
                  icon = '<svg width="30px" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>';
                }
              }
              $('#chat-messages').append(`
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
                 </div>
                 `
                }
                </div>
                ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
                  `<div class="user-chat-content">
                  <div class="ctext-wrap">
                      
                  <div class="ctext-wrap-content">
                  <div class="conversation-name">${msg.company_name}</div>
                      <ul class="list-inline message-img mb-0">
                          <li class="list-inline-item message-img-list">
                            <div>
                                <img src="${msg.files}" alt="chat" class="rounded border">
                            </div>
                          </li>
                         
                      </ul>
                        <p class="mb-0">${msg.message}</p>
                        <p class="chat-time mb-0">
                            <i class="bx bx-time-five"></i>
                            <span class="align-middle">${showDateOrTimeMsg(msg.updated)}</span>
                        </p>
                      </div>
                        </div>
                      </div>
                  </div>
                </li>
                `
                  :
                  `<div class="user-chat-content">
                  <div class="ctext-wrap">
                      <div class="ctext-wrap-content">
                        <div class="conversation-name">${msg.company_name}</div>
                        <div class="p-2 mb-2 card">
                            <div class="d-flex align-items-center">
                              <div class="avatar-sm me-3 ms-0">
                                  <div class="avatar-title bg-soft-primary text-primary rounded ">
                                      ${icon}
                                  </div>
                              </div>
                              <div class="flex-grow-1">
                                  <div class="text-start">
                                    <h5 class="text-break mb-1">
                                    ${name}
                                    </h5>
                                  </div>
                              </div>
                              <div class="ms-4">
                                  <ul class="list-inline mb-0 ">
                                    <li class="list-inline-item">
                                        <a class="text-muted" href="${msg.files}" download><i class='bx bxs-download'></i></a>
                                    </li>
                                    </li>
                                  </ul>
                              </div>
                            </div>
                        </div>
                        <p class="mb-0">${msg.message}</p>
                        <p class="chat-time mb-0">
                            <i class="bx bx-time-five"></i>
                            <span class="align-middle">${showDateOrTimeMsg(msg.updated)}}</span>
                        </p>
                      </div>
                  </div>
                </div>
            </div>
          </li>
                `}`);
            } else {
              $('#chat-messages').append(`
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
              `);
            }
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
        if (msg.delete_chat) {
          getListOfChats(0, 15);
          $('#chat-fill').hide();
          $('#chat-empty').show();
        } else {
          if (msg.entity_id_sender != id_me) {
            console.log("refreshChatList");
            console.log(data);
            getListOfChats(0, 15);
          }
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


      //toggle class show of dropdown-list
      window.showDropdownList = function (id) {
        //remove all show class
        $('.dropdown-menu').removeClass('show');
        $(`#dropdown-list-${id}`).toggleClass('show');
      }

      //put class show of dropdown-list if click outside or click in other dropdown-list
      $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown-list').length) {
          $('.dropdown-menu').removeClass('show');
        }
      });

      //detect input file 
      $('#file-message', context).change(function () {
        //call function to upload file
        getFileMessage();
      });

      //detect image file
      $('#image-message', context).change(function () {
        //call function to upload image
        getImageMessage();
      });

      //close preview
      $('#reset-file', context).click(function () {
        closePreview();
      });

      //close preview
      $('#reset-image', context).click(function () {
        closePreview();
      });

      //detect click in all
      $('#all', context).click(function () {
        //call list chats
        filter_type = 0;
        getListOfChats(0, 15);
        //remove class active
        $('#all').addClass('active');
        $('#unread').removeClass('active');
        $('#read').removeClass('active');
        $('#delete').removeClass('active');
      });

      //detect click in unread
      $('#unread', context).click(function () {
        //call list chats
        filter_type = 1;
        getListOfChats(0, 15);
        $('#all').removeClass('active');
        $('#unread').addClass('active');
        $('#read').removeClass('active');
        $('#delete').removeClass('active');
      });

      //detect click in read
      $('#read', context).click(function () {
        //call list chats
        filter_type = 2;
        getListOfChats(0, 15);
        $('#all').removeClass('active');
        $('#unread').removeClass('active');
        $('#read').addClass('active');
        $('#delete').removeClass('active');
      });

      //detect click in deleted
      $('#deleted', context).click(function () {
        //call list chats
        filter_type = 3;
        getListOfChats(0, 15);
        $('#all').removeClass('active');
        $('#unread').removeClass('active');
        $('#read').removeClass('active');
        $('#delete').addClass('active');
      });
      //check if length of search-message is bigger than 3 and delay 300ms
      $('#search-message', context).on('input', function () {
        if (this.value.length >= 3) {
          setTimeout(function () {
            //call list chats
            getListOfChats(0, 15);
          }, 300);
        } else {
          if (this.value.length == 0) {
            //call list chats
            getListOfChats(0, 15);
          }
        }
      });

      //function to delete
      window.deleteChat = function (id, fullName, companyName) {
        //show modal delete and put onclick function in delete-chat
        $('#modal-chat-name').text(fullName);
        $('#modal-chat-empresa').text(companyName);
        $('#modal-chat-header-empresa').text(companyName);
        $('#modal-delete').modal('show');
        $('#delete-chat').attr('onclick', `deleteActionButton(${id})`);
      };

      window.deleteActionButton = function (id) {
        deleteChatApi(id);
      };

      //detect click images inside chat-messages
      $('#chat-messages', context).click(function (evt) {
        console.log("click");
        //check if is image
        if (evt.target.tagName == 'IMG') {
          let src = evt.target.src;
          console.log(src);
          //add background image to ligtbox
          $('#lightbox').css('background-image', `url(${src})`);
          //show lightbox
          $('#lightbox-cont').show();
        }
      });

      //detect if click outside of image in lightbox
      $('#lightbox-cont', context).click(function (evt) {
        $('#lightbox-cont').hide();
      });

    }
  };

}(jQuery, Drupal));