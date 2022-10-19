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
      //get logged user id
      $uid = \Drupal::currentUser()->id();
      //check if uid is not 0
      if ($uid == 0) {
        ///get name of company
        $uid_other_user = $this->getUid($data['entity_id_exportador']);
        $other_user = \Drupal\user\Entity\User::load($uid_other_user);
        $company_name = $other_user->get('field_company_name')->value ?? $other_user->get('name')->value;
        //get company name
        return new JsonResponse(
          ['status' => 'error', 'message' => 'You are not logged in', 'company_name' => $company_name]
        );
      }
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'entity_id_exportador', 'entity_id_comprador', 'deleted']);
      $query->condition('c.entity_id_exportador', $data['entity_id_exportador']);
      $query->condition('c.entity_id_comprador', $uid);
      $query->isNull('deleted');
      $result = $query->execute()->fetchAll();
      if ($result) {
        $uid_other_user = $this->getUid($data['entity_id_exportador']);
        $other_user = \Drupal\user\Entity\User::load($uid_other_user);

        $image = $other_user->get('field_company_logo')->getValue();
        $image = $image[0]['target_id'];
        $image = \Drupal\file\Entity\File::load($image);
        //check if image is not null
        if ($image != null) {
          $image = $image->getFileUri();
          $image = file_create_url($image);
        } else {
          $image = NULL;
        }

        return new JsonResponse([
          'status' => 'success',
          'message' => 'Chat room already exists',
          'result_chat' => array(
            'id' => $result[0]->id,
            'id_me' => $result[0]->entity_id_comprador,
            'id_other_user' => $other_user->id(),
            'company_name' => $other_user->get('field_company_name')->value ?? $other_user->get('name')->value,
            'first_name' => $other_user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $other_user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'description' => 'Comprador',
            'updated' => $result[0]->updated,
            'last_message' => $this->getLastMessage($result[0]->id),
            'company_logo' => $image,
            'count_checked' => $count,
          ),
        ]);
      }
      // Create row in table.
      $database->insert('cp_chat')
        ->fields([
          'entity_id_exportador' => $data['entity_id_exportador'],
          'entity_id_comprador' => $uid,
          'created' => date('Y-m-d H:i:s'),
          'updated' => date('Y-m-d H:i:s'),
        ])
        ->execute();

      // Get last id information
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'entity_id_exportador', 'entity_id_comprador', 'deleted']);
      $query->condition('c.entity_id_exportador', $data['entity_id_exportador']);
      $query->condition('c.entity_id_comprador', $uid);
      $query->isNull('deleted');
      $result = $query->execute()->fetchAll();
      $uid_other_user = $this->getUid($data['entity_id_exportador']);
      $other_user = \Drupal\user\Entity\User::load($uid_other_user);

      $image = $other_user->get('field_company_logo')->getValue();
      $image = $image[0]['target_id'];
      $image = \Drupal\file\Entity\File::load($image);
      //check if image is not null
      if ($image != null) {
        $image = $image->getFileUri();
        $image = file_create_url($image);
      } else {
        $image = NULL;
      }
      return new JsonResponse([
        'status' => 'success',
        'message' => 'Chat room created',
        'result_chat' => array(
          'id' => $result[0]->id,
          'id_me' => $result[0]->entity_id_comprador,
          'id_other_user' => $other_user->id(),
          'company_name' => $other_user->get('field_company_name')->value ?? $other_user->get('name')->value,
          'first_name' => $other_user->get('field_company_contact_name')->value ?? "No First Name",
          'last_name' => $other_user->get('field_company_contact_lastname')->value ?? "No Last Name",
          'description' => 'Comprador',
          'updated' => $result[0]->updated,
          'last_message' => $this->getLastMessage($result[0]->id),
          'company_logo' => $image,
          'count_checked' => $count,
        ),
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
   * Save file in drupal 9 media library and return file.
   */
  public function saveFile($fileToSave, $name, $directory) {
    \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
    $file = file_save_data($fileToSave, $directory . $name, \Drupal\Core\File\FileSystemInterface::EXISTS_REPLACE);
    return $file;
  }

  /*
  * trigger chat poitns
  */
  public function triggerChatPoints($id_logged, $chatId) {
    //get quantity of messages in chat
    $database = \Drupal::database();
    $query = $database->select('cp_chat_messages', 'c');
    $query->fields('c', ['id']);
    $query->condition('c.id_chat', $chatId);
    $query->condition('c.entity_id_sender', $id_logged);
    $query->isNull('deleted');
    $result = $query->execute()->fetchAll();
    $count = count($result);
    //if message is equal to 1, trigger points
    if ($count == 1) {
      //get cp_incentives_business_rules with id_incentives_criteria = 1
      $database = \Drupal::database();
      $query = $database->select('cp_incentives_business_rules', 'c');
      $query->fields('c', ['id', 'min_measure', 'max_measure', 'given_points']);
      $query->condition('c.id_incentives_criteria', 1);
      $result = $query->execute()->fetchAll();
      //get diff in hours of last message and current time
      $query = $database->select('cp_chat_messages', 'c');
      $query->fields('c', ['created', 'entity_id_sender', 'message']);
      $query->condition('c.id_chat', $chatId);
      //is different of $id_logged
      $query->condition('c.entity_id_sender', $id_logged, '<>');
      $query->isNull('deleted');
      $query->orderBy('c.created', 'DESC');
      $query->range(0, 1);
      $result_last_message = $query->execute()->fetchAll();
      $date1 = new \DateTime($result_last_message[0]->created);
      $date2 = new \DateTime(date('Y-m-d H:i:s'));
      $diff = $date2->diff($date1);
      $hours = $diff->h;
      $hours = $hours + ($diff->days * 24);
      //get cp_incentives_criteria expiration_days with id = 1
      $database = \Drupal::database();
      $query = $database->select('cp_incentives_criteria', 'c');
      $query->fields('c', ['expiration_days']);
      $query->condition('c.id', 1);
      $result_expiration_days = $query->execute()->fetchAll();

      //check in $result if $hours is between min_measure and max_measure
      foreach ($result as $key => $value) {
        if ($hours >= $value->min_measure && $hours <= $value->max_measure) {
          //save in cp_incentives_points given_points
          $database = \Drupal::database();
          $database->insert('cp_incentives_points')
            ->fields([
              'id_incentives_criteria' => 1,
              'entity_id_company_col' => $id_logged,
              'entity_id_buyer' => $result_last_message[0]->entity_id_sender,
              'points' => $value->given_points,
              'created' => date('Y-m-d H:i:s'),
              'expiration' => date('Y-m-d H:i:s', strtotime('+' . $result_expiration_days[0]->expiration_days . ' days')),
            ])
            ->execute();
        }
      }
    }
  }

  /**
   * Create chat message.
   */
  public function createChatMessage(Request $request) {
    // Create chat message in table cp_chat_message.
    try {
      $data = $request->request->all();
      //get id logged user
      $date = date('Y-m-d H:i:s');
      $id_logged = \Drupal::currentUser()->id();
      //check if role of user is exportador
      $user = \Drupal\user\Entity\User::load($id_logged);
      $roles = $user->getRoles();
      // Create row in table.
      $database = \Drupal::database();
      //if data['files'] is not empty save the file and get uri and save in table
      $file = $request->files->get('files');
      if (!empty($file)) {
        $file2 = file_get_contents($file);
        $file = $this->saveFile($file2, $file->getClientOriginalName(), 'public://matchmaking/chat/');
        $uri = $file->getFileUri();
        $database->insert('cp_chat_messages')->fields([
          'id_chat' => $data['id_chat'],
          'entity_id_sender' => $id_logged,
          'message' => $data['message'],
          'files' => $uri,
          'created' => $date,
          'updated' => $date,
        ])->execute();
      } else {
        $database->insert('cp_chat_messages')->fields([
          'id_chat' => $data['id_chat'],
          'entity_id_sender' => $id_logged,
          'message' => $data['message'],
          'files' => $data['files'],
          'created' => $date,
          'updated' => $date,
        ])->execute();
      }
      if (in_array('exportador', $roles)) {
        //check trigger points
        $this->triggerChatPoints($id_logged, $data['id_chat']);
      }
      //update chat update date
      $database->update('cp_chat')
        ->fields([
          'updated' => $date,
        ])
        ->condition('id', $data['id_chat'])
        ->execute();
      //get last message create in table
      $query = $database->select('cp_chat_messages', 'c');
      $query->fields('c', ['id', 'id_chat', 'entity_id_sender', 'message', 'files', 'created', 'updated']);
      $query->condition('c.id_chat', $data['id_chat']);
      $query->orderBy('c.id', 'DESC');
      $query->range(0, 1);
      $result = $query->execute()->fetchAll();

      //get data of entity_id_sender
      $data = array();
      foreach ($result as $row) {
        //get user
        $uid = $this->getUid($row->entity_id_sender);
        $user = \Drupal\user\Entity\User::load($uid);
        //check if row->files is not empty
        if (!empty($row->files)) {
          $file_url = file_create_url($row->files);
        } else {
          $file_url = '';
        }
        if ($user->hasRole('exportador')) {
          $image = $user->get('field_company_logo')->getValue();
          $image = $image[0]['target_id'];
          $image = \Drupal\file\Entity\File::load($image);
          //check if image is not null
          if ($image != null) {
            $image = $image->getFileUri();
            $image = file_create_url($image);
          } else {
            $image = NULL;
          }
          $data[] = array(
            'id' => $row->id,
            'id_chat' => $row->id_chat,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $file_url,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'company_name' => $user->get('field_company_name')->value ?? $user->get('name')->value,
            'first_name' => $user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'company_logo' => $image,
            'is_me' => $id_logged == $row->entity_id_sender ? TRUE : FALSE,
          );
        } else {
          $data[] = array(
            'id' => $row->id,
            'id_chat' => $row->id_chat,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $file_url,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'company_name' => $user->get('field_company_name')->value ?? $user->get('name')->value,
            'first_name' => $user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'is_me' => $id_logged == $row->entity_id_sender ? TRUE : FALSE,
          );
        }
      }
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat message created',
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
   * Get last message in chat
   */
  public function getLastMessage($id) {
    // Get last message in chat.
    try {
      // Get row from table.
      $database = \Drupal::database();
      $query = $database->select('cp_chat_messages', 'c');
      $query->fields('c', ['id',
        'id_chat', 'entity_id_sender', 'message', 'files', 'checked', 'created', 'deleted',
      ]
      );
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
      //get filtes all, read, unread, deleted
      $read = $request->request->get('read');
      $unread = $request->request->get('unread');
      $deleted = $request->request->get('deleted');
      //get filter message
      $message = $request->request->get('message');
      $query = $database->select('cp_chat', 'c');
      $query->fields('c', ['id', 'entity_id_exportador', 'entity_id_comprador', 'created', 'updated', 'deleted']);
      //get my chats bases in my role
      if ($user->hasRole('exportador')) {
        $query->condition('c.entity_id_exportador', \Drupal::currentUser()->id());
      } else {
        $query->condition('c.entity_id_comprador', \Drupal::currentUser()->id());
      }
      
      if ($deleted) {
        $query->isNotNull('c.deleted');
      } else {
        $query->isNull('c.deleted');
      }

      if ($read || $unread || $message != '') {
        //join with chat messages 
        $query->join('cp_chat_messages', 'cm', 'c.id = cm.id_chat and cm.entity_id_sender != :id_logged', [':id_logged' => \Drupal::currentUser()->id()]);
        if ($read) {
          //get last message
          $query->addExpression('MAX(cm.id)', 'last_message');
          //check if last message is checked is 0
          $query->having('last_message NOT IN (SELECT id FROM cp_chat_messages WHERE checked = 0)');
        }

        if ($unread) {
          //get last message
          $query->addExpression('MAX(cm.id)', 'last_message');
          //check if last message is checked is 0
          $query->having('last_message NOT IN (SELECT id FROM cp_chat_messages WHERE checked = 1)');
        }

        if ($message != '') {
          $query->condition('cm.message', '%' . $message . '%', 'LIKE');
        }

        $query->groupBy('c.id');
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

        //query to get check messages
        
        $query = $database->select('cp_chat_messages', 'c');
        $query->fields('c', ['id', 'id_chat', 'entity_id_sender', 'message', 'files', 'checked', 'created', 'deleted']);
        $query->condition('c.id_chat', $row->id);
        $query->condition('c.checked', 0);
        $query->condition('c.entity_id_sender', \Drupal::currentUser()->id(), '<>');
        $query->isNull('c.deleted');
        //count result
        $count = $query->countQuery()->execute()->fetchField();

        if ($user->hasRole('exportador')) {
          $data[] = array(
            'id' => $row->id,
            'id_me' => $row->entity_id_exportador,
            'id_other_user' => $other_user->id(),
            'company_name' => $other_user->get('field_company_name')->value ?? $other_user->get('name')->value,
            'first_name' => $other_user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $other_user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'description' => 'Comprador',
            'updated' => $row->updated,
            'last_message' => $this->getLastMessage($row->id),
            'count_checked' => $count,
          );
        } else {
          $image = $other_user->get('field_company_logo')->getValue();
          $image = $image[0]['target_id'];
          $image = \Drupal\file\Entity\File::load($image);
          //check if image is not null
          if ($image != null) {
            $image = $image->getFileUri();
            $image = file_create_url($image);
          } else {
            $image = NULL;
          }
          $data[] = array(
            'id' => $row->id,
            'id_me' => $row->entity_id_comprador,
            'id_other_user' => $other_user->id(),
            'company_name' => $other_user->get('field_company_name')->value ?? $other_user->get('name')->value,
            'first_name' => $other_user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $other_user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'description' => $other_user->get('field_company_info')->value,
            'updated' => $row->updated,
            'last_message' => $this->getLastMessage($row->id),
            'company_logo' => $image,
            'count_checked' => $count,
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
      //get loged user
      $id_logged = \Drupal::currentUser()->id();
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
        if (!empty($row->files)) {
          $file_url = file_create_url($row->files);
        } else {
          $file_url = '';
        }
        if ($user->hasRole('exportador')) {
          $image = $user->get('field_company_logo')->getValue();
          $image = $image[0]['target_id'];
          $image = \Drupal\file\Entity\File::load($image);
          //check if image is not null
          if ($image != null) {
            $image = $image->getFileUri();
            $image = file_create_url($image);
          } else {
            $image = NULL;
          }
          $data[] = array(
            'id' => $row->id,
            'id_chat' => $row->id_chat,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $file_url,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'company_name' => $user->get('field_company_name')->value ?? $user->get('name')->value,
            'first_name' => $user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'company_logo' => $image,
            'is_me' => $id_logged == $row->entity_id_sender ? TRUE : FALSE,
          );
        } else {
          $data[] = array(
            'id' => $row->id,
            'id_chat' => $row->id_chat,
            'entity_id_sender' => $row->entity_id_sender,
            'message' => $row->message,
            'files' => $file_url,
            'checked' => $row->checked,
            'updated' => $row->updated,
            'company_name' => $user->get('field_company_name')->value ?? $user->get('name')->value,
            'first_name' => $user->get('field_company_contact_name')->value ?? "No First Name",
            'last_name' => $user->get('field_company_contact_lastname')->value ?? "No Last Name",
            'is_me' => $id_logged == $row->entity_id_sender ? TRUE : FALSE,
          );
        }
      }
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat messages',
        'data' => array_reverse($data),
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
   * Change checked 0 to 1.
   */
  public function changeChecked(Request $request) {
    // change checked 0 to 1.
    try {
      $data = $request->request->all();
      //get id_chat
      $id_chat = $data['id_chat'];
      //get other user
      $id_other_user = $data['id_other_user'];
      //update checked
      $database = \Drupal::database();
      $query = $database->update('cp_chat_messages');
      $query->fields([
        'checked' => 1,
      ]);
      $query->condition('id_chat', $id_chat);
      $query->condition('entity_id_sender', $id_other_user);
      $query->condition('checked', 0);
      $query->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat messages',
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
   * Delete chat with messages.
   */
  public function deleteChat(Request $request) {
    // Delete chat with messages.
    try {
      $data = $request->request->all();
      //get id_chat
      $id_chat = $data['id_chat'];
      //update delete date
      $database = \Drupal::database();
      $query = $database->update('cp_chat');
      $query->fields([
        'deleted' => date('Y-m-d H:i:s'),
      ]);
      $query->condition('id', $id_chat);
      $query->execute();
      //update delete date
      $query = $database->update('cp_chat_messages');
      $query->fields([
        'deleted' => date('Y-m-d H:i:s'),
      ]);
      $query->condition('id_chat', $id_chat);
      $query->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Chat deleted',
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
   * Delete message
   */
  public function deleteMessage(Request $request) {
    // Delete message.
    try {
      $data = $request->request->all();
      //get id
      $id = $data['id'];
      //update deleted
      $database = \Drupal::database();
      $query = $database->update('cp_chat_messages');
      $query->fields([
        'deleted' => date('Y-m-d H:i:s'),
      ]);
      $query->condition('id', $id);
      $query->execute();
      return new JsonResponse([
        'status' => 'ok',
        'message' => 'Message deleted',
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
