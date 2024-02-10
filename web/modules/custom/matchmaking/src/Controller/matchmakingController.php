<?php
namespace Drupal\matchmaking\Controller;
use Drupal\Core\Controller\ControllerBase;

class MatchmakingController extends ControllerBase {

/* Método acción content devuelve directamente un contenido en html,
este método será usado en una ruta */
  public function content() {
    
    return array(
      '#title' => 'Gestionar los criterios Match',
      '#theme' => 'matchmaking',
  );
  }

}

?>
