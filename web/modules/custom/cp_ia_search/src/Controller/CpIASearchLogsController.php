<?php

namespace Drupal\cp_ia_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CpIASearchLogsController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    // Get site key of module reCaptcha.
    return [
      // Your theme hook name.
      '#theme' => 'cp_ia_search_logs_template_hook',
    ];
  }

  /**
   * Save new log in table cp_search_logs
   */
  public function saveLog(Request $request) {
    try {
      // Get data from request.
      $data = $request->request->all();
      //check if user exist
      $user = \Drupal::currentUser();
      $uid = $user->id();
      //get company_name
      $company_name = 'Anonimo';
      //get country
      $country = 'Anonimo';
      if ($uid != 0) {
        $user = \Drupal\user\Entity\User::load($uid);
        //get company_name
        $company_name = $user->get('field_company_name')->value ?? 'Anonimo';
        //get country
        $country = $user->get('field_country')->value ?? 'Anonimo';
      }
      //get query of request
      $query_search = $data['query'];
      //create date with time now
      $date = date('Y-m-d H:i:s');
      //create new log in table cp_search_logs
      $query = \Drupal::database()->insert('cp_search_logs');
      $query->fields([
        'query',
        'company_name',
        'created_at',
        'country',
      ]);
      $query->values([
        $query_search,
        $company_name,
        $date,
        $country,
      ]);
      $query->execute();
      // Return response.
      return new JsonResponse([
        'status' => 'success',
        'message' => 'Log saved successfully',
      ]);
    } catch (\Exception $e) {
      return new JsonResponse([
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

  /**
   * Function to return all advisor_logs.
   */
  public function getLogs(Request $request) {
    $start = $request->request->get('start');
    $limit = $request->request->get('length');

    $search = $request->request->get('search');
    // Get order[column] and order[dir].
    $order = $request->request->get('order');
    // Get column.
    $column = $order[0]['column'];
    // Get dir.
    $dir = $order[0]['dir'];

    $query = \Drupal::database()->select('cp_search_logs', 'al');
    $query->fields('al', [
      'id',
      'query',
      'company_name',
      'created_at',
      'country',
    ]);

    $company_name = $request->request->get('company_name');
    if (!empty($company_name)) {
      //like
      $query->condition('al.company_name', '%' . $company_name . '%', 'LIKE');
    }

    // Created_at.
    $update_date = $request->request->get('update_date');
    if (!empty($update_date)) {
      // Split range date with -.
      $update_date = explode('-', $update_date);
      // Replace / with -.
      $update_date[0] = str_replace('/', '-', $update_date[0]);
      $update_date[1] = str_replace('/', '-', $update_date[1]);
      // Trim spaces.
      $update_date[0] = trim($update_date[0]);
      $update_date[1] = trim($update_date[1]);
      // Convert dates to date('Y-m-d H:i:s') for compare with created_at.
      $first_date = date('Y-m-d H:i:s', strtotime($update_date[0]));
      $second_date = date('Y-m-d H:i:s', strtotime($update_date[1]));
      // Get all users with update date between first date and second date.
      $query->condition('created_at', $first_date, '>');
      $query->condition('created_at', $second_date, '<=');
    }

    // Country.
    $country = $request->request->get('country');
    if (!empty($country)) {
      //like
      $query->condition('al.country', '%' . $country . '%', 'LIKE');
    }

    // Sort.
    // Check if.
    switch ($column) {
      case 1:
        //created_at
        $query->orderBy('created_at', $dir);
        break;

      case 2:
        //created_at
        $query->orderBy('created_at', $dir);
        break;

      case 3:
        //query
        $query->orderBy('query', $dir);
        break;

      case 4:
        //company_name
        $query->orderBy('company_name', $dir);
        break;

      case 5:
        //country
        $query->orderBy('country', $dir);
        break;

      default:
        //created_at
        $query->orderBy('created_at', $dir);
        break;
    }

    $query->range($start, $limit);
    // Get users.
    $results = $query->execute()->fetchAll();

    $log = array();
    foreach ($results as $result) {
      //get date with format DD-MM-YYYY
      $date = date('d-m-Y', strtotime($result->created_at));
      //get time with format HH:MM
      $time = date('H:i', strtotime($result->created_at));
      $log[] = array(
        'id' => $result->id,
        'created_at' => $date,
        'time' => $time,
        'query' => $result->query,
        'company_name' => $result->company_name,
        'country' => $result->country,
      );
    }
    // Count.
    $query = \Drupal::database()->select('cp_search_logs', 'al');
    $query->fields('al', [
      'id',
      'query',
      'company_name',
      'created_at',
      'country',
    ]);
    $company_name = $request->request->get('company_name');
    if (!empty($company_name)) {
      //like
      $query->condition('al.company_name', '%' . $company_name . '%', 'LIKE');
    }

    // Created_at.
    $update_date = $request->request->get('update_date');
    if (!empty($update_date)) {
      // Split range date with -.
      $update_date = explode('-', $update_date);
      // Replace / with -.
      $update_date[0] = str_replace('/', '-', $update_date[0]);
      $update_date[1] = str_replace('/', '-', $update_date[1]);
      // Trim spaces.
      $update_date[0] = trim($update_date[0]);
      $update_date[1] = trim($update_date[1]);
      // Convert dates to date('Y-m-d H:i:s') for compare with created_at.
      $first_date = date('Y-m-d H:i:s', strtotime($update_date[0]));
      $second_date = date('Y-m-d H:i:s', strtotime($update_date[1]));
      // Get all users with update date between first date and second date.
      $query->condition('created_at', $first_date, '>');
      $query->condition('created_at', $second_date, '<=');
    }

    // Country.
    $country = $request->request->get('country');
    if (!empty($country)) {
      //like
      $query->condition('al.country', '%' . $country . '%', 'LIKE');
    }
    $count = $query->countQuery()->execute()->fetchField();
    return new JsonResponse([
      'draw' => $request->request->get('draw'),
      'recordsTotal' => $count,
      'recordsFiltered' => $count,
      'data' => $log,
    ]);
  }
}