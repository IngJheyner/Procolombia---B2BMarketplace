<?php
namespace Drupal\matchmaking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 * {@inheritdoc }
 *
 */

class matchmakingController extends ControllerBase {

/* Método acción content devuelve directamente un contenido en html,
este método será usado en una ruta */
  public function content() {

    $database = \Drupal::database();
    $query = $database->select(table: 'matchmaking', alias: 'match');
    $query->fields(table_alias: 'match');
    $result = $query->execute()->fetchAll();


    return array(
      '#title' => 'Gestionar los criterios Match',
      '#theme' => 'matchmaking',
      '#items' => $result
  );
  }
  public function addmatch() {
   

    return array(
      '#title' => 'Crear un nuevo criterios. Match',
      '#theme' => 'matchmakingadd',
  );
  }

  public function savematch() {
    $truncate = \Drupal::database()->truncate('matchmaking')->execute();
    $connection = \Drupal::service('database');
    $query = $connection->insert('matchmaking', array());

    $test = $_POST;
    //var_dump($test['data']);die;
    foreach ($test['data'] as &$valor) {
      $result = $connection->insert('matchmaking')->fields([
        'variable' => $valor['variable'] ,
        'peso' => $valor['peso'],
        'estado' => $valor['estado'],
        'match' => $valor['match']
        ])
      ->execute();
    }
    return new JsonResponse($array);
  }

}

?>
