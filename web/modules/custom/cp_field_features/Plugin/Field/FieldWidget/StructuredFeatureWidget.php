<?php

namespace Drupal\link\Plugin\Field\FieldWidget;

use Drupal\Core\Url;
use Drupal\Core\Entity\Element\EntityAutocomplete;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\link\LinkItemInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationListInterface;

/**
 * Plugin implementation of the 'structured_feature' widget.
 *
 * @FieldWidget(
 *   id = "sf_default",
 *   label = @Translation("Default"),
 *   field_types = {
 *     "structured_feature"
 *   }
 * )
 */
class StructuredFeatureWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'placeholder_value' => '',
    ] + parent::defaultSettings();
  }


  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    /** @var \Drupal\link\LinkItemInterface $item */
    $item = $items[$delta];

    $element['uri'] = [
      '#type' => 'url',
      '#title' => $this->t('URL'),
      '#placeholder' => $this->getSetting('placeholder_url'),
      // The current field value could have been entered by a different user.
      // However, if it is inaccessible to the current user, do not display it
      // to them.
      '#default_value' => (!$item->isEmpty() && (\Drupal::currentUser()->hasPermission('link to any page') || $item->getUrl()->access())) ? static::getUriAsDisplayableString($item->uri) : NULL,
      '#element_validate' => [[static::class, 'validateUriElement']],
      '#maxlength' => 2048,
      '#required' => $element['#required'],
      '#link_type' => $this->getFieldSetting('link_type'),
    ];

    // If the field is configured to support internal links, it cannot use the
    // 'url' form element and we have to do the validation ourselves.
    if ($this->supportsInternalLinks()) {
      $element['uri']['#type'] = 'entity_autocomplete';
      // @todo The user should be able to select an entity type. Will be fixed
      //   in https://www.drupal.org/node/2423093.
      $element['uri']['#target_type'] = 'node';
      // Disable autocompletion when the first character is '/', '#' or '?'.
      $element['uri']['#attributes']['data-autocomplete-first-character-blacklist'] = '/#?';

      // The link widget is doing its own processing in
      // static::getUriAsDisplayableString().
      $element['uri']['#process_default_value'] = FALSE;
    }

    // If the field is configured to allow only internal links, add a useful
    // element prefix and description.
    if (!$this->supportsExternalLinks()) {
      $element['uri']['#field_prefix'] = rtrim(Url::fromRoute('<front>', [], ['absolute' => TRUE])->toString(), '/');
      $element['uri']['#description'] = $this->t('This must be an internal path such as %add-node. You can also start typing the title of a piece of content to select it. Enter %front to link to the front page. Enter %nolink to display link text only. Enter %button to display keyboard-accessible link text only.', ['%add-node' => '/node/add', '%front' => '<front>', '%nolink' => '<nolink>', '%button' => '<button>']);
    }
    // If the field is configured to allow both internal and external links,
    // show a useful description.
    elseif ($this->supportsExternalLinks() && $this->supportsInternalLinks()) {
      $element['uri']['#description'] = $this->t('Start typing the title of a piece of content to select it. You can also enter an internal path such as %add-node or an external URL such as %url. Enter %front to link to the front page. Enter %nolink to display link text only. Enter %button to display keyboard-accessible link text only.', ['%front' => '<front>', '%add-node' => '/node/add', '%url' => 'http://example.com', '%nolink' => '<nolink>', '%button' => '<button>']);
    }
    // If the field is configured to allow only external links, show a useful
    // description.
    elseif ($this->supportsExternalLinks() && !$this->supportsInternalLinks()) {
      $element['uri']['#description'] = $this->t('This must be an external URL such as %url.', ['%url' => 'http://example.com']);
    }

    // Make uri required on the front-end when title filled-in.
    if (!$this->isDefaultValueWidget($form_state) && $this->getFieldSetting('title') !== DRUPAL_DISABLED && !$element['uri']['#required']) {
      $parents = $element['#field_parents'];
      $parents[] = $this->fieldDefinition->getName();
      $selector = $root = array_shift($parents);
      if ($parents) {
        $selector = $root . '[' . implode('][', $parents) . ']';
      }

      $element['uri']['#states']['required'] = [
        ':input[name="' . $selector . '[' . $delta . '][title]"]' => ['filled' => TRUE],
      ];
    }

    $element['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Link text'),
      '#placeholder' => $this->getSetting('placeholder_title'),
      '#default_value' => $items[$delta]->title ?? NULL,
      '#maxlength' => 255,
      '#access' => $this->getFieldSetting('title') != DRUPAL_DISABLED,
      '#required' => $this->getFieldSetting('title') === DRUPAL_REQUIRED && $element['#required'],
    ];
    // Post-process the title field to make it conditionally required if URL is
    // non-empty. Omit the validation on the field edit form, since the field
    // settings cannot be saved otherwise.
    //
    // Validate that title field is filled out (regardless of uri) when it is a
    // required field.
    if (!$this->isDefaultValueWidget($form_state) && $this->getFieldSetting('title') === DRUPAL_REQUIRED) {
      $element['#element_validate'][] = [static::class, 'validateTitleElement'];
      $element['#element_validate'][] = [static::class, 'validateTitleNoLink'];

      if (!$element['title']['#required']) {
        // Make title required on the front-end when URI filled-in.

        $parents = $element['#field_parents'];
        $parents[] = $this->fieldDefinition->getName();
        $selector = $root = array_shift($parents);
        if ($parents) {
          $selector = $root . '[' . implode('][', $parents) . ']';
        }

        $element['title']['#states']['required'] = [
          ':input[name="' . $selector . '[' . $delta . '][uri]"]' => ['filled' => TRUE],
        ];
      }
    }

    // Ensure that a URI is always entered when an optional title field is
    // submitted.
    if (!$this->isDefaultValueWidget($form_state) && $this->getFieldSetting('title') == DRUPAL_OPTIONAL) {
      $element['#element_validate'][] = [static::class, 'validateTitleNoLink'];
    }

    // Exposing the attributes array in the widget is left for alternate and more
    // advanced field widgets.
    $element['options']['attributes'] = [
      '#type' => 'value',
      '#tree' => TRUE,
      '#value' => !empty($items[$delta]->options['attributes']) ? $items[$delta]->options['attributes'] : [],
      '#attributes' => ['class' => ['link-field-widget-attributes']],
    ];

    // If cardinality is 1, ensure a proper label is output for the field.
    if ($this->fieldDefinition->getFieldStorageDefinition()->getCardinality() == 1) {
      // If the link title is disabled, use the field definition label as the
      // title of the 'uri' element.
      if ($this->getFieldSetting('title') == DRUPAL_DISABLED) {
        $element['uri']['#title'] = $element['#title'];
        // By default the field description is added to the title field. Since
        // the title field is disabled, we add the description, if given, to the
        // uri element instead.
        if (!empty($element['#description'])) {
          if (empty($element['uri']['#description'])) {
            $element['uri']['#description'] = $element['#description'];
          }
          else {
            // If we have the description of the type of field together with
            // the user provided description, we want to make a distinction
            // between "core help text" and "user entered help text". To make
            // this distinction more clear, we put them in an unordered list.
            $element['uri']['#description'] = [
              '#theme' => 'item_list',
              '#items' => [
                // Assume the user-specified description has the most relevance,
                // so place it first.
                $element['#description'],
                $element['uri']['#description'],
              ],
            ];
          }
        }
      }
      // Otherwise wrap everything in a details element.
      else {
        $element += [
          '#type' => 'fieldset',
        ];
      }
    }

    return $element;
  }

  /**
   * Special handling to create form elements for multiple values.
   *
   * Handles generic features for multiple fields:
   * - number of widgets
   * - AHAH-'add more' button
   * - table display and drag-n-drop value reordering
   */
  protected function formMultipleElements(FieldItemListInterface $items, array &$form, FormStateInterface $form_state) {
    $sf = [];
    $sf['prod_090111'] = [
      'type' => 'product',
      'part' => '090111',
      ''

    ];

    $delta = $this->getSetting('delta_limit');
    if (count($items) < $delta) {
      for ($i = count($items); $i < $delta; $i++) {
        $items->appendItem();
      }
    }
    if (count($items) > $delta) {
      for ($i = count($items); $i > $delta; $i--) {
        $items->removeItem($i);
      }
    }
    $field_name = $this->fieldDefinition->getName();
    $parents = $form['#parents'];

    // Load the items for form rebuilds from the field state as they might not
    // be in $form_state->getValues() because of validation limitations. Also,
    // they are only passed in as $items when editing existing entities.
    $field_state = static::getWidgetState($parents, $field_name, $form_state);
    if (isset($field_state['items'])) {
      $field_state['items_count'] = $delta;
      for ($i = 0; $i < $delta; $i++) {
        if (!isset($field_state['items'][$i])) {
          $field_state['items'][] = [];
        }
      }
      if (count($field_state['items']) > $delta) {
        for ($i = count($items); $i > $delta; $i--) {
          if(isset($field_state['items'][$i])) {
            unset($field_state['items'][$i]);
          }
        }
      }
      $items->setValue($field_state['items']);
    }

    $cardinality = $this->fieldDefinition->getFieldStorageDefinition()->getCardinality();
    $parents = $form['#parents'];

    // Determine the number of widgets to display.
    switch ($cardinality) {
      case FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED:
        $field_state = static::getWidgetState($parents, $field_name, $form_state);
        $max = $field_state['items_count'];
        $is_multiple = TRUE;
        break;

      default:
        $max = $cardinality - 1;
        $is_multiple = ($cardinality > 1);
        break;
    }

    $title = $this->fieldDefinition->getLabel();
    $description = $this->getFilteredDescription();

    $elements = [];

    for ($delta = 0; $delta <= $max; $delta++) {
      // Add a new empty item if it doesn't exist yet at this delta.
      if (!isset($items[$delta])) {
        $items->appendItem();
      }

      // For multiple fields, title and description are handled by the wrapping
      // table.
      if ($is_multiple) {
        $element = [
          '#title' => $this->t('@title (value @number)', ['@title' => $title, '@number' => $delta + 1]),
          '#title_display' => 'invisible',
          '#description' => '',
        ];
      }
      else {
        $element = [
          '#title' => $title,
          '#title_display' => 'before',
          '#description' => $description,
        ];
      }

      $element = $this->formSingleElement($items, $delta, $element, $form, $form_state);

      if ($element) {
        // Input field for the delta (drag-n-drop reordering).
        if ($is_multiple) {
          // We name the element '_weight' to avoid clashing with elements
          // defined by widget.
          $element['_weight'] = [
            '#type' => 'weight',
            '#title' => $this->t('Weight for row @number', ['@number' => $delta + 1]),
            '#title_display' => 'invisible',
            // Note: this 'delta' is the FAPI #type 'weight' element's property.
            '#delta' => $max,
            '#default_value' => $items[$delta]->_weight ?: $delta,
            '#weight' => 100,
          ];
        }

        $elements[$delta] = $element;
      }
    }

    if ($elements) {
      $elements += [
        '#theme' => 'field_multiple_value_form',
        '#field_name' => $field_name,
        '#cardinality' => $cardinality,
        '#cardinality_multiple' => $this->fieldDefinition->getFieldStorageDefinition()->isMultiple(),
        '#required' => $this->fieldDefinition->isRequired(),
        '#title' => $title,
        '#description' => $description,
        '#max_delta' => $max,
      ];

    }

    return $elements;
  }


  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    return $values;
  }

}
