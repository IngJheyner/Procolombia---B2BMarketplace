<?php

/**
 * @file
 * Contains \Drupal\cp_core\Form\SearchCategoriesModalForm.
 */

namespace Drupal\cp_core\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\views\Views;
use Drupal\Core\Url;

/**
 * Class SearchCategoriesModalForm.
 *
 * @package Drupal\modal\Form
 */
class SearchCategoriesModalForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'search_categories_modal_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = 'core/drupal.dialog.ajax';
    $form['message'] = [
      '#type' => 'markup',
      '#markup' => '<div id="result-message"></div>'
    ];
    $form['fields'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'search-fields',
          'row',
        ],
      ],
    ];
    $form['fields']['query'] = [
      '#type' => 'textfield',
      '#title' => $this->t('query'),
      '#title_display' => 'invisible',
      '#prefix' => "<div class='col-md-5'>",
      '#suffix' => "</div>",
      '#description' => $this->t('Example: computers or organic farming'),
      '#attributes' => [
        ' placeholder' => $this->t('what are you looking for?'),
      ],
    ];
    $form['fields']['or'] = [
      '#type' => 'markup',
      '#markup' => '<div class="col-md-2 text-center"><div id="or-search">'. $this->t('- or -') .'</div></div>'
    ];
    $form['fields']['tariff'] = [
      '#type' => 'entity_autocomplete',
      '#target_type' => 'taxonomy_term',
      '#description' => $this->t('Example: 009845635'),
      '#tags' => FALSE,
      // '#default_value' => $node,
      '#selection_handler' => 'default',
      '#selection_settings' => [
        'target_bundles' => ['partida_arancelaria'],
      ],
      '#maxlength' => 1024,
      '#prefix' => "<div class='col-md-5'>",
      '#suffix' => "</div>",
      '#attributes' => [
        ' placeholder' => $this->t('# tariff item'),
      ],
    ];
    $form['actions'] = [
      '#type' => 'actions',
      '#attributes' => [
        'class' => [
          'search-actions',
          'justify-content-center',
          'align-items-center',
          'row',
        ],
      ],
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Search'),
      '#ajax' => [ // here we add Ajax callback where we will process
        'callback' => '::open_modal',  // the data that came from the form and that we will receive as a result in the modal window
        'progress' => [
          'type' => 'throbber',
          'message' => NULL,
        ],
      ],
      '#prefix' => "<div class='col-md-12 justify-content-center align-items-center text-center'>",
      '#suffix' => "</div>",
    ];
    $form['actions']['reset'] = [
      '#type' => 'link',
      '#title' => $this->t('Restart search'),
      // Example of a Url object from a route. See the documentation
      // for more methods that may help generate a Url object.
      '#url' => Url::fromRoute('<front>'),
      '#prefix' => "<div class='col-md-12 justify-content-center align-items-center text-center'>",
      '#suffix' => "</div>",
    ];

    return $form;
  }
  function resetForm($form, &$form_state) {
    $form_state['rebuild'] = FALSE;
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  }
  // the callback itself
  public function open_modal(&$form, FormStateInterface $form_state) {
    $query = $form_state->getValue('query');
    $tariff = $form_state->getValue('tariff');
    $response = new AjaxResponse();
    if (isset($tariff) && !empty($tariff)) {
      $tariff_name = \Drupal\taxonomy\Entity\Term::load($tariff)->get('name')->value;
      $url='/search?tariff='. $tariff_name . ' (' . $tariff . ')'; /* The URL that will be loaded into window.location. This should be a full URL. */
      $response->addCommand(new RedirectCommand($url));
    }elseif (isset($query) && !empty($query)) {
      $view = Views::getView('cat_rela_busqueda_b2b_2021');
      $exposed_filters = ['query' => $query];
      $view->setExposedInput($exposed_filters);
      $view->execute('block_2');
      $view->preview('block_2');
      $title = $this->t('search options');
      $options = [
        'dialogClass' => 'popup-dialog-class',
        'width' => '900',
      ];
      $response->addCommand(new OpenModalDialogCommand($title, $view->render(), $options));
    }
    else {
      \Drupal::messenger()->addWarning($this->t('Please, give some search query word'));
      $message = [
        '#theme' => 'status_messages',
        '#message_list' => \Drupal::messenger()->all(),
      ];
      $messages = \Drupal::service('renderer')->render($message);
      $response->addCommand(new InvokeCommand('#edit-query', 'addClass', array('error')));
      $response->addCommand(new InvokeCommand('#edit-tariff', 'addClass', array('error')));
      $response->addCommand(new HtmlCommand('#result-message', $messages));
    }
    return $response;
  }
}
