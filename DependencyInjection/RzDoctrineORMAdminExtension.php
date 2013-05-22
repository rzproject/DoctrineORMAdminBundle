<?php

namespace Rz\DoctrineORMAdminBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class RzDoctrineORMAdminExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configs = $this->fixTemplatesConfiguration($configs, $container);
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('doctrine_orm_filter_type.xml');
        $container->setParameter('rz_doctrine_orm_admin.templates', $config['templates']);
        $container->setParameter('sonata_doctrine_orm_admin.templates', $config['templates']);

        // merge RzFieldTypeBundle to RzAdminBundle
        $container->setParameter('twig.form.resources',
                                 array_merge(
                                     $container->getParameter('twig.form.resources'),
                                     array('RzDoctrineORMAdminBundle:Form:form_admin_fields.html.twig')
                                 ));

    }
    /**
     * @param array            $configs
     * @param ContainerBuilder $container
     *
     * @return array
     */
    private function fixTemplatesConfiguration(array $configs, ContainerBuilder $container)
    {
        $defaultConfig = array(
            'templates' => array(
                'types' => array(
                    'list' => array(
                        'array'        => 'SonataAdminBundle:CRUD:list_array.html.twig',
                        'boolean'      => 'RzAdminBundle:CRUD:list_boolean.html.twig',
                        'date'         => 'SonataAdminBundle:CRUD:list_date.html.twig',
                        'time'         => 'SonataAdminBundle:CRUD:list_time.html.twig',
                        'datetime'     => 'SonataAdminBundle:CRUD:list_datetime.html.twig',
                        'text'         => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'trans'        => 'SonataAdminBundle:CRUD:list_trans.html.twig',
                        'string'       => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'smallint'     => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'bigint'       => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'integer'      => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'decimal'      => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'identifier'   => 'SonataAdminBundle:CRUD:list_string.html.twig',
                        'currency'     => 'SonataAdminBundle:CRUD:list_currency.html.twig',
                        'percent'      => 'SonataAdminBundle:CRUD:list_percent.html.twig',
                    ),
                    'show' => array(
                        'array'        => 'SonataAdminBundle:CRUD:show_array.html.twig',
                        'boolean'      => 'RzAdminBundle:CRUD:show_boolean.html.twig',
                        'date'         => 'SonataAdminBundle:CRUD:show_date.html.twig',
                        'time'         => 'SonataAdminBundle:CRUD:show_time.html.twig',
                        'datetime'     => 'SonataAdminBundle:CRUD:show_datetime.html.twig',
                        'text'         => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'trans'        => 'SonataAdminBundle:CRUD:show_trans.html.twig',
                        'string'       => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'smallint'     => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'bigint'       => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'integer'      => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'decimal'      => 'SonataAdminBundle:CRUD:base_show_field.html.twig',
                        'currency'     => 'SonataAdminBundle:CRUD:base_currency.html.twig',
                        'percent'      => 'SonataAdminBundle:CRUD:base_percent.html.twig',
                    )
                )
            )
        );

        // let's add some magic, only overwrite template if the SonataIntlBundle is enabled
        $bundles = $container->getParameter('kernel.bundles');
        if (isset($bundles['SonataIntlBundle'])) {
            $defaultConfig['templates']['types']['list'] = array_merge($defaultConfig['templates']['types']['list'], array(
                                                                                                                       'date'         => 'SonataIntlBundle:CRUD:list_date.html.twig',
                                                                                                                       'datetime'     => 'SonataIntlBundle:CRUD:list_datetime.html.twig',
                                                                                                                       'smallint'     => 'SonataIntlBundle:CRUD:list_decimal.html.twig',
                                                                                                                       'bigint'       => 'SonataIntlBundle:CRUD:list_decimal.html.twig',
                                                                                                                       'integer'      => 'SonataIntlBundle:CRUD:list_decimal.html.twig',
                                                                                                                       'decimal'      => 'SonataIntlBundle:CRUD:list_decimal.html.twig',
                                                                                                                       'currency'     => 'SonataIntlBundle:CRUD:list_currency.html.twig',
                                                                                                                       'percent'      => 'SonataIntlBundle:CRUD:list_percent.html.twig',
                                                                                                                   ));

            $defaultConfig['templates']['types']['show'] = array_merge($defaultConfig['templates']['types']['show'], array(
                                                                                                                       'date'         => 'SonataIntlBundle:CRUD:show_date.html.twig',
                                                                                                                       'datetime'     => 'SonataIntlBundle:CRUD:show_datetime.html.twig',
                                                                                                                       'smallint'     => 'SonataIntlBundle:CRUD:show_decimal.html.twig',
                                                                                                                       'bigint'       => 'SonataIntlBundle:CRUD:show_decimal.html.twig',
                                                                                                                       'integer'      => 'SonataIntlBundle:CRUD:show_decimal.html.twig',
                                                                                                                       'decimal'      => 'SonataIntlBundle:CRUD:show_decimal.html.twig',
                                                                                                                       'currency'     => 'SonataIntlBundle:CRUD:show_currency.html.twig',
                                                                                                                       'percent'      => 'SonataIntlBundle:CRUD:show_percent.html.twig',
                                                                                                                   ));
        }

        array_unshift($configs, $defaultConfig);

        return $configs;
    }

}
