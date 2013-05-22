<?php

namespace Rz\DoctrineORMAdminBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Rz\DoctrineORMAdminBundle\DependencyInjection\Compiler\OverrideCompilerPass;

class RzDoctrineORMAdminBundle extends Bundle
{
    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return 'SonataDoctrineORMAdminBundle';
    }

    /**
     * {@inheritDoc}
     */
    public function build(ContainerBuilder $container)
    {
        //$container->addCompilerPass(new TemplateCompilerPass());
        $container->addCompilerPass(new OverrideCompilerPass());
    }
}
