<?php

namespace Drupal\cp_core\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\mfd\Plugin\Field\FieldWidget\MultilingualFormDisplayWidget;
use Drupal\node\NodeInterface;
use Drupal\Core\Field\FieldItemListInterface;

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
   * Collect translation field widgets.
   *
   * Collect widgets, assign them values and add them to our tree.
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {

    $current_user = $this->account;
    if (!$current_user->hasPermission('edit multilingual form')) {
      return $element;
    }

    $form_object = $form_state->getFormObject();
    $entity = $form_object->getEntity();

    $current_language = $entity->language()->getId();

    // If ($entity instanceof FieldConfigInterface) {
    //
    // }.
    if ($entity instanceof NodeInterface) {

      $entity_type_id = $entity->getEntityTypeId();
      $entity_type = $this->entityTypeManager->getDefinition($entity_type_id);
      $form_display = $form_state->getStorage('entity_form_display')['form_display'];

      $element += [
        '#type' => 'container',
        '#tree' => TRUE,
        '#weight' => 1,
        '#description_display' => 'before',
      ];

      if (empty($this->getSetting('display_label'))) {
        unset($element['#title']);
      }

      if (empty($this->getSetting('display_description'))) {
        unset($element['#description']);
      }

      $available_langcodes = ($this->languageManager->getLanguages());
      unset($available_langcodes[$current_language]);

      $selected_languages = $this->getSetting('mfd_languages');

      if (array_key_exists($current_language, array_flip($selected_languages))) {
        $default_language = $this->languageManager->getDefaultLanguage()->getId();
        unset($selected_languages[$current_language]);
        $selected_languages[$default_language] = $default_language;
      }

      $available_langcodes = array_intersect_key($available_langcodes, array_flip($selected_languages));
      reset($available_langcodes);

      $first_language = key($available_langcodes);

      // Iterate languages and add any translations we don't already have.
      foreach ($available_langcodes as $langcode => $language) {

        $form_state->set('language', $language);
        $language_name = $language->getName();

        if ($entity->hasTranslation($langcode)) {
          $translated_entity = $entity->getTranslation($langcode);
        }
        else {
          $translated_entity = $entity->addTranslation($langcode, [
            'title' => 'untitled',
          ]);

        }

        $this->translationManager->getTranslationMetadata($entity)->setSource($entity->language()->getId());

        $element['value'][$langcode] = [
          '#title' => '',
        ];

        // Create a form element to hold the entity's fields.
        $collapsible_state = $this->getSetting('collapsible_state');
        if ($collapsible_state == self::COLLAPSIBLE_STATE_NONE) {
          $element['value'][$langcode] += [
            '#type' => 'item',
          ];
        }
        else {

          $element['value'][$langcode] += [
            '#type' => 'details',
            '#open' => ($langcode === $first_language && $collapsible_state == self::COLLAPSIBLE_STATE_FIRST) || ($collapsible_state == self::COLLAPSIBLE_STATE_ALL_OPEN),
          ];
        }

        foreach ($translated_entity->getFieldDefinitions() as $field_name => $definition) {
          $storage_definition = $definition->getFieldStorageDefinition();

          if (($definition->isComputed() || (!empty($storage_definition)  && $this->isFieldTranslatabilityConfigurable($entity_type, $storage_definition))) && $definition->isTranslatable()) {

            $translated_items = $translated_entity->get($field_name);
            $translated_items->filterEmptyItems();
            $translated_form['#parents'] = [];
            $widget = $form_display->getRenderer($field_name);

            if (!is_null($widget)) {
              $field_name_with_ident = $this->getUniqueName($field_name, $langcode);
              foreach ($form_state->get('language_values_' . $langcode) as $fn => $fv) {
                if ($fn == $field_name_with_ident) {
                  foreach ($fv as $delta => $dv) {
                    $translated_items->appendItem($dv);
                  }
                }
              }
              $component_form = $widget->form($translated_items, $translated_form, $form_state);
              // Avoid namespace collisions.
              $component_form['#field_name'] = $field_name_with_ident;
              $component_form['#multiform_display_use'] = TRUE;

              $component_form['widget']['#field_name'] = $field_name_with_ident;
              $parents_flipped = array_flip($component_form['widget']['#parents']);
              $component_form['widget']['#parents'][$parents_flipped[$field_name]] = $field_name_with_ident;
              if ($field_name == 'title' && $component_form['widget'][0]['value']['#default_value'] == 'untitled') {
                $component_form['widget'][0]['value']['#default_value'] = '';
                if (!empty($form_state->get('language_values_' . $langcode)['title_' . $langcode][0])) {
                  $component_form['widget'][0]['value']['#default_value'] = $form_state->get('language_values_' . $langcode)['title_' . $langcode][0];
                }
              }
              // Create a container for the entity's fields.
              $element['value'][$langcode][$field_name] = $component_form;
            }
          }
        }
      }
    }

    return $element;
  }

  /**
   * Massage Form Values to prevent Primitive Type validation error.
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    return NULL;
  }

}
