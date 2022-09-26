<?php

namespace Drupal\cp_chat\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Database\Database;
/**
 * Returns responses for cp_chat routes.
 */
class CpChatController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function build() {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('It works!'),
    ];

    return $build;
  }

  /**
   * Create chat room.
   */
  public function createChatRoom(Request $request, Database $database) {
    // Create chat room in table cp_chat
    try {
      $data = $request->request->all();
      // Create row in table
      $database->insert('cp_chat')
        ->fields([
          'uid' => $data['uid'],
          'name' => $data['name'],
          'email' => $data['email'],
          'phone' => $data['phone'],
          'message' => $data['message'],
          'created' => time(),
        ])
        ->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat room created',
      ]);
    } else {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Chat room not created',
      ]);
    }
  }

  /**
   * Create chat message
   */
  public function createChatMessage(Request $request, Database $database) {
    // Create chat message in table cp_chat_message
    try {
      $data = $request->request->all();
      // Create row in table
      $database->insert('cp_chat_message')
        ->fields([
          'chat_id' => $data['chat_id'],
          'uid' => $data['uid'],
          'message' => $data['message'],
          'created' => time(),
        ])
        ->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat message created',
      ]);
    } else {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Chat message not created',
      ]);
    }
  }

  /**
   * Get chat by id
   */
  public function getChatById(Request $request, Database $database) {
    // Get chat by id
    try {
      $data = $request->request->all();
      // Get row from table
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'uid', 'name', 'email', 'phone', 'message', 'created']);
      $query->condition('c.id', $data['id']);
      $result = $query->execute()->fetchAll();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat found',
        'data' => $result,
      ]);
    } else {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Chat not found',
      ]);
    }
  }

  /**
   * Get chats list paginate by logged user
   */
  public function getChatsList(Request $request, Database $database) {
    // Get chats list paginate by logged user
    try {
      $data = $request->request->all();
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'uid', 'name', 'email', 'phone', 'message', 'created']);
      $query->condition('c.uid', $data['uid']);
      $query->orderBy('c.created', 'DESC');
      $query->range($data['offset'], $data['limit']);
      $result = $query->execute()->fetchAll();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chats list',
        'data' => $result,
      ]);
    } else {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Chats list not found',
      ]);
    }
  }

  /**
   * Get chat messages paginate
   */
  public function getChatMessagesPaginate(Request $request, Database $database) {
    // Get chat messages paginate
    try {
      $data = $request->request->all();
      $query = $database->select('cp_chat_message', 'ccm');
      $query->fields('ccm', ['id', 'chat_id', 'uid', 'message', 'created']);
      $query->condition('ccm.chat_id', $data['chat_id']);
      $query->orderBy('ccm.id', 'DESC');
      $query->range($data['offset'], $data['limit']);
      $result = $query->execute()->fetchAll();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat messages',
        'data' => $result,
      ]);
    } else {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Chat messages not found',
      ]);
    }
  }
}
