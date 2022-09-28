<?php

namespace Drupal\cp_chat\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Database;

/**
 * Returns responses for cp_chat routes.
 */
class CpChatController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function index() {
    $tree_messages = [];
    array_push($tree_messages,
      [
        "business_name" => "Empresa A",
        "contact" => "Sebastián Díaz Fonseca",
        "time" => "4 horas",
        "last_message" => "Hola, revisé tu oferta de ABC..",
      ],
    );
    array_push($tree_messages,
    [
      "business_name" => "Empresa 1",
      "contact" => "Samuel Vega Do Lugar",
      "time" => "5 horas",
      "last_message" => "No acepto la oferta.",
    ],
    );
    array_push($tree_messages,
    [
      "business_name" => "SAS ASOCIADOS",
      "contact" => "Carl Carlson",
      "time" => "6 horas",
      "last_message" => "Todo ok, se enviará a EEUU.",
    ],
    );
    array_push($tree_messages,
    [
      "business_name" => "LTDA ASOCC",
      "contact" => "Michael Jackson",
      "time" => "7 horas",
      "last_message" => "Ayuwoki Annie.",
    ],
    );
    return [
      // Your theme hook name.
      '#theme' => 'cp_chat_template_hook',
      // '#tree_messages' => $tree_messages,
      '#tree_messages' => $tree_messages,
      // '#site_key' => $site_key,
    ];
  }

  /**
   * Return uid of user by nit with search by Username.
   */
  public function getUid($id) {
    $query = \Drupal::entityQuery('user')
      ->condition('uid', $id)
      ->execute();
    if (!empty($query)) {
      $user = \Drupal\user\Entity\User::load(reset($query));
      $uid = $user->id();
      return $uid;
    }
    else {
      return 0;
    }
  }

  /**
   * Create chat room.
   */
  public function createChatRoom(Request $request) {
    // Create chat room in table cp_chat.
    try {
      $data = $request->request->all();
      //check if chat room already exists
      $database = \Drupal::database();
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'entity_id_exportador', 'entity_id_comprador', 'deleted']);
      $query->condition('c.entity_id_exportador', $data['entity_id_exportador']);
      $query->condition('c.entity_id_comprador', $data['entity_id_comprador']);
      $query->isNull('deleted');
      $result = $query->execute()->fetchAll();
      if ($result) {
        return new JsonResponse([
          'status' => 'error',
          'message' => 'Chat room already exists',
        ]);
      }
      // Create row in table.
      $database->insert('cp_chat')
        ->fields([
          'entity_id_exportador' => $data['entity_id_exportador'],
          'entity_id_comprador' => $data['entity_id_comprador'],
          'created' => date('Y-m-d H:i:s'),
          'updated' => date('Y-m-d H:i:s'),
        ])
        ->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat room created',
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

  /**
   * Create chat message.
   */
  public function createChatMessage(Request $request) {
    // Create chat message in table cp_chat_message.
    try {
      $data = $request->request->all();
      // Create row in table.
      $database = \Drupal::database();
      $database->insert('cp_chat_messages')
        ->fields([
          'id_chat' => $data['id_chat'],
          'entity_id_sender' => $data['entity_id_sender'],
          'message' => $data['message'],
          'files' => $data['files'],
          'created' => date('Y-m-d H:i:s'),
          'updated' => date('Y-m-d H:i:s'),
        ])
        ->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat message created',
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

  /**
   * Get last message in chat
   */
  public function getLastMessage($id) {
    // Get last message in chat.
    try {
      // Get row from table.
      $database = \Drupal::database();
      $query = $database->select('cp_chat_messages', 'c');
      $query->fields('c', ['id', 'id_chat', 'entity_id_sender', 'message', 'files', 'checked', 'created', 'deleted']);
      $query->condition('c.id_chat', $id);
      $query->orderBy('c.id', 'DESC');
      $query->range(0, 1);
      $result = $query->execute()->fetchAll();
      return $result;
    }
    catch (\Exception $e) {
      return ['status' => FALSE, 'message' => $e->getMessage()];
    }
  }

  /**
   * Get chats list paginate by logged user.
   */
  public function getChatsList(Request $request) {
    // Get chats list paginate by logged user.
    try {
      //get logged user
      $data = $request->request->all();
      $user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
      //use database
      $database = \Drupal::database();
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'entity_id_exportador', 'entity_id_comprador', 'created', 'updated']);
      //check if not deleted isNull
      $query->isNull('deleted');
      //check if user is exportador
      if ($user->hasRole('exportador')) {
        $query->condition('c.entity_id_exportador', \Drupal::currentUser()->id());
      }
      //check if user is comprador
      if ($user->hasRole('buyer')) {
        $query->condition('c.entity_id_comprador', \Drupal::currentUser()->id());
      }
      //paginate
      $query->range($data['offset'], $data['limit']);
      //order by
      $query->orderBy('c.updated', 'DESC');
      //execute query
      $result = $query->execute()->fetchAll();
      
      $data = array();
      //get information of exportador and comprador
      foreach ($result as $row) {
        //get other user
        $other_user = $user->hasRole('exportador') ? $row->entity_id_comprador : $row->entity_id_exportador;
        //get user
        $uid_other_user = $this->getUid($other_user);
        $other_user = \Drupal\user\Entity\User::load($uid_other_user);
        if ($user->hasRole('exportador')) {
          $data[] = array(
            'id' => $row->id,
            'company_name' => $other_user->get('field_company_name')->value,
            'firts_name' => $other_user->get('field_company_contact_name')->value,
            'last_name' => $other_user->get('field_company_contact_lastname')->value,
            'updated' => $row->updated,
            'last_message' => $this->getLastMessage($row->id),
          );
        } else {
          $data[] = array(
            'id' => $row->id,
            'company_name' => $other_user->get('field_company_name')->value,
            'firts_name' => $other_user->get('field_company_contact_name')->value,
            'last_name' => $other_user->get('field_company_contact_lastname')->value,
            'updated' => $row->updated,
            'last_message' => $this->getLastMessage($row->id),
            'company_logo' => file_create_url($other_user->get('field_company_logo')->entity->getFileUri()),
          );
        }
      }

      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chats found',
        'data' => $data,
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

  /**
   * Get chat messages paginate.
   */
  public function getChatMessagesPaginate(Request $request) {
    // Get chat messages paginate.
    try {
      $data = $request->request->all();
      $database = \Drupal::database();
      $query = $database->select('cp_chat_messages', 'ccm');
      $query->fields('ccm', ['id', 'id_chat', 'entity_id_sender', 'message', 'files', 'checked', 'updated']);
      $query->condition('ccm.id_chat', $data['id_chat']);
      //check if not deleted isNull
      $query->isNull('deleted');
      //paginate
      $query->range($data['offset'], $data['limit']);
      //order by
      $query->orderBy('ccm.updated', 'DESC');
      //execute query
      $result = $query->execute()->fetchAll();

      //get data of entity_id_sender
      $data = array();
      foreach ($result as $row) {
        //get user
        $uid = $this->getUid($row->entity_id_sender);
        $user = \Drupal\user\Entity\User::load($uid);
        if ($user->hasRole('exportador')) {
          $data[] = array(
            'id' => $row->id,
            'chat_id' => $row->chat_id,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $row->files,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'firts_name' => $user->get('field_company_contact_name')->value,
            'last_name' => $user->get('field_company_contact_lastname')->value,
            'company_logo' => file_create_url($user->get('field_company_logo')->entity->getFileUri()),
          );
        } else {
          $data[] = array(
            'id' => $row->id,
            'chat_id' => $row->chat_id,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $row->files,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'firts_name' => $user->get('field_company_contact_name')->value,
            'last_name' => $user->get('field_company_contact_lastname')->value,
          );
        }
      }
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat messages',
        'data' => $data,
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

}
