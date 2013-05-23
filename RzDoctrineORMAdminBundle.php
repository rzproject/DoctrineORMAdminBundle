<?php

/*
 * This file is part of the RzDoctrineORMAdminBundle package.
 *
 * (c) mell m. zamora <mell@rzproject.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
