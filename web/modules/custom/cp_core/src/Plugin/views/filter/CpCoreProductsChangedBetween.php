<?php

namespace Drupal\cp_core\Plugin\views\filter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\filter\StringFilter;

/**
 * Filter by start and end date.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("cp_core_products_changed_between")
 */
class CpCoreProductsChangedBetween extends StringFilter {

  protected function defineOptions() {
    $options = parent::defineOptions();

    $options['value'] = [
      'contains' => [
        'min' => ['default' => ''],
        'max' => ['default' => ''],
      ],
    ];
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function valueForm(&$form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = 'cp_core/litepicker';

    $form['litepicker'] = [
      '#type' => 'textfield',
      '#title' => $this->options['expose']['label'],
      '#default_value' => NULL,
      '#required' => FALSE,
      '#attributes' => ['class' => ['litepicker-date']],

    ];
    $form['value']['#title'] = NULL;
    $form['value']['#tree'] = TRUE;
    $form['value']['min'] = [
      '#type' => 'hidden',
      '#default_value' => NULL,
      '#attributes' => ['class' => ['litepicker-start']],
    ];
    $form['value']['max'] = [
      '#type' => 'hidden',
      '#default_value' => NULL,
      '#attributes' => ['class' => ['litepicker-end']],
    ];
  }

  /**
   * Builds wrapper for value and operator forms.
   *
   * @param array $form
   *   The form.
   * @param string $wrapper_identifier
   *   The key to use for the wrapper element.
   */
  protected function buildValueWrapper(&$form, $wrapper_identifier) {
    // If both the field and the operator are exposed, this will end up being
    // called twice. We don't want to wipe out what's already there, so if it
    // exists already, do nothing.
    if (!isset($form[$wrapper_identifier])) {
      $form[$wrapper_identifier] = [
        '#type' => 'fieldset',
      ];
    }
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
    $this->ensureMyTable();

    /** @var \Drupal\views\Plugin\views\query\Sql $query */
    $query = $this->query;
    $table = array_key_first($query->tables);
    $start_date = (string) $this->value['min'];
    $end_date = (string) $this->value['max'];
    if (!empty($start_date)) {
      $first_day = strtotime($start_date . ' 00:00:00');
      $query->addWhere($this->options['group'], $table . '.changed', $first_day, '>=');
    }
    if (!empty($end_date)) {
      $second_day = strtotime($end_date . ' 23:59:59');
      $query->addWhere($this->options['group'], $table . '.changed', $second_day, '<=');
    }
  }

}
