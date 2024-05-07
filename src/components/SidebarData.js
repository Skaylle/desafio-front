import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: 'Impostos',
        path: '/tax',
        icon: <FaIcons.FaFileAlt  />,
        cName: 'nav-text'
    },
    {
        title: 'Tipo Produtos',
        path: '/product-type',
        icon: <FaIcons.FaPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Produtos',
        path: '/product',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Vendas',
        path: '/transaction',
        icon: <FaIcons.FaShoppingCart  />,
        cName: 'nav-text'
    },
];