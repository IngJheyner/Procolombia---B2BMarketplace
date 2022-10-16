<?php

namespace Drupal\cp_incentives\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Database\Connection;

/**
 * An cp_company_col controller.
 */
class CpCompanyColController extends ControllerBase {

  /**
   * The database connection.
   *
   * @var Drupal\Core\Database\Connection
   */
  private $db;

  /**
   * Function to get the database connection.
   */
  public function __construct(Connection $database) {
    $this->db = $database;
  }

  /**
   * Function to get the database connection.
   */
  public static function create(ContainerInterface $container)
  {
    return new static(
      $container->get('database')
    );
  }

  /**
   * Returns a template twig file.
   */
  public function index() {
    $uid = \Drupal::currentUser();
    $user = \Drupal\user\Entity\User::load($uid->id());
    // GET CURRENT USER NAME.
    $user_name = $user->get('name')->value;

    // GET CURRENT USER TOTAL POINTS.
    $total_points = 0;
    $query = $this->db->select('cp_incentives_points', 'cip');
    $query->fields('cip', ['id', 'id_incentives_criteria', 'points']);
    $query->condition('cip.entity_id_company_col', $uid->id());
    $query->condition('cip.expiration', date('Y-m-d'), '>=');
    $query->orderBy('cip.id', 'ASC');
    $results = $query->execute()->fetchAll();

    // For each points of the user, sum all the points.
    $total_points = 0;
    foreach ($results as $points) {
      $total_points += $points->points;
    }

    // Get all the status registered, to validate where the user is.
    $status = '';
    $query2 = $this->db->select('cp_incentives_status', 'cis');
    $query2->fields('cis', ['id', 'name', 'image_src', 'emphasis_main_color', 'emphasis_secondary_color']);
    $query2->condition('cis.min_points', $total_points, '<=');
    $query2->condition('cis.max_points', $total_points, '>=');
    $results = $query2->execute()->fetchAssoc();

    $status = $results['name'];
    foreach ($results as $key => $value) {
      $result[$key] = $value;
    }
    $result['image_src'] = file_create_url($result['image_src']);
    return [
      // Return a twig file: p_incentives_company_col_template.html.twig.
      '#theme' => 'cp_incentives_company_col_template_hook',
      '#company_name' => $user_name,
      '#incentive' => $result,
      '#total_points' => $total_points,
      '#status' => $status,
    ];
  }

  /**
   * Get all te benefit plan, including benefits, status and relationships.
   */
  public function getBenefitPlan() {
    $uid = \Drupal::currentUser();
    $user = \Drupal\user\Entity\User::load($uid->id());

    if ($user->isActive()) {
      try {
        // Get all benefits of the table cp_incentives_benefits.
        $query = $this->db->select('cp_incentives_rel_status_benefit', 'cirsb');
        $query->fields('cirsb', ['id', 'id_status', 'id_benefit', 'state']);
        $query->orderBy('cirsb.id', 'ASC');
        $query->join('cp_incentives_benefits', 'cib', 'cirsb.id_benefit = cib.id');
        $query->join('cp_incentives_status', 'cis', 'cirsb.id_status = cis.id');
        $query->isNull('cib.deleted');

        
        // If route contains /en/ then get spanish benefits. (with php)
        $current_path = \Drupal::service('path.current')->getPath();

        $query->addField('cib', 'description', 'incentives_description');

        $query->addField('cib', 'description_spanish', 'incentives_description_spanish');
        $query->addField('cis', 'emphasis_main_color', 'emphasis_main_color');
        $query->addField('cis', 'emphasis_secondary_color', 'emphasis_secondary_color');

        $query->addField('cib', 'state', 'incentives_state');
        $query->orderBy('cirsb.id', 'ASC');
        // Condition, where the relationship between status - benefit is active.
        $query->condition('cirsb.state', 1);
        // Condition, where the state benefit is active.
        $query->condition('cib.state', 1);

        $results = $query->execute()->fetchAll();
        $data = [];

        foreach ($results as $result) {
          $data[] = [
            'id' => $result->id,
            'id_status' => $result->id_status,
            'id_benefit' => $result->id_benefit,
            'state' => $result->state,
            'incentives_id' => $result->id,
            'incentives_description' => $result->incentives_description,
            'incentives_description_spanish' => $result->incentives_description_spanish,
            'emphasis_main_color' => $result->emphasis_main_color,
            'emphasis_secondary_color' => $result->emphasis_secondary_color,
          ];
        }
        return new JsonResponse([
          'data' => $data,
          'status' => 'success',
        ]);
        }
      catch (\Exception $e) {
        return new JsonResponse([
          'data' => [],
          'status' => 'error',
          'message' => $e->getMessage(),
        ]);
      }
    }
    else{
      return new JsonResponse([
        'data' => [],
        'status' => 'error',
        'message' => 'User is not active',
      ]);
    }
  }

  /**
   * Function to get information about the status.
   */
  public function getStatusInfo() {
    try {
      $query = $this->db->select('cp_incentives_status', 'cis');
      $query->fields('cis', ['id', 'name', 'min_points', 'max_points', 'image_src']);
      $query->orderBy('cis.id', 'DESC');
      $results = $query->execute()->fetchAll();
      $data = [];
      foreach ($results as $result) {
        $data[] = [
          'id' => $result->id,
          'name' => $result->name,
          'min_points' => $result->min_points,
          'max_points' => $result->max_points,
          'image_src' => file_create_url($result->image_src),
        ];
      }
      return new JsonResponse([
        'data' => $data,
        'status' => 'success',
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'data' => [],
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

  /**
   * Function to create a reference code.
   */
  public function createReferenceCode(Request $request) {
    // Create a random code with 4 letters and 4 numbers.
    $uid = \Drupal::currentUser();

    $code = '';
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    for ($i = 0; $i < 4; $i++) {
      $code .= $characters[rand(0, $charactersLength - 1)];
    }
    for ($i = 0; $i < 4; $i++) {
      $code .= rand(0, 9);
    }

    // If the code already exists, create a new one.
    $query = $this->db->select('cp_incentives_reference_code', 'circ');
    $query->fields('circ', ['id', 'reference_code']);
    $query->condition('circ.reference_code', $code);
    $results = $query->execute()->fetchAll();
    if (count($results) > 0) {
      // Execute the function again, if the code already exists.
      $this->createReferenceCode($request);
    }
    else {
      // Insert the code in the table.
      $values = [
        'entity_id_company_col' => $uid->id(),
        'reference_code' => $code,
        'created' => date('Y-m-d H:i:s'),
      ];

      $query = $this->db->insert('cp_incentives_reference_code');
      $query->fields($values);
      $query->execute();
    }
    return new JsonResponse([
      'status' => 200,
    ]);
  }

  /**
   * Function to get the reference code.
   */
  public function getReferenceCode () {
    $uid = \Drupal::currentUser();
    $code = '';
    $query = $this->db->select('cp_incentives_reference_code', 'circ');
    $query->fields('circ', ['id', 'reference_code']);
    $query->condition('circ.entity_id_company_col', $uid->id());
    $results = $query->execute()->fetchAll();
    // If the code exists, return it.
    if (count($results) > 0) {
      $code = $results[0]->reference_code;
    }
    // If the code does not exist, return a message 'No code'.
    else {
      $code = "No code";
    }
    return new JsonResponse([
      'data' => $code,
      'status' => 'success',
    ]);
  }

  public function getIncentives() {
    try {
      //select cp_incentives_business_rules
      $query = $this->db->select('cp_incentives_business_rules', 'cibr');
      $query->fields('cibr', ['id', 'id_incentives_criteria', 'min_measure', 'max_measure', 'given_points']);
      $query->orderBy('cibr.id', 'ASC');
      //inner join with cp_incentives_criteria
      $query->innerJoin('cp_incentives_criteria', 'cic', 'cibr.id_incentives_criteria = cic.id');
      $query->addField('cic', 'characteristic', 'criteria_characteristic');
      $query->addField('cic', 'state', 'criteria_state');
      $query->isNull('cic.deleted');
      //check if state is active
      $query->condition('cic.state', 1);


      $results = $query->execute()->fetchAll();
      $data = [];
      foreach ($results as $result) {
        $data[] = [
          'id' => $result->id,
          'id_incentives_criteria' => $result->id_incentives_criteria,
          'min_measure' => $result->min_measure,
          'max_measure' => $result->max_measure,
          'given_points' => $result->given_points,
          'criteria_characteristic' => $result->criteria_characteristic,
          'criteria_state' => $result->criteria_state,
        ];
      }
      return new JsonResponse([
        'status' => '200',
        'data' => $data,
      ]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'data' => [],
        'status' => 'error',
        'message' => $e->getMessage(),
      ]);
    }
  }

}
