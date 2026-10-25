/** Unsplash placeholder photos (interiors). Loaded through next/image. */
const IDS = {
  living1: "1502672260266-1c1ef2d93688",
  living2: "1522708323590-d24dbb6b0267",
  living3: "1513694203232-719a280e022f",
  living4: "1586023492125-27b2c045efd7",
  living5: "1522771739844-6a9f6d5f14af",
  apt1: "1560448204-e02f11c3d0e2",
  apt2: "1493809842364-78817add7ffb",
  apt3: "1560185007-cde436f6a4d0",
  apt4: "1560185893-a55cbc8c57e8",
  kitchen1: "1556909114-f6e7ad7d3136",
  kitchen2: "1484154218962-a197022b5858",
  bed1: "1505691938895-1758d7feb511",
  bed2: "1536376072261-38c75010e6c9",
  bed3: "1555854877-bab0e564b8d5",
  bed4: "1540518614846-7eded433c457",
  bed5: "1616594039964-ae9021a400a0",
  loft: "1600210492486-724fe5c67fb0",
  house: "1512917774080-9991f1c4c750",
  modern: "1600585154340-be6161a56a0c",
  interior: "1618221195710-dd6b41faaea6",
} as const;

export type ImageKey = keyof typeof IDS;

export const img = (key: ImageKey, w = 1200) =>
  `https://images.unsplash.com/photo-${IDS[key]}?auto=format&fit=crop&w=${w}&q=70`;

export const gallery = (keys: ImageKey[], w = 1200) => keys.map((k) => img(k, w));

/** Tiny shimmer SVG used as next/image blurDataURL. */
export const blurDataURL =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiB2aWV3Qm94PSIwIDAgNzAwIDQ3NSI+PHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiNlN2U1ZGMiLz48L3N2Zz4=";
