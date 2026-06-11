import Link from "next/link";

const links = [
  {
    href: "/panel",
    label: "Dashboard",
  },
  {
    href: "/panel/products",
    label: "Products",
  },
  {
    href: "/panel/categories",
    label: "Categories",
  },
  {
    href: "/panel/subcategories",
    label: "Sub Categories",
  },
  {
    href: "/panel/blogs",
    label: "Blog",
  },
  {
    href: "/panel/news",
    label: "News",
  },
  {
    href: "/panel/articles",
    label: "Articles",
  },
  {
    href: "/panel/languages",
    label: "Languages",
  },
  {
    href: "/panel/price-ticker",
    label: "Price Ticker",
  },
  {
    href: "/panel/settings",
    label: "Settings",
  },
];

export function PanelSidebar() {
  return (
    <aside
      style={{
        width: 260,
        padding: 20,
        borderRight: "1px solid #ddd",
      }}
    >
      <h2>Admin Panel</h2>

      <nav>
        {links.map((item) => (
          <div key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
