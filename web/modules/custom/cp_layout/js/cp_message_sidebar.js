
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
  var filter_type = 0;

  function init() {
    getListOfChats(0, 15);
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
    let search_message = $('#search-message_side_bar').val();
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

  const renderChatList = (chatList) => {
    let html = '';
    let countNewMessages = 0;
    console.log("renderChatList")
    chatList.forEach((chat) => {
      html += `
      <li id="conversation0" class="bg-white" onclick="getChatMessagesSideBar(${chat.id}, ${chat.id_other_user}, '${chat.first_name + " " + chat.last_name}' ,'${chat.description}', '${chat.company_name}', ${chat?.company_logo ? "'" + chat?.company_logo + "'" : 'null'}, ${chat.id_me} )">
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
            <p class="chat-user-message text-truncate mb-0" id="last_message_chat_list_side_bar-${id_other_user}">${chat.last_message.length > 0 ? chat.last_message[0].message : 'Nuevo Chat'}</p>
            <p class="chat-user-message text-truncate mb-0 list-tipyn" style="display:none" id="typingChatSideBar-${id_other_user}">Escribiendo<span class="animate-typing"><span class="dot ms-1"></span><span class="dot ms-1"></span><span class="dot ms-1"></span></span></p>
          </div>
          <div class="time"><span> ${showDateOrTime(chat.updated)}</span></div>
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
    $('#chat-list-sidebar').html(html);
  }

  // **********************
  // *** Call functions ***
  // **********************
  Drupal.behaviors.cp_messages_sidebar = {
    attach: function (context, settings) {
      //init 
      //get path and check if is different to /messages
      if (context == document && !window.location.pathname.includes('/messages')) {
        console.log("ENTRO")
        init();
        socket = io('ws://44.210.73.93:5055');
      }

      //receive refreshChatList
      socket.on('refreshChatList', function (data) {
        let msg = data.message[0];
        if (msg.entity_id_sender != id_me) {
          console.log("refreshChatList");
          console.log(data);
          getListOfChats(0, 15);
        }
      });

      //receive typingChat
      socket.on('typingChat', function (data) {
        console.log("typing socket chat");
        console.log(data);
        if (data.typing == true) {
          console.log(`#last_message_chat_list_side_bar-${data.user_id}`);
          $(`#typingChatSideBar-${data.user_id}`).show();
          $(`#last_message_chat_list_side_bar-${data.user_id}`).hide();
        } else {
          $(`#typingChatSideBar-${data.user_id}`).hide();
          $(`#last_message_chat_list_side_bar-${data.user_id}`).show();
        }
      });

      //function to call getListOfChats
      window.callGetListOfChats = function (offset, limit) {
        getListOfChats(offset, limit);
      }

      $('#close-sidebar', context).click(function () {
        $('#right_messages').hide();
      });
      //detect click in all
      $('#all_side_bar', context).click(function () {
        //call list chats
        filter_type = 0;
        getListOfChats(0, 15);
        //remove class active
        $('#all_side_bar').addClass('active');
        $('#unread_side_bar').removeClass('active');
        $('#read_side_bar').removeClass('active');
        $('#delete_side_bar').removeClass('active');
      });

      //detect click in unread
      $('#unread_side_bar', context).click(function () {
        //call list chats
        filter_type = 1;
        getListOfChats(0, 15);
        $('#all_side_bar').removeClass('active');
        $('#unread_side_bar').addClass('active');
        $('#read_side_bar').removeClass('active');
        $('#delete_side_bar').removeClass('active');
      });

      //detect click in read
      $('#read_side_bar', context).click(function () {
        //call list chats
        filter_type = 2;
        getListOfChats(0, 15);
        $('#all_side_bar').removeClass('active');
        $('#unread_side_bar').removeClass('active');
        $('#read_side_bar').addClass('active');
        $('#delete_side_bar').removeClass('active');
      });

      //detect click in deleted
      $('#delete_side_bar', context).click(function () {
        //call list chats
        filter_type = 3;
        getListOfChats(0, 15);
        $('#all_side_bar').removeClass('active');
        $('#unread_side_bar').removeClass('active');
        $('#read_side_bar').removeClass('active');
        $('#delete_side_bar').addClass('active');
      });
      //check if length of search-message is bigger than 3 and delay 300ms
      $('#search-message_side_bar', context).on('input', function () {
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
    }
  };

}(jQuery, Drupal));