import { History, Package, ShoppingCart, Users } from "lucide-react";

export const navItems = [
  {
    title: "PDV",
    subtitle: "Ponto de Venda",
    url: "/pdv",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    subtitle: "Gerenciamento de clientes",
    url: "/cliente",
    icon: Users,
  },
  {
    title: "Produtos",
    subtitle: "Gerenciamento de produtos",
    url: "/produto",
    icon: Package,
  },
  {
    title: "Histórico de Vendas",
    subtitle: "Histórico de vendas",
    url: "/historico",
    icon: History,
  },
];
