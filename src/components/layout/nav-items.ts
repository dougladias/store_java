import { History, Package, ShoppingCart, Users } from "lucide-react";

export const navItems = [
  {
    title: "PDV",
    subtitle: "Ponto de Venda",
    tabLabel: "PDV",
    url: "/pdv",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    subtitle: "Gerenciamento de clientes",
    tabLabel: "Clientes",
    url: "/cliente",
    icon: Users,
  },
  {
    title: "Produtos",
    subtitle: "Gerenciamento de produtos",
    tabLabel: "Produtos",
    url: "/produto",
    icon: Package,
  },
  {
    title: "Histórico de Vendas",
    subtitle: "Histórico de vendas",
    tabLabel: "Histórico",
    url: "/historico",
    icon: History,
  },
];
