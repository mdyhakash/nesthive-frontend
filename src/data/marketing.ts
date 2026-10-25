export const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "How it works", href: "/how-it-works" },
  { label: "For Owners", href: "/for-owners" },
  { label: "Roommate Matching", href: "/for-tenants#matching" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Renters",
    links: [
      { label: "Browse rooms", href: "/browse" },
      { label: "How it works", href: "/how-it-works" },
      { label: "For tenants", href: "/for-tenants" },
      { label: "Roommate matching", href: "/for-tenants#matching" },
    ],
  },
  {
    title: "Owners",
    links: [
      { label: "List your property", href: "/for-owners" },
      { label: "Owner verification", href: "/for-owners#verification" },
      { label: "Rent collection", href: "/for-owners#payments" },
      { label: "Register as owner", href: "/register?role=OWNER" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About NestHive", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Log in", href: "/login" },
    ],
  },
] as const;
