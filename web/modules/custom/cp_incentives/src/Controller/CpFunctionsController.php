<?php

namespace Drupal\cp_incentives\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Database\Connection;

/**
 * A cp_routes controller.
 */
class CpFunctionsController extends ControllerBase {

    /**
   * @var Connection
   */
  private $db;

  /**
   * Fucntion to get the database connection.
   */
  public function __construct(Connection $database)
  {
    $this->db = $database;
  }

  /**
   * Fucntion to get the database connection.
   */
  public static function create(ContainerInterface $container)
  {
    return new static(
      $container->get('database')
    );
  }

  /**
   * Function to create points for a user.
   */
  public function createPoints(Request $request) {
    // Request data.
    $data = $request->request->all();
    $uid = \Drupal::currentUser();
    $user = \Drupal\user\Entity\User::load($uid->id());

    $date = new \DateTime();
    $date_format = $date->format('Y-m-d H:i:s');

    // Get the exact expiration date by the days received as a parameter in the js function.
    $add_days = 'P'.(string)$data['expiration_days'].'D';
    $date->add(new \DateInterval($add_days));
    $date_format_expiration = $date->format('Y-m-d H:i:s');

    $buyer = $data['buyer'];
    // Check if the buyer have been received as parameter in the js function.
    if($buyer == 0 || $buyer == '' || $buyer == NULL){
      $buyer = NULL;
    };

    $values = [
      'id_incentives_criteria' => $data['id_incentives_criteria'],
      'entity_id_company_col' => $data['entity_id_company_col'],
      'entity_id_buyer' => $buyer,
      'points' => $data['points'],
      'created' => $date_format,
      'expiration' => $date_format_expiration
    ];

    $this->db->insert('cp_incentives_points')
      ->fields($values)
      ->execute();

    return new JsonResponse([
      'status' => 200,
    ]);
  }
}