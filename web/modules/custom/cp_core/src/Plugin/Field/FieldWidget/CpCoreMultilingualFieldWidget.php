<?php

namespace Drupal\cp_core\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\mfd\Plugin\Field\FieldWidget\MultilingualFormDisplayWidget;

/**
 * Plugin implementation of the 'multilingual_form_display_widget' widget.
 *
 * @FieldWidget(
 *   id = "cp_core_multilingual_field_widget",
 *   label = @Translation("CP Core: Multilingual Form Display"),
 *   field_types = {
 *     "multilingual_form_display"
 *   },
 * )
 */
class CpCoreMultilingualFieldWidget extends MultilingualFormDisplayWidget {

  /**
   * Massage Form Values to prevent Primitive Type validation error.
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    return NULL;
  }

}
