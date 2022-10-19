
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
  var first_date = '';
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
        //get firts date
        if (msgList.length > 0) {
          first_date = moment(msgList[0].updated).format('YYYY-MM-DD');
        }
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
                  
              <div class="ctext-wrap-content w-100">
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
                  <div class="ctext-wrap-content w-100">
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
                                <h5 class="4 mb-1 text-break">
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
                  
              <div class="ctext-wrap-content w-100">
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
                  <div class="ctext-wrap-content w-100">
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
                                <h5 class="4 mb-1 text-break">
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
                <div class="ctext-wrap-content w-100">
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
                <div class="ctext-wrap-content w-100">
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
                  
              <div class="ctext-wrap-content w-100">
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
                  <div class="ctext-wrap-content w-100">
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
                                <h5 class="4 mb-1 text-break">
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
                  
              <div class="ctext-wrap-content w-100">
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
                  <div class="ctext-wrap-content w-100">
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
                                <h5 class="4 mb-1 text-break">
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
                <div class="ctext-wrap-content w-100">
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
                <div class="ctext-wrap-content w-100">
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

  let stopComplete = false;
  //infitine scroll for list messages in chat
  $('#message-content-window').scroll(function () {
    if (length_fetch_message > 0) {
      if ($(this).scrollTop() == 0) {
        offset += 30;
        fetchChatMessages(chat_selected, offset, 30, true);
        stopComplete = false;
      } else {
        if (!stopComplete) {
          //get text of id chat-company-name
          let name = $('#chat-company-name-window').text();
          console.log("NAME", name);
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
          $('#chat-messages-window').prepend(html);
          stopComplete = true;
        }
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
      //file-message or image-message are not empty send file
      if ($('#file-message-window').val() != '') {
        formdata.append("files", $('#file-message-window')[0].files[0]);
      } else {
        if ($('#image-message-window').val() != '') {
          formdata.append("files", $('#image-message-window')[0].files[0]);
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
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
            $("#alert-message-layout").show();
            console.log("ERROR WHILE CREATING MESSAGE");
          }
        })
        .catch(error => {
          console.log('error', error),
            $("#alert-message-layout").css("animation-name", "fadeInUpBig");
          $("#alert-message-layout").show();
          console.log("ERROR WHILE CREATING MESSAGE");
        });
    }
  }


  //get file message
  const getFileMessage = () => {
    //remove image of input
    $('#image-src-window').val('');
    //get file of input
    let file = $('#file-message-window').prop('files')[0];
    //get name of file
    let name = file.name;
    $('#message-image-window').hide();
    $('#messages-window').hide();
    //get file extension
    let file_extension = name.split('.').pop();
    console.log("file_extension-window", file_extension);
    //set name of file in input
    $('#file-name-window').text(name);
    //set extension of file in input
    $('#file-extension-window').text(file_extension);
    //set size of file in input
    let sizeInKb = file.size / 1024;
    $('#file-size-window').text(sizeInKb.toFixed(2) + " KB");
    //detect extension if is document, zip and the rest is unknown
    if (file_extension == 'doc' || file_extension == 'docx' || file_extension == 'pdf' || file_extension == 'xls' || file_extension == 'xlsx' || file_extension == 'ppt' || file_extension == 'pptx' || file_extension == 'txt' || file_extension == 'csv') {
      //change icon 
      $('#file-icon-window').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1"  viewBox="0 0 24 24"> <defs> <style> .cls-1 { fill: #0085ca; } </style> </defs> <title>document</title> <path class="cls-1" d="M19.41,8.41,13.59,2.59l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08,0,0,0-.05,0-.16-.09A2.22,2.22,0,0,0,12.31,2H6A2,2,0,0,0,4,4V21.08a.92.92,0,0,0,.92.92H18a2,2,0,0,0,2-2V9.83A2,2,0,0,0,19.41,8.41ZM13.5,4.62,17.38,8.5H14a.5.5,0,0,1-.5-.5ZM18.5,20a.5.5,0,0,1-.5.5H5.5V4A.5.5,0,0,1,6,3.5h6V8a2,2,0,0,0,2,2h4.5Z" /> <path class="cls-1" d="M11.75,12.52a.76.76,0,0,0,.75-.75.74.74,0,0,0-.65-.74H7.25a.75.75,0,0,0-.1,1.49h4.6Z" /> <path class="cls-1" d="M15.75,15.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> <path class="cls-1" d="M15.75,18.52a.75.75,0,0,0,.1-1.5H7.25a.75.75,0,0,0-.1,1.49h8.6Z" /> </svg>');
    } else {
      if (file_extension == 'zip' || file_extension == 'rar') {
        $('#file-icon-window').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#606266;}</style></defs><title>compressed</title><path class="cls-1" d="M9.49,4.4A2.23,2.23,0,0,0,8.21,4H4.1A2.24,2.24,0,0,0,2,6.25V17.9A2.24,2.24,0,0,0,4.25,20H19.9A2.24,2.24,0,0,0,22,17.75V8.44A2.25,2.25,0,0,0,19.75,6.5H12l-2.37-2Zm4,3.6v2.25a.75.75,0,0,0,.75.75H15v1h-.25a.75.75,0,0,0,0,1.5H15V15h-.25a.75.75,0,0,0,0,1.5H15v2H4.15a.75.75,0,0,1-.65-.74V10.5H8.4A2.31,2.31,0,0,0,9.65,10L12,8Zm3,10h.25a.75.75,0,0,0,0-1.5H16.5V15h.25a.75.75,0,0,0,0-1.5H16.5V11h.75a.76.76,0,0,0,.75-.75V8h1.85a.75.75,0,0,1,.65.74v9.1a.75.75,0,0,1-.74.65H16.5Zm0-10V9.5H15V8ZM4.25,5.5H8.31a.76.76,0,0,1,.38.16l1.89,1.58L8.69,8.83l-.09.06A.77.77,0,0,1,8.21,9H3.5V6.15A.75.75,0,0,1,4.25,5.5Z"/></svg>');

      } else {
        $('#file-icon-window').html('<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#606266;}</style></defs><title>unknown</title><path class="cls-1" d="M20,19.5a.5.5,0,0,1-.5.5H13.77a6.44,6.44,0,0,1-1.08,1.5H19.5a2,2,0,0,0,2-2V9.33a2,2,0,0,0-.59-1.42L15.09,2.09l-.05,0,0,0a1.24,1.24,0,0,0-.22-.18l-.08-.05,0,0-.05,0-.16-.09a2.22,2.22,0,0,0-.63-.14H7.5a2,2,0,0,0-2,2V11A6.29,6.29,0,0,1,7,10.58V3.5A.5.5,0,0,1,7.5,3h6V7.5a2,2,0,0,0,2,2H20ZM15,4.12,18.88,8H15.5a.5.5,0,0,1-.5-.5Z"/><path class="cls-1" d="M2.5,17A5.5,5.5,0,1,0,8,11.5,5.5,5.5,0,0,0,2.5,17Zm4.75,3.25A.75.75,0,1,1,8,21,.76.76,0,0,1,7.25,20.25ZM6,15.5a2,2,0,0,1,4,0,2.18,2.18,0,0,1-.75,1.71L9,17.48l-.11.12a1.15,1.15,0,0,0-.37.9.5.5,0,0,1-1,0,2.18,2.18,0,0,1,.75-1.71l.27-.27.11-.12A1.15,1.15,0,0,0,9,15.5a1,1,0,0,0-2,0,.5.5,0,0,1-1,0Z"/></svg>');
      }
    }
    $('#message-file-window').css('display', 'flex');
  }

  //get image and show in preview
  const getImageMessage = () => {
    //get file of input
    $('#file-message-window').val('');
    let file = $('#image-message-window').prop('files')[0];
    console.log("file_extension", URL.createObjectURL(file));
    $('#messages-window').hide();
    $('#message-file-window').hide();
    $('#message-src-window').attr('src', URL.createObjectURL(file));
    $('#message-image-window').css('display', 'flex');
  }
  //close preview
  const closePreview = () => {
    //remove file of input
    $('#file-message-window').val('');
    //remove image of input
    $('#image-message-window').val('');
    $('#message-image-window').hide();
    $('#message-file-window').hide();
    $('#messages-window').show();
  }

  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_chat_window = {
    attach: function (context, settings) {
      //init 
      if (context == document && !window.location.pathname.includes('/messages')) {
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
            `<img src="${companyLogo}" class="rounded-circle avatar-xs" alt="" />
            <span id="chat-user-status-window" class="user-status"></span>
            `
          );
        } else {
          $('#chat-company-logo-window').html(
            `<div class="avatar-xs ">
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
      if (socket) {
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
                     <span class="avatar-title rounded-circle bg-soft-primary text-white">${msg?.company_name?.charAt(0)}</span>
                    </div>
                    `
                  }
                   </div>
                   ${extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif' || extension === 'svg' || extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' || extension === 'GIF' || extension === 'SVG' ?
                    `<div class="user-chat-content">
                     <div class="ctext-wrap">
                         
                     <div class="ctext-wrap-content w-100">
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
                         <div class="ctext-wrap-content w-100">
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
                                       <h5 class="4 mb-1 text-break">
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
                $('#chat-messages-window').append(`
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
                      <div class="ctext-wrap-content w-100">
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
              `);
              }
              var objDiv = document.getElementById("message-content-window");
              objDiv.scrollTop = objDiv.scrollHeight;
            } else {
              console.log('entro');
              console.log(msg);
              if (!msg.checked) {
                new_messages += 1;
                console.log(new_messages);
                if ($('#new-messages-chat-window').length === 0) {
                  $('#chat-messages').append(`
                <li id="new-message-content-window"><div class="chat-day-title new-message-chat" ><span class="title" id="new-messages-chat-window">${new_messages + " Mensaje Nuevo"
                    }</span></div></li>
                `);
                } else {
                  $('#new-messages-chat-window').text(new_messages + " Mensajes Nuevos");
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
                $('#chat-messages-window').append(`
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
                      
                  <div class="ctext-wrap-content w-100">
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
                      <div class="ctext-wrap-content w-100">
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
                                    <h5 class="4 mb-1 text-break">
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
                $('#chat-messages-window').append(`
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
                      <div class="ctext-wrap-content w-100">
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
              var objDiv = document.getElementById("message-content-window");
              if (objDiv.scrollHeight - objDiv.scrollTop - 100 <= objDiv.clientHeight) {
                objDiv.scrollTop = objDiv.scrollHeight;
              }
            }
          }
          last_id_message = msg.id;
        })
      }

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
      if (socket) {
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
                              <div class="ctext-wrap-content w-100 w-100">
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
      }

      //hide chat
      $('#close-window', context).click(function () {
        $('#chat-window-modal').hide();
      });

      //detect input file 
      $('#file-message-window', context).change(function () {
        //call function to upload file
        getFileMessage();
      });

      //detect image file
      $('#image-message-window', context).change(function () {
        //call function to upload image
        getImageMessage();
      });

      //close preview
      $('#reset-file-window', context).click(function () {
        closePreview();
      });

      //close preview
      $('#reset-image-window', context).click(function () {
        closePreview();
      });

      //detect click images inside chat-messages
      $('#chat-messages-window', context).click(function (evt) {
        console.log("click");
        //check if is image
        if (evt.target.tagName == 'IMG') {
          let src = evt.target.src;
          console.log(src);
          //add background image to ligtbox
          $('#lightbox-window').css('background-image', `url(${src})`);
          //show lightbox
          $('#lightbox-cont-window').show();
        }
      });

      //detect if click outside of image in lightbox
      $('#lightbox-cont-window', context).click(function (evt) {
        $('#lightbox-cont-window').hide();
      });

    }
  };

}(jQuery, Drupal));