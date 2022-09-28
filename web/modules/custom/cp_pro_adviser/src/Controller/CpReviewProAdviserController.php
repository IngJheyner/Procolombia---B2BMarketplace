<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_pro_adviser controller.
 */
class CpReviewProAdviserController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    // Redirect if $_SESSION['language'] is not the current path.
    // Get account_status.
    $vid = 'account_status';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
    $tree_account_status = [];
    foreach ($terms as $term) {
      array_push($tree_account_status, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    return [
      // Your theme hook name.
      '#theme' => 'cp_review_pro_adviser_template_hook',
      '#tree_account_status' => $tree_account_status,
    ];
  }

  /**
   * Function to return all advisor_logs.
   */
  public function getAdvisorLogs(Request $request) {
    $start = $request->request->get('start');
    $limit = $request->request->get('length');

    $search = $request->request->get('search');
    // Get order[column] and order[dir].
    $order = $request->request->get('order');
    // Get column.
    $column = $order[0]['column'];
    // Get dir.
    $dir = $order[0]['dir'];

    $query = \Drupal::database()->select('advisor_logs', 'al');
    $query->fields('al', ['id', 'email', 'company_name', 'created_at', 'action', 'status']);

    $company_name = $request->request->get('company_name');
    if (!empty($company_name)) {
      $query->condition('company_name', $company_name, '=');
    }

    // Email.
    $email = $request->request->get('email');
    if (!empty($email)) {
      $query->condition('email', $email, '=');
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

    // Status.
    $status = $request->request->get('status');
    if (!empty($status)) {
      $query->condition('status', $status, '=');
    }

    // Sort.
    // Check if.
    switch ($column) {
      case 1:
        $query->orderBy('email', $dir);
        break;

      case 2:
        $query->orderBy('company_name', $dir);
        break;

      case 3:
        $query->orderBy('created_at', $dir);
        break;

      case 4:
        $query->orderBy('status', $dir);
        break;

      default:
        $query->orderBy('created_at', 'DESC');
        break;

    }

    $query->range($start, $limit);
    // Get users.
    $results = $query->execute()->fetchAll();

    $log = array();
    foreach ($results as $result) {
      $log[] = array(
        'id' => $result->id,
        'email' => $result->email,
        'company_name' => $result->company_name,
        'created_at' => $result->created_at,
        'action' => $result->action,
        'status' => $result->status,
      );
    }
    // Count.
    $query = \Drupal::database()->select('advisor_logs', 'al');
    $query->fields('al', ['id', 'email', 'company_name', 'created_at', 'action', 'status']);
    $company_name = $request->request->get('company_name');
    if (!empty($company_name)) {
      $query->condition('company_name', $company_name, '=');
    }

    // Email.
    $email = $request->request->get('email');
    if (!empty($email)) {
      $query->condition('email', $email, '=');
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

    // Status.
    $status = $request->request->get('status');
    if (!empty($status)) {
      $query->condition('status', $status, '=');
    }
    // Get number of row of query.
    $count = $query->countQuery()->execute()->fetchField();
    return new JsonResponse(array(
      'draw' => $request->request->get('draw'),
      'recordsTotal' => $count,
      'recordsFiltered' => $count,
      'data' => $log,
    ));
  }

}
