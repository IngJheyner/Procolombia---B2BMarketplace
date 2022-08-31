<?php

namespace Drupal\cp_core;

use Drupal;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Security\TrustedCallbackInterface;
use Drupal\Core\Render\Element;

/**
 * Static methods for fieldgroup formatters.
 */
class CpCoreMultiStepHelper implements TrustedCallbackInterface {

  /**
   * Process callback for field groups.
   *
   * @param array $element
   *   Form that is being processed.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   * @param array $form
   *   The complete form structure.
   *
   * @return array
   */
  public static function formProcess(array &$element, FormStateInterface $form_state = NULL, array &$form = []) {
    self::addClassRecursive($element);
    return $element;
  }

/**
 * Recursive function to add clases.
 */
public static function addClassRecursive(&$form, &$element = [], $parent = [], $key = NULL) {
  if (empty($element)) {
    // La primera vez incializamos los valores.
    $element = &$form;
    $parent = &$form;
  }
  elseif ($key != NULL && strrpos($key, 'group_', -strlen($key)) !== FALSE) {
    // Si es un grupo de campos nos quedamos con el como padre porque el modulo
    // group no lleva la jerarquia en #array_parents.
    $parent = &$element;
  }
  foreach (Element::children($element) as $key) {
    $children = &$element[$key];

    if (isset($children['#custom_class'])) {
      $apply_element = &$children;
      if (isset($children['#array_parents'][0]) && isset($parent[$children['#array_parents'][0]])) {
        $apply_element = &$parent[$children['#array_parents'][0]];
      }
      $apply_element['#attributes']['class'][] = $children['#custom_class'];
    }

    // We will execute it to over the childs.
    self::addClassRecursive($form, $children, $parent, $key);
  }
}


  /**
   * {@inheritdoc}
   */
  public static function trustedCallbacks() {
    return ['formProcess'];
  }


}
