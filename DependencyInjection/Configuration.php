<?php

namespace Rz\DoctrineORMAdminBundle\DependencyInjection;


use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('rz_doctrine_orm_admin');
        $this->addAdminTemplates($rootNode);
        return $treeBuilder;
    }

    /**
     * @param \Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition $node
     *
     * @return void
     */
    private function addAdminTemplates(ArrayNodeDefinition $node)
    {
        $node
            ->children()
                ->scalarNode('entity_manager')->defaultNull()->end()
                ->arrayNode('templates')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('form')
                            ->prototype('scalar')->end()
                            ->defaultValue(array('SonataDoctrineORMAdminBundle:Form:form_admin_fields.html.twig'))
                        ->end()
                        ->arrayNode('filter')
                            ->prototype('scalar')->end()
                            ->defaultValue(array('SonataDoctrineORMAdminBundle:Form:filter_admin_fields.html.twig'))
                        ->end()
                        ->arrayNode('types')
                            ->children()
                                ->arrayNode('list')
                                    ->useAttributeAsKey('name')
                                    ->prototype('scalar')->end()
                                ->end()
                                ->arrayNode('show')
                                    ->useAttributeAsKey('name')
                                    ->prototype('scalar')->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;
    }

}
