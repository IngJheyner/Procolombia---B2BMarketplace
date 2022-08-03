<?php

/**
 * @file
 * Autocomplete States and cities
 */

namespace Drupal\cp_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Utility\Tags;
use Drupal\Component\Utility\Unicode;

/**
 * Controller for entity autocomplete state and cities
 */
class AutocompleteController extends ControllerBase {

  /**
   * Handler for autocomplete request.
   */
  public function handleAutocomplete(Request $request, $field_name, $count) {
    $opts = [];

    // Get the typed string from the URL, if it exists.
    if ($input = $request->query->get('q')) {
      $word = Tags::explode($input);
      $word = Unicode::mb_strtolower(array_pop($word));

      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
      $query->join('taxonomy_term__parent', 'tp', 'tfd.tid = tp.entity_id');
      $query->addField('tfd', 'tid');
      $query->addField('tfd', 'name');
      $query->condition('tfd.vid', 'locations');
      $query->condition('tp.parent_target_id', 0, '!=');
      $query->condition('tfd.langcode', 'es');
      $query->condition('tfd.status', 1);

      $query->condition('tfd.name', \Drupal::database()->escapeLike($word) . "%", 'LIKE');
      $result = $query->execute()->fetchAll();
      if (!empty($result)) {
        $cont = 0;
        foreach ($result as $key => $value) {
          $opts[] = array(
            'label' => trim($value->name),
            'value' => $value->name . ' ('. $value->tid . ')'
          );
          $cont++;
          if ($cont >= $count) {
            break;
          }
        }
      }
    }

    return new JsonResponse($opts);
  }

  public function autocompleteCiiuCodes(Request $request) {
    // echo '<pre>';
    $matches = array();
    $string = $request->query->get('q');
    if ($string) {
      $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
      $query->join('taxonomy_term__field_ciiu_code', 'tcc', 'tfd.tid = tcc.entity_id');
      $query->addField('tfd', 'tid');
      $query->addField('tfd', 'description__value', 'desc');
      $query->addField('tcc', 'field_ciiu_code_value', 'ciiu');
      if ((int) $string === 0) {
        $query->condition('name', '%' . escapeLike($string) . '%', 'LIKE');
      }
      if ((int) $string > 0) {
        $query->condition('tcc.field_ciiu_code_value', '%' . escapeLike($string) . '%', 'LIKE');
      }
      $matches = array();
      $result = $query->execute()->fetchAll();
      foreach ($result as $row) {
        $matches[] = [
          'label' => $row->ciiu . ' - ' . $row->desc,
          'value' => $row->ciiu . ' - ' . $row->desc . ' (' . $row->tid . ')'
        ];
      }
    }
    return new JsonResponse($matches);
  }
}
