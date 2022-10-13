<?php

namespace Drupal\cp_incentives\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Database\Connection;

/**
 * An cp_adviser controller.
 */
class CpAdviserController extends ControllerBase {

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
   * Get the database connection.
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('database')
    );
  }

  /**
   * Returns a template twig file.
   */
  public function index() {
    return [
      // Render the twig template cp_incetives_adviser_template.html.twig.
      '#theme' => 'cp_incentives_adviser_template_hook',
    ];
  }

  /**
   * Returns a template twig file.
   */
  public function list() {
    return [
      // Render the twig template cp_incetives_list_adviser_template.html.twig.
      '#theme' => 'cp_incentives_list_adviser_template_hook',
    ];
  }

  /**
   * Get all rules: table cp_incentives_business_rules & cp_incentives_criteria.
   */
  public function getIncentives(Request $request) {
    try {
      $start = $request->request->get('start');
      $limit = $request->request->get('length');

      $order = $request->request->get('order');
      $column = $order[0]['column'];
      // Get dir.
      $dir = $order[0]['dir'];

      // Get cp_incentives_criteria data paginate.
      $query = $this->db->select('cp_incentives_criteria', 'inc');
      $query->fields('inc', ['id', 'characteristic', 'description', 'measurement_unit', 'state', 'expiration_days']);
      $query->isNull('inc.deleted');
      // Order by created.
      switch ($column) {
        case 1:
          $query->orderBy('characteristic', $dir);
          break;

        case 2:
          $query->orderBy('description', $dir);
          break;

        default:
          // Sort by create date of drupal.
          $query->orderBy('created', "asc");
          break;
      }
      $query->range($start, $limit);
      $results = $query->execute()->fetchAll();
      $data = [];
      foreach ($results as $result) {
        //get cp_incentives_business_rules bases in cp_incentives_criteria id
        $query = $this->db->select('cp_incentives_business_rules', 'br');
        $query->fields('br', ['id', 'min_measure', 'max_measure', 'given_points']);
        $query->isNull('br.deleted');
        $query->condition('br.id_incentives_criteria', $result->id);
        $business_rules = $query->execute()->fetchAll();
        $data[] = [
          'id' => $result->id,
          'characteristic' => $result->characteristic,
          'description' => $result->description,
          'measurement_unit' => $result->measurement_unit,
          'state' => $result->state,
          'expiration_days' => $result->expiration_days,
          'business_rules' => $business_rules,
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
   * Function to get all status of the table cp_incentives_status.
   */
  public function getStatus () {
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
          'image_src' => $result->image_src,
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
   * Function to get all benefits of the table cp_incentives_benefits.
   */
  public function getBenefits () {
    try {
      $query = $this->db->select('cp_incentives_benefits', 'cib');
      $query->fields('cib', ['id', 'description', 'description_spanish', 'state']);
      $query->orderBy('cib.id', 'ASC');
      $results = $query->execute()->fetchAll();
      $data = [];

      foreach ($results as $result) {
        $data[] = [
          'id' => $result->id,
          'description' => $result->description,
          'description_spanish' => $result->description_spanish,
          'state' => $result->state,
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
   * Function to create a new benefit.
   */
  public function createBenefit (Request $request) {
    // Request data.
    $data = $request->request->all();

    $values = [
      'description' => $data['description'],
      'description_spanish' => $data['description_spanish'],
      'state' => $data['state'],
      'created' => date('Y-m-d H:i:s'),
    ];

    $this->db->insert('cp_incentives_benefits')
      ->fields($values)
      ->execute();

    $query_id = $this->db->select('cp_incentives_benefits', 'cib');
    $query_id->fields('cib', ['id']);
    $query_id->orderBy('cib.id', 'DESC');
    // Condition the last id.
    $query_id->range(0, 1);
    $results = $query_id->execute()->fetchAll();
    $data_benefit = [];
    foreach ($results as $result) {
      $data_benefit[] = [
        'id' => $result->id,
      ];
    }
    $id_benefit = $data_benefit[0]['id'];

    // Get all status of the table cp_incentives_status to create the relationship
    $query = $this->db->select('cp_incentives_status', 'cis');
    $query->fields('cis', ['id', 'name']);
    $query->orderBy('cis.id', 'ASC');
    $results2 = $query->execute()->fetchAll();

    // DOING THE RELATIONSHIP BETWEEN BENEFITS AND STATUS
    foreach ($results2 as $result) {
      $values = [
        'id_benefit' => $id_benefit,
        'id_status' => $result->id,
        'state' => 0,
        'created' => date('Y-m-d H:i:s'),
      ];
      $this->db->insert('cp_incentives_rel_status_benefit')
        ->fields($values)
        ->execute();

    }

    return new JsonResponse([
      'status' => 200,
    ]);
  }

  /**
   * Function to create a new status.
   */
  public function createStatus (Request $request) {
    // Request data.
    $data = $request->request->all();
    $max_points = $data['max_points'];
    if (empty($max_points)) {
      $max_points = NULL;
    }

    $values = [
      'name' => $data['name'],
      'min_points' => (int)$data['min_points'],
      'max_points' => $max_points,
      'image_src' => $data['image_src'],
      'created' => date('Y-m-d H:i:s'),
    ];

    $this->db->insert('cp_incentives_status')
      ->fields($values)
      ->execute();

    // THEN CREATE THE RELATIONSHIP BETWEEN STATUS AND BENEFITS.
    // Get all benefits of the table cp_incentives_benefits.
    $query = $this->db->select('cp_incentives_benefits', 'cib');
    $query->fields('cib', ['id', 'description']);
    $query->orderBy('cib.id', 'ASC');
    $results = $query->execute()->fetchAll();

    // Get the last id of the table cp_incentives_status.
    $query_id = $this->db->select('cp_incentives_status', 'cis');
    $query_id->fields('cis', ['id']);
    $query_id->orderBy('cis.id', 'DESC');
    // Condition the last id.
    $query_id->range(0, 1);
    $results2 = $query_id->execute()->fetchAll();
    $data_status = [];
    foreach ($results2 as $result) {
      $data_status[] = [
        'id' => $result->id,
      ];
    }
    $id_status = $data_status[0]['id'];

    // DOING THE RELATIONSHIP BETWEEN BENEFITS AND STATUS.
    foreach ($results as $result) {
      $values = [
        'id_benefit' => $result->id,
        'id_status' => $id_status,
        'state' => 0,
        'created' => date('Y-m-d H:i:s'),
      ];
      $this->db->insert('cp_incentives_rel_status_benefit')
        ->fields($values)
        ->execute();

    }

    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Function to update all the status.
   */
  public function updateAllStatus(Request $request) {
    // Request data.
    $data = $request->request->all();
    // Decode the data.
    $status_list = json_decode($data['status_list'], TRUE);

    foreach ($status_list as $status) {
      // Validate if the higher status has a max_points value.
      $max_points = $status['max_points'];
      if (empty($max_points)) {
        $max_points = NULL;
      }
      $values = [
        'min_points' => $status['min_points'],
        'max_points' => $max_points,
        'updated' => date('Y-m-d H:i:s'),
      ];
      $this->db->update('cp_incentives_status')
        ->fields($values)
        ->condition('id', $status['id'])
        ->execute();
    }
    return new JsonResponse([
      'status' => 200,
    ]);
  }

  /**
   * Function to update a single benefit.
   */
  public function updateBenefit(Request $request) {
    // Request data.
    $data = $request->request->all();

    $values = [
      'description' => $data['description'],
      'description_spanish' => $data['description_spanish'],
      'state' => $data['state'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_benefits')
      ->fields($values)
      ->condition('id', $data['id'])
      ->execute();

    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Function to update a single benefit.status.
   */
  public function updateBenefitStatus(Request $request) {
    // Request data.
    $data = $request->request->all();

    $values = [
      'state' => $data['state'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_benefits')
      ->fields($values)
      ->condition('id', $data['id'])
      ->execute();

    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Function to update a single criteria.
   */
  public function updateCriteria(Request $request) {
    // Request data.
    $data = $request->request->all();

    $values = [
      'id' => $data['id'],
      'state' => $data['state'],
      'expiration_days' => $data['expiration_days'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_criteria')
      ->fields($values)
      ->condition('id', $data['id'])
      ->execute();

    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Function to get all the business rules.
   */
  public function getBusinessRules() {
    try {
      // Get all rules of the table cp_incentives_business_rules inner join with cp_incentives_criteria.
      $query = $this->db->select('cp_incentives_business_rules', 'cibr');
      $query->fields('cibr', ['id', 'id_incentives_criteria', 'min_measure', 'max_measure', 'given_points']);
      $query->join('cp_incentives_criteria', 'cic', 'cibr.id_incentives_criteria = cic.id');
      $query->fields('cic', ['measurement_unit']);
      $query->orderBy('cibr.id', 'ASC');
      $results = $query->execute()->fetchAll();
      $data = [];

      foreach ($results as $result) {
        $data[] = [
          'id' => $result->id,
          'id_incentives_criteria' => $result->id_incentives_criteria,
          'min_measure' => $result->min_measure,
          'max_measure' => $result->max_measure,
          'given_points' => $result->given_points,
          'measurement_unit' => $result->measurement_unit,
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
   * Update the 1st business rule, related to the hours of response in the chat.
   */
  public function updateBusinessRulesType1(Request $request) {
    // Request data.
    $data = $request->request->all();
    $min_measure_1 = $data['min_measure_1'];
    if ($data['min_measure_1'] == '') {
      $min_measure_1 = NULL;
    }
    else {
      $min_measure_1 = $data['min_measure_1'];
    }
    $min_measure_2 = $data['min_measure_2'];
    if ($data['min_measure_2'] == '') {
      $min_measure_2 = NULL;
    }
    else {
      $min_measure_2 = $data['min_measure_2'];
    }
    $min_measure_3 = $data['min_measure_3'];
    if ($data['min_measure_3'] == '') {
      $min_measure_3 = NULL;
    }
    else {
      $min_measure_3 = $data['min_measure_3'];
    }
    $values1 = [
      'id' => $data['id_criteria_1'],
      'min_measure' => $min_measure_1,
      'max_measure' => $data['max_measure_1'],
      'given_points' => $data['given_points_1'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $values2 = [
      'id' => $data['id_criteria_2'],
      'min_measure' => $min_measure_2,
      'max_measure' => $data['max_measure_2'],
      'given_points' => $data['given_points_2'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $values3 = [
      'id' => $data['id_criteria_3'],
      'min_measure' => $min_measure_3,
      'max_measure' => $data['max_measure_3'],
      'given_points' => $data['given_points_3'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_business_rules')
      ->fields($values1)
      ->condition('id', $data['id_criteria_1'])
      ->execute();
    $this->db->update('cp_incentives_business_rules')
      ->fields($values2)
      ->condition('id', $data['id_criteria_2'])
      ->execute();
    $this->db->update('cp_incentives_business_rules')
      ->fields($values3)
      ->condition('id', $data['id_criteria_3'])
      ->execute();
    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Update the 2nd - and 3rd business rules.
   */
  public function updateBusinessRulesType2(Request $request) {
    // Request data.
    $data = $request->request->all();
    $values = [
      'given_points' => $data['points'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_business_rules')
      ->fields($values)
      ->condition('id', $data['id-criteria'])
      ->execute();

    return new JsonResponse([
      'status' => 200,
    ]);

  }

  /**
   * Function to get all  the relations between the status and the benefits.
   */
  public function getRelStatusBenefits() {
    try {
      // Get all benefits of the table cp_incentives_benefits.
      $query = $this->db->select('cp_incentives_rel_status_benefit', 'cirsb');
      $query->fields('cirsb', ['id', 'id_status', 'id_benefit', 'state']);
      // Condition where id_Status exists in the table cp_incentives_status.
      $query->join('cp_incentives_status', 'cis', 'cirsb.id_status = cis.id');

      // Condition where id_benefit exists in the table cp_incentives_benefits.
      $query->fields('cis', ['name']);

      $query->orderBy('cirsb.id', 'ASC');
      $results = $query->execute()->fetchAll();
      $data = [];
      foreach ($results as $result) {
        $data[] = [
          'id' => $result->id,
          'id_status' => $result->id_status,
          'id_benefit' => $result->id_benefit,
          'state' => $result->state,
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
   * Function to update the relations between the status and the benefits.
   */
  public function updateRelStatusBenefits (Request $request) {
    // Request data.
    $data = $request->request->all();
    $values = [
      'state' => $data['rel_state'],
      'updated' => date('Y-m-d H:i:s'),
    ];

    $this->db->update('cp_incentives_rel_status_benefit')
      ->fields($values)
      ->condition('id', $data['id_rel'])
      ->execute();

    return new JsonResponse([
      'status' => 200,
      'state' => $data['rel_state'],
      'id_rel' => $data['id_rel'],
    ]);

  }

  /**
   * Function to get all the criterias.
   */
  public function getCriterias() {

    $uid = \Drupal::currentUser();
    $user = \Drupal\user\Entity\User::load($uid->id());

    if ($user->isActive()) {
      try {
        $query = $this->db->select('cp_incentives_criteria', 'cic');
        $query->fields('cic', ['id', 'characteristic', 'description', 'measurement_unit', 'state', 'expiration_days']);
        $query->orderBy('cic.id', 'ASC');
        $results = $query->execute()->fetchAll();
        $data = [];

        foreach ($results as $result) {
          $data[] = [
            'id' => $result->id,
            'characteristic' => $result->characteristic,
            'description' => $result->description,
            'measurement_unit' => $result->measurement_unit,
            'state' => $result->state,
            'expiration_days' => $result->expiration_days,
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
  }
}
