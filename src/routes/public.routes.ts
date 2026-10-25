export const PUBLIC_ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  BROWSE_DETAILS: (id: string) => `/browse/${id}`,
  ROOM_DETAILS: (propertyId: string, roomId: string) => `/browse/${propertyId}/rooms/${roomId}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  HOW_IT_WORKS: "/how-it-works",
  FOR_TENANTS: "/for-tenants",
  FOR_OWNERS: "/for-owners",
} as const;
