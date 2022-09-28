<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * An cp_pro_adviser controller.
 */
class CpDashboardProAdviserController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    $vid = 'categories_flow_semaphore';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_production_chain = [];
    foreach ($terms as $term) {
      array_push($tree_production_chain, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    // List of terms to set a select field modelos_de_negocio.
    $vid = 'modelos_de_negocio';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_business_model = [];
    foreach ($terms as $term) {
      array_push($tree_business_model, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    // List of terms to set a select field deparments.
    $vid = 'categorization';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_categorization = [];
    foreach ($terms as $term) {
      array_push($tree_categorization, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    $vid = 'locations';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_deparment = [];
    foreach ($terms as $term) {
      array_push($tree_deparment, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    $vid = 'account_status';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_account_status = [];
    foreach ($terms as $term) {
      array_push($tree_account_status, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    //get user with role asesor_comercial
    $query = \Drupal::entityQuery('user');
    $query->condition('roles', 'asesor_comercial');
    $uids = $query->execute();
    $users = \Drupal\user\Entity\User::loadMultiple($uids);
    $tree_users = [];
    foreach ($users as $user) {
      array_push($tree_users, [
        "ID" => $user->id(),
        "Name" => $user->get('field_company_contact_name')->value . " " . $user->get('field_company_contact_lastname')->value,
      ]
      );
    }

    return [
      // Your theme hook name.
      '#theme' => 'cp_dashboard_pro_adviser_template_hook',
      '#tree_production_chain' => $tree_production_chain,
      '#tree_business_model' => $tree_business_model,
      '#tree_categorization' => $tree_categorization,
      '#tree_deparment' => $tree_deparment,
      '#tree_account_status' => $tree_account_status,
      '#tree_users' => $tree_users,
    ];
  }

  /**
   * Returns a template twig file.
   */
  public function indexInternational() {
    $vid = 'categories_flow_semaphore';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_production_chain = [];
    foreach ($terms as $term) {
      array_push($tree_production_chain, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    // List of terms to set a select field modelos_de_negocio.
    $vid = 'modelos_de_negocio';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_business_model = [];
    foreach ($terms as $term) {
      array_push($tree_business_model, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    // List of terms to set a select field deparments.
    $vid = 'categorization';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_categorization = [];
    foreach ($terms as $term) {
      array_push($tree_categorization, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    $vid = 'locations';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_deparment = [];
    foreach ($terms as $term) {
      array_push($tree_deparment, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    // Get account_status.
    $vid = 'account_status';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
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
      '#theme' => 'cp_dashboard_pro_adviser_international_template_hook',
      '#tree_production_chain' => $tree_production_chain,
      '#tree_business_model' => $tree_business_model,
      '#tree_categorization' => $tree_categorization,
      '#tree_deparment' => $tree_deparment,
      '#tree_account_status' => $tree_account_status,
    ];
  }

  /**
   * Get subcategories.
   */
  public function getSubcategories(Request $request) {
    $data = $request->request->all();
    $vid = 'categorization';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, $data['cat_interest'], 1, FALSE);
    $tree_sub_categorization = [];
    foreach ($terms as $term) {
      array_push($tree_sub_categorization, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    return new JsonResponse([
      'status' => 'success',
      'subcategories' => $tree_sub_categorization
    ]);
  }

  /**
   * Function to return all users that have role exportador are active.
   */
  public function getAllExportersByPage(Request $request) {
    // Get all user with role exportador and active and return total.
    try {
      $start = $request->request->get('start');
      $limit = $request->request->get('length');
      // Search.
      $search = $request->request->get('search');
      // Get order[column] and order[dir].
      $order = $request->request->get('order');
      // Get column.
      $column = $order[0]['column'];
      // Get dir.
      $dir = $order[0]['dir'];

      $query = \Drupal::entityQuery('user');
      $query->condition('roles', 'exportador', 'IN');
      // Detect filters if value is not empty.
      // Filter company_name.
      $company_name = $request->request->get('company_name');
      if (!empty($company_name)) {
        $query->condition('field_company_name', $company_name, 'CONTAINS');
      }
      // Filter nit.
      $nit = $request->request->get('nit');
      if (!empty($nit)) {
        $query->condition('name', $nit, 'CONTAINS');
      }
      // Filter status.
      $status = $request->request->get('status');
      if (!empty($status)) {
        $query->condition('field_account_status', $status, '=');
      }
      // Filter deparment.
      $deparment = $request->request->get('deparment');
      if (!empty($deparment)) {
        $query->condition('field_company_deparment', $deparment, 'CONTAINS');
      }
      // Filter production_chain.
      $production_chain = $request->request->get('productive_chain');
      if (!empty($production_chain)) {
        $query->condition('field_productive_chain', $production_chain, 'CONTAINS');
      }
      // Filter published.
      $published = $request->request->get('published');
      if (is_numeric($published)) {
        // Check if account is active.
        $query->condition('status', $published, '=');
      }

      // Filter advisor.
      $advisor = $request->request->get('advisor');
      if (!empty($advisor)) {
        $query->condition('field_company_adviser', $advisor, '=');
      }
      // Step equal 3.
      $query->condition('field_step', 3, '=');

      // Sort.
      // Check if.
      switch ($column) {
        case 1:
          $query->sort('name', $dir);
          break;

        case 2:
          $query->sort('field_company_name', $dir);
          break;

        case 3:
          $query->sort('langcode', $dir);
          break;

        case 5:
          $query->sort('field_company_deparment.entity.name', $dir);
          break;

        case 6:
          $query->sort('field_company_city.entity.name', $dir);
          break;

        case 7:
          $query->sort('field_productive_chain.entity.name', $dir);
          break;

        case 8:
          $query->sort('changed', $dir);
          break;

        case 11:
          $query->sort('status', $dir);
          break;

        default:
          // Sort by create date of drupal.
          $query->sort('changed', "desc");
          break;

      }

      $query->range($start, $limit);
      // Get users.
      $uids = $query->execute();
      // Get users.
      $users = \Drupal\user\Entity\User::loadMultiple($uids);

      // Return company_name and email.
      $exportadores = array();
      foreach ($users as $user) {
        // Get lang.
        $lang = $user->getPreferredLangcode();
        if ($lang == 'es') {
          $lang = 'ES';
        }
        else {
          $lang = 'EN';
        }
        // Get update date.
        $update_date = $user->get('changed')->value;
        $update_date = date('d/m/Y - H:i', $update_date);
        // Get status name.
        $status = $user->get('status')->value;
        // Cehck if user has company name.
        $company_name = $user->get('field_company_name')->value;
        // Check if step 3 is completed.
        $step = $user->get('field_step')->value;
        if ($company_name != '' && $step == 3) {
          $exportadores[] = array(
            // Username.
            'id' => $user->id(),
            // Get username.
            'nit' => $user->get('name')->value,
            // Get email.
            'email' => $user->get('mail')->value,
            // Company name.
            'company_name' => $user->get('field_company_name')->value,
            // Lang.
            'lang' => $lang,
            // Get company_logo.
            'company_logo' => file_create_url($user->get('field_company_logo')->entity->getFileUri()),
            // Field_company_deparment taxonomy term name.
            'company_deparment' => $user->get('field_company_deparment')->entity->getName(),
            // Field_company_city taxonomy term name.
            'company_city' => $user->get('field_company_city')->entity->getName(),
            // Field_productive_chain get taxonomy term name.
            'productive_chain' => $user->get('field_productive_chain')->entity->getName(),
            // Get update date or created date of user.
            'update_date' => $update_date,
            // Get status name.
            'status' => $user->get('field_account_status')->entity->getName(),
            // Get status value.
            'status_value' => $status,
          );
        }

      }

      //get count of all exportador users with count query
      $query = \Drupal::entityQuery('user');
      $query->condition('roles', 'exportador', 'IN');
      // Detect filters if value is not empty.
      // Filter company_name.
      $company_name = $request->request->get('company_name');
      if (!empty($company_name)) {
        $query->condition('field_company_name', $company_name, 'CONTAINS');
      }
      // Filter nit.
      $nit = $request->request->get('nit');
      if (!empty($nit)) {
        $query->condition('name', $nit, 'CONTAINS');
      }
      // Filter status.
      $status = $request->request->get('status');
      if (!empty($status)) {
        $query->condition('field_account_status', $status, '=');
      }
      // Filter deparment.
      $deparment = $request->request->get('deparment');
      if (!empty($deparment)) {
        $query->condition('field_company_deparment', $deparment, 'CONTAINS');
      }
      // Filter production_chain.
      $production_chain = $request->request->get('productive_chain');
      if (!empty($production_chain)) {
        $query->condition('field_productive_chain', $production_chain, 'CONTAINS');
      }
      // Filter published.
      $published = $request->request->get('published');
      if (is_numeric($published)) {
        //check if account is active
        $query->condition('status', $published, '=');
      }

      // Filter advisor.
      $advisor = $request->request->get('advisor');
      if (!empty($advisor)) {
        $query->condition('field_company_adviser', $advisor, '=');
      }

      // Check step 3.
      $query->condition('field_step', 3, '=');
      $query->count();
      $count = $query->execute();
      return new JsonResponse(array(
        'draw' => $request->request->get('draw'),
        'recordsTotal' => $count,
        'recordsFiltered' => $count,
        'data' => $exportadores,
      ), 200);
    }
    catch (Exception $e)
    {
      return new JsonResponse(array('error' => $e->getMessage()), 500);
    }
  }

  /**
   * Function to return all users that have role buyer are active.
   */
  public function getAllBuyerByPage(Request $request) {
    // Get all user with role buyer and active.
    try {
      $start = $request->request->get('start');
      $limit = $request->request->get('length');
      // Search.
      $search = $request->request->get('search');
      // Get order[column] and order[dir].
      $order = $request->request->get('order');
      // Get column.
      $column = $order[0]['column'];
      // Get dir.
      $dir = $order[0]['dir'];

      $query = \Drupal::entityQuery('user');
      $query->condition('roles', 'buyer', 'IN');
      // Detect filters if value is not empty.
      // Company_name.
      $company_name = $request->request->get('company_name');
      if (!empty($company_name)) {
        $query->condition('field_company_name', $company_name, 'CONTAINS');
      }
      // Subcat_interest_1.
      $subcat_interest_1 = $request->request->get('subcat_interest_1');
      if (!empty($subcat_interest_1)) {
        $query->condition('field_subcat_interest_1', $subcat_interest_1, 'CONTAINS');
      }
      // Filter status.
      $status = $request->request->get('status');
      if (!empty($status)) {
        $query->condition('field_account_status', $status, '=');
      }

      // Compare update date.
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
        // Get timestamp.
        $first_date = strtotime($update_date[0]);
        $second_date = strtotime($update_date[1]);
        // Get all users with update date between first date and second date.
        $query->condition('changed', array($first_date, $second_date), 'BETWEEN');
      }
      // Step equal 5.
      $query->condition('field_step', 5, '=');
      // Sort.
      // Check if.
      switch ($column) {
        case 1:
          $query->sort('field_company_name', $dir);
          break;

        case 2:
          $query->sort('mail', $dir);
          break;

        case 3:
          $query->sort('langcode', $dir);
          break;

        case 4:
          $query->sort('field_country', $dir);
          break;

        case 5:
          $query->sort('field_subcat_interest_1', $dir);
          break;

        case 6:
          $query->sort('changed', $dir);
          break;

        case 7:
          $query->sort('status', $dir);
          break;

        default:
          // Sort by create date of drupal.
          $query->sort('changed', "desc");
          break;

      }

      $query->range($start, $limit);
      // Get users.
      $uids = $query->execute();
      // Get users.
      $users = \Drupal\user\Entity\User::loadMultiple($uids);

      // Return company_name and email.
      $buyers = array();
      foreach ($users as $user) {
        // Get lang.
        $lang = $user->getPreferredLangcode();
        if ($lang == 'es') {
          $lang = 'ES';
        }
        else {
          $lang = 'EN';
        }
        // Get update date.
        $update_date = $user->get('changed')->value;
        $update_date = date('d/m/Y - H:i', $update_date);
        // Get status name.
        $status = $user->get('status')->value;
        $status_name = $status == 1 ? 'Activo' : 'Inactivo';
        // Cehck if step is 5.
        $step = $user->get('field_step')->value;
        if ($step == 5) {
          $buyers[] = array(
            // Username.
            'id' => $user->id(),
            // Get email.
            'email' => $user->get('mail')->value,
            // Company name.
            'company_name' => $user->get('field_company_name')->value,
            // Lang.
            'lang' => $lang,
            // Country.
            'country' => "Colombia",
            // Field_subcat_interest_1 get taxonomy term name.
            'subcategory' => $user->get('field_subcat_interest_1')->entity->getName(),
            // Get update date or created date of user.
            'update_date' => $update_date,
            // Get status name.
            'status' => $user->get('field_account_status')->entity->getName(),
          );
        }
      }

      // Get count of all buyer users with count query.
      $query = \Drupal::entityQuery('user');
      $query->condition('roles', 'buyer', 'IN');
      // Detect filters if value is not empty.
      // Company_name.
      $company_name = $request->request->get('company_name');
      if (!empty($company_name)) {
        $query->condition('field_company_name', $company_name, 'CONTAINS');
      }
      // Subcat_interest_1.
      $subcat_interest_1 = $request->request->get('subcat_interest_1');
      if (!empty($subcat_interest_1)) {
        $query->condition('field_subcat_interest_1', $subcat_interest_1, 'CONTAINS');
      }
      // Filter status.
      $status = $request->request->get('status');
      if (!empty($status)) {
        $query->condition('field_account_status', $status, '=');
      }
      // Compare update date.
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
        // Get timestamp.
        $first_date = strtotime($update_date[0]);
        $second_date = strtotime($update_date[1]);
        // Get all users with update date between first date and second date.
        $query->condition('changed', array($first_date, $second_date), 'BETWEEN');
      }
      // Step 5.
      $query->condition('field_step', 5, '=');
      $query->count();
      $count = $query->execute();
      return new JsonResponse(array(
        'draw' => $request->request->get('draw'),
        'recordsTotal' => $count,
        'recordsFiltered' => $count,
        'data' => $buyers,
      ), 200);
    }
    catch (Exception $e) {
      return new JsonResponse(array('error' => $e->getMessage()), 500);
    }

  }

}
