
/*
 * Service for Check NIT
 */
(function ($, Drupal) {
  'use strict';

  function init() {
    getListOfChats(0, 15);
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
        let msgList = result.data;
        console.log(msgList);
        renderChatList(msgList);
      })
      .catch(error => console.log('error', error));
  }

  //check with moment is date is today show time
  //if not show date
  const showDateOrTime = (date) => {
    console.log(date);
    let today = moment().format('YYYY-MM-DD');
    let msgDate = moment(date).format('YYYY-MM-DD');
    if (today == msgDate) {
      return moment(date).format('hh:mm A');
    } else {
      //from now in spanish
      return moment(date).fromNow();
    }
  }

  const renderChatList = (msgList) => {
    let html = '';
    msgList.forEach((msg) => {
      html += `
      <li id="conversation0" class="">
        <div class="d-flex" id="msg">
          <div class="chat-user-img online align-self-center me-3 ms-0">
          ${msg.company_logo ? `
            <img
              src="${msg.company_logo}"
              class="rounded-circle avatar-xs" alt="chatvia" />
            <span class="user-status"></span>`
            :
            `<span class="avatar-title rounded-circle bg-soft-primary text-primary">${msg.company_name.charAt(0)}</span>`
          }
          </div>
          <div class="flex-grow-1 overflow-hidden">
            <h5 class="text-truncate 5 mb-1">
              ${msg.company_name}
            </h5>
            <p class="chat-user-message text-truncate mb-0">
              ${
                msg.last_message.length > 0 ? msg.last_message[0].message : 'Nuevo Chat'
              }
            </p>
          </div>
          <div class="1">
          ${
            showDateOrTime(msg.updated)
          }
          </div>
            <div class="unread-message mt-2"
              style="background-color: trasnparent;border-radius:100px;" id="unRead1"><span
                class="badge text-muted rounded-pill" style="font-size: 1rem;padding:4px;"><i
                  class='bx bx-dots-horizontal-rounded'></i></span>
            </div>
          </div>
      </li>
      `
    });

    $('#chat-list').html(html);
  }


  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_chat = {
    attach: function (context, settings) {
      //init 
      if (context == document) {
        init();
      }
    }
  };

}(jQuery, Drupal));