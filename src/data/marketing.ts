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

export const STATS = [
  { label: "Active listings", value: 1240, suffix: "+" },
  { label: "Verified owners", value: 486, suffix: "" },
  { label: "Happy tenants", value: 3820, suffix: "+" },
  { label: "Dhaka areas covered", value: 24, suffix: "" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  { title: "Search", body: "Filter by area, budget and room type. Every owner is KYC-verified before a listing goes live.", icon: "Search" },
  { title: "Visit", body: "Request a viewing slot that suits you. The owner confirms, you get a notification.", icon: "CalendarCheck" },
  { title: "Apply", body: "Send one application with your move-in date. Track it from pending to approved.", icon: "FileText" },
  { title: "Move in", body: "Sign your lease digitally, pay your deposit with bKash and get your keys.", icon: "KeyRound" },
] as const;

export const FEATURES = [
  { title: "KYC-verified owners", body: "Owners upload their NID and ownership proof. Our team reviews every submission before a listing can be published.", icon: "ShieldCheck", span: "lg:col-span-2" },
  { title: "Rent and deposit with bKash", body: "Pay in a few taps and keep a receipt with the transaction ID.", icon: "Wallet", span: "" },
  { title: "Utility bill splitting", body: "Owners enter one bill. Each person sees their share and pays it.", icon: "Receipt", span: "" },
  { title: "Maintenance tickets", body: "Report a problem with a photo and watch it move from open to resolved.", icon: "Wrench", span: "" },
  { title: "Digital leases", body: "Dates, deposit, monthly rent and house rules in one place you can open any time.", icon: "FileSignature", span: "" },
  { title: "Notifications that matter", body: "Viewing confirmed, rent due, ticket updated. Nothing else.", icon: "BellRing", span: "lg:col-span-2" },
] as const;

export const TESTIMONIALS = [
  { name: "Nusrat Jahan", role: "Graduate student · Dhanmondi", quote: "I matched with a flatmate who also studies late and keeps the kitchen clean. We haven't had a single argument about chores.", rating: 5 },
  { name: "Tanvir Hasan", role: "Marketing executive · Banani", quote: "Paying rent through bKash and getting the receipt instantly saves me the monthly back-and-forth with the landlord.", rating: 5 },
  { name: "Kamal Uddin", role: "Property owner · 9 listings", quote: "The utility split preview is what sold me. I enter the bill, everyone sees their share, and no one has to chase anyone.", rating: 5 },
  { name: "Farhana Akter", role: "UI designer · Uttara", quote: "I could filter by a quiet household and early sleepers. The viewing was already booked by the time I got home.", rating: 4 },
  { name: "Habibur Rahman", role: "Property manager", quote: "Maintenance tickets with photos mean I know what to bring before I arrive. Fewer wasted trips across the city.", rating: 5 },
  { name: "Mahmudul Karim", role: "Product manager · Gulshan", quote: "Knowing the owner was verified made me comfortable paying a deposit online for the first time.", rating: 5 },
] as const;

export const FAQS = [
  { q: "How does NestHive verify owners?", a: "Owners submit their NID (front and back) and a proof of ownership. An admin reviews the documents and approves or rejects the submission with a reason. Listings can only be published after approval." },
  { q: "How do I pay rent and deposit?", a: "Through bKash. Open the payment from your dashboard, confirm the amount, enter your bKash PIN and the one-time code. You get a receipt with the transaction ID." },
  { q: "What is roommate matching?", a: "You answer eight short questions about sleep, cleanliness, smoking, pets, guests, noise, budget and preferences. We compare them with other renters and show a compatibility score and the traits you share." },
  { q: "Can I visit a room before applying?", a: "Yes. Request a viewing on any room page by picking a date and a time slot. The owner approves or declines and you get a notification." },
  { q: "How are utility bills split?", a: "The owner or manager enters the bill type, month and total. NestHive divides it equally between current occupants and each person pays their own share." },
  { q: "What happens if something breaks?", a: "Open a maintenance ticket with a short description, a priority and an optional photo. The manager updates the status as work progresses, and you are notified at each step." },
  { q: "Can I end my lease early?", a: "You can terminate from the My lease page. Your lease terms state the notice period, usually 30 days. The owner is notified right away." },
  { q: "Is NestHive free for tenants?", a: "Browsing, viewing requests, applications and roommate matching are free for tenants." },
] as const;

export const TRUST_POINTS = [
  { label: "Verified owners", icon: "BadgeCheck" },
  { label: "bKash payments", icon: "Wallet" },
  { label: "Roommate matching", icon: "Users" },
] as const;

export const TEAM = [
  { name: "Tahmina Akter", role: "Head of operations" },
  { name: "Md. Sakib Rahman", role: "Product" },
  { name: "Nabila Chowdhury", role: "Owner success" },
  { name: "Fahim Ahmed", role: "Engineering" },
] as const;
