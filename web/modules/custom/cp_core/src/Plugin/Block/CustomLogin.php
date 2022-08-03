<?php

namespace Drupal\cp_core\Plugin\Block;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Url;


/**
* Provides a block with a simple text.
*
* @Block(
* id = "custom_login",
* admin_label = @Translation("Custom Login"),
* )
*/
class CustomLogin extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    // Implements same features that core module user
    $form = \Drupal::formBuilder()->getForm('Drupal\user\Form\UserLoginForm');

    unset($form['name']['#attributes']['autofocus']);
    unset($form['name']['#description']);
    unset($form['name']['#attributes']['aria-describedby']);
    unset($form['pass']['#description']);
    unset($form['pass']['#attributes']['aria-describedby']);
    $form['name']['#size'] = 15;
    $form['pass']['#size'] = 15;

    // Instead of setting an actual action URL, we set the placeholder, which
    // will be replaced at the very last moment. This ensures forms with
    // dynamically generated action URLs don't have poor cacheability.
    // Use the proper API to generate the placeholder, when we have one. See
    // https://www.drupal.org/node/2562341. The placeholder uses a fixed string
    // that is
    // Crypt::hashBase64('\Drupal\user\Plugin\Block\UserLoginBlock::build');
    // This is based on the implementation in
    // \Drupal\Core\Form\FormBuilder::prepareForm(), but the user login block
    // requires different behavior for the destination query argument.
    $placeholder = 'form_action_p_4r8ITd22yaUvXM6SzwrSe9rnQWe48hz9k1Sxto3pBvE';

    $form['#attached']['placeholders'][$placeholder] = [
      '#lazy_builder' => ['\Drupal\user\Plugin\Block\UserLoginBlock::renderPlaceholderFormAction', []],
    ];
    $form['#action'] = $placeholder;

    // Build action links.
    $items = [];
    $items['request_mail'] = [
      '#type' => 'link',
      '#title' => $this->t('Forgot your mail?'),
      '#url' => Url::fromRoute('cp_core.forgetMail', [], [
        'attributes' => [
          'title' => $this->t('Send password reset instructions via email.'),
          'class' => ['request-password-link'],
        ],
      ]),
    ];
    if (\Drupal::config('user.settings')->get('register') != \Drupal\user\UserInterface::REGISTER_ADMINISTRATORS_ONLY) {
      $items['create_account'] = [
        '#type' => 'link',
        '#title' => $this->t('You don’t have an account? Sign up.'),
        '#url' => Url::fromRoute('cp_core.registerUser', [], [
          'attributes' => [
            'title' => $this->t('Create a new user account.'),
            'class' => ['create-account-link'],
          ],
        ]),
      ];
    }
    $items['request_password'] = [
      '#type' => 'link',
      '#title' => $this->t('Forgot your password?'),
      '#url' => Url::fromRoute('cp_core.recoverPass', [], [
        'attributes' => [
          'title' => $this->t('Send password reset instructions via email.'),
          'class' => ['request-password-link'],
        ],
      ]),
    ];
    $markup = '<a class="link-close">xclose</a>';
    $markup .= '<p>'. $this->t('Sign in') .'</p>';

    return [
      '#markup' => $markup,
      'user_login_form' => $form,
      'user_links' => [
        '#theme' => 'item_list',
        '#items' => $items,
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function blockAccess(AccountInterface $account) {
    return AccessResult::allowedIfHasPermission($account, 'access content');
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['my_block_settings'] = $form_state->getValue('my_block_settings');
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheMaxAge() {
    return 0;
  }
}
