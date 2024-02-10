<?php

namespace Drupal\cp_core\Plugin\views\argument_default;

use Drupal\Core\Cache\CacheableDependencyInterface;
use Drupal\views\Plugin\views\argument_default\ArgumentDefaultPluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * Default argument plugin to extract a node.
 *
 * @ViewsArgumentDefault(
 * id = "cp_core_current_company",
 * title = @Translation("CP Core: Current Company NID from current user.")
 * )
 */
class CpCoreCurrentCompany extends ArgumentDefaultPluginBase implements CacheableDependencyInterface {

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $account;

  /**
   * Constructs a new User instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Session\AccountProxyInterface $account
   *   The current user.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, AccountProxyInterface $account) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->account = $account;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_user')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getArgument() {
    $CpCoreController = new CpCoreController();
    $company_nid = $CpCoreController->_cp_core_get_company_nid_by_user($this->account->id());
    if (!empty($company_nid) && is_numeric($company_nid)) {
      return $company_nid;
    }
    return '';
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheMaxAge() {
    return 0;
  }

 /**
  *
  * {@inheritdoc}
  *
  */
  public function getCacheContexts() {
    return [
      'user'
    ];
   }

}
