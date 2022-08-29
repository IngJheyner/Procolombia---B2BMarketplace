<?php

namespace Drupal\cp_core\Plugin\Field\FieldWidget;

use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\video_embed_field\ProviderManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\video_embed_field\Plugin\Field\FieldWidget\VideoTextfield;

/**
 * A widget to input video URLs.
 *
 * @FieldWidget(
 *   id = "cp_core_video_embed_with_preview",
 *   label = @Translation("CP Core: Video with preview"),
 *   field_types = {
 *     "video_embed_field"
 *   },
 * )
 */
class CpCoreVideoTextfield extends VideoTextfield implements ContainerFactoryPluginInterface {

  protected $providerManager;

  /**
   * VideoTextfield constructor.
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, array $third_party_settings, ProviderManagerInterface $provider_manager) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $third_party_settings);
    $this->providerManager = $provider_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['third_party_settings'],
      $container->get('video_embed_field.provider_manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'show_preview' => FALSE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = parent::settingsForm($form, $form_state);
    $elements['show_preview'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show a video preview'),
      '#default_value' => $this->getSetting('show_preview'),
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary[] = $this->getSetting('show_preview') ? $this->t('Show preview') : $this->t('No preview');
    $summary[] = $this->getSetting('show_preview') && $this->getSetting('max_width') ? $this->t('Max width: @width', ['@width' => $this->getSetting('max_width')]) : NULL;
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    /** @var \Drupal\Core\Field\FieldItemInterface $item */
    $item = $items[$delta];
    $field_name = $this->fieldDefinition->getName();
    // Build array of field's parents.
    $parents = array_merge($element['#field_parents'], [
      $field_name,
      $delta,
      'value',
    ]);

    $element['value'] = $element + [
      '#type' => 'textfield',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
      '#size' => 60,
      '#maxlength' => $this->getFieldSetting('max_length'),
      '#attributes' => ['class' => ['js-text-full', 'text-full']],
      '#allowed_providers' => $this->getFieldSetting('allowed_providers'),
    ];

    if ($this->getSetting('show_preview')) {
      // Attach ajax settings to element.
      $tempParents = array_merge($element['#field_parents'], [
        $field_name,
        $delta,
      ]);
      $element['preview_button'] = [
        '#type' => 'submit',
        '#value' => $this->t('Add'),
        '#limit_validation_errors' => [$tempParents],
        '#name' => "add_preview-" . $field_name,
        '#submit' => [[CpCoreVideoTextfield::class,'ajaxRefreshEmbedCodeSubmit']],
        '#ajax' => [
          'callback' => [$this, 'ajaxRefreshEmbedCode'],
          'event' => 'click',
          'options' => [
            'query' => [
              'element_parents' => implode('/', $parents),
            ],
          ],
        ],
      ];

      // First check if form state value is set.
      if (!$value = NestedArray::getValue($form_state->getValues(), $parents)) {
        // If not, use default value of element.
        $value = !empty($item->getValue()['value']) ? $item->getValue()['value'] : NULL;
      }
      // Add a preview container to the element.
      $element['preview'] = $this->renderPreviewElement($value, $this->generateVideoEmbedId($parents), $field_name);
    }
    return $element;
  }

  /**
   * Ajax callback to refresh embed code.
   *
   * @param array $form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state object.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   The ajax response object.
   */
  public function ajaxRefreshEmbedCode(array $form, FormStateInterface $form_state, Request $request) {
    $response = new AjaxResponse();
    $form_parents = explode('/', $request->query->get('element_parents'));
    $values = $form_state->getValues();
    $value = NestedArray::getValue($values, $form_parents);
    $field_name = reset($form_parents);
    $video_embed_id = $this->generateVideoEmbedId($form_parents);
    $element = $this->renderPreviewElement($value, $video_embed_id, $field_name, TRUE);
    $response->addCommand(new ReplaceCommand('.video-embed-with-preview[data-video-embed-id="' . $video_embed_id . '"]', $element));
    return $response;
  }

  /**
   * Returns render element for video preview.
   *
   * @param $value
   *   The field value.
   * @param $video_embed_id
   *   The unique video embed id.
   *
   * @return array
   *   The render array of the preview element.
   */
  protected function renderPreviewElement($value, $video_embed_id, $field_name, $withValue = FALSE) {
    $classes = ['video-embed-with-preview', str_replace('_', '-', $field_name)];
    if ($withValue) {
      $classes += ['video-embed-preview'];
    }
    $element = [
      '#type' => 'container',
      '#attached' => ['library' => [
        'video_embed_field/responsive-video',
        'cp_core/video_embed_preview',
      ]],
      '#attributes' => [
        'class' => $classes,
        'data-video-embed-id' => $video_embed_id,
      ],
      '#weight' => -9,
    ];
    if ($withValue) {
      $element['close'] = [
        '#type' => 'html_tag',
        '#tag' => 'a',
        '#value' => 'close',
        '#attributes' => ['class' => ['remove-remote-video-value'], 'href' => '#'],
      ];
    }

    if (!empty($value)) {
      // Try to load provider.
      if ($provider = $this->providerManager->loadProviderFromInput($value)) {
        // Render embed code and attach it.
        $element['embed_code'] = $provider->renderEmbedCode(0, 0, FALSE);
      }
    }
    else {
      // We need this class to remove padding on responsive video.
      $element['#attributes']['class'][] = 'video-embed-preview-empty';
    }

    return $element;
  }

  /**
   * Generates unique id.
   *
   * @param array $parents
   *   The array of parents of the video embed field.
   *
   * @return string
   *   The generated id.
   */
  protected function generateVideoEmbedId(array $parents) {
    $video_embed_id = array_map(function ($parent) {
      return (is_numeric($parent)) ? $parent : Html::cleanCssIdentifier($parent);
    }, $parents);

    return implode('-', $video_embed_id);
  }

  public static function ajaxRefreshEmbedCodeSubmit(&$form, FormStateInterface $form_state) {
    // Do not nothing.
  }

}
