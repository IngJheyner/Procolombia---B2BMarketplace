<?php
namespace Drupal\cp_advisor_moderation\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Plugin implementation of the 'field_advisor_moderation_text' widget.
 *
 * @FieldWidget(
 *   id = "field_advisor_moderation_text",
 *   module = "cp_advisor_moderation",
 *   label = @Translation("Custom Widget text"),
 *   field_types = {
 *     "string",
 *     "entity_reference"
 *   }
 * )
 */
class TextWidget extends WidgetBase {
  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
  }

}
