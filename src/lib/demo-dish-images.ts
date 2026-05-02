export type DemoDishImageSource = {
  restaurantSlug: string;
  itemSlug: string;
  url: string;
  source: "unsplash";
  creditLabel?: string;
  creditUrl?: string;
};

const unsplashImage = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=82`;

const source = (
  restaurantSlug: string,
  itemSlug: string,
  photoId: string,
): DemoDishImageSource => ({
  restaurantSlug,
  itemSlug,
  url: unsplashImage(photoId),
  source: "unsplash",
  creditLabel: "Unsplash",
  creditUrl: "https://unsplash.com",
});

export const demoDishImageSources: Record<string, DemoDishImageSource> = {
  "demo-bavarian-wirtshaus/schweinshaxe": source(
    "demo-bavarian-wirtshaus",
    "schweinshaxe",
    "photo-1609315775378-fc9679b1786a",
  ),
  "demo-bavarian-wirtshaus/kaesespaetzle": source(
    "demo-bavarian-wirtshaus",
    "kaesespaetzle",
    "photo-1519776361698-e8f0c35533e8",
  ),
  "demo-bavarian-wirtshaus/obatzda": source(
    "demo-bavarian-wirtshaus",
    "obatzda",
    "photo-1531865282928-5c91416b2ed7",
  ),
  "demo-bavarian-wirtshaus/nuernberger-rostbratwuerstl": source(
    "demo-bavarian-wirtshaus",
    "nuernberger-rostbratwuerstl",
    "photo-1511951786553-1d4f975424c9",
  ),
  "demo-bavarian-wirtshaus/forelle-muellerin": source(
    "demo-bavarian-wirtshaus",
    "forelle-muellerin",
    "photo-1547424450-75ec164925ad",
  ),
  "demo-bavarian-wirtshaus/spargelsalat": source(
    "demo-bavarian-wirtshaus",
    "spargelsalat",
    "photo-1505253716362-afaea1d3d1af",
  ),
  "demo-bavarian-wirtshaus/rahmschwammerl": source(
    "demo-bavarian-wirtshaus",
    "rahmschwammerl",
    "photo-1548940740-204726a19be3",
  ),
  "demo-bavarian-wirtshaus/rote-bete-knoedel": source(
    "demo-bavarian-wirtshaus",
    "rote-bete-knoedel",
    "photo-1568486504489-9e70d75313b8",
  ),
  "demo-bavarian-wirtshaus/leberknoedelsuppe": source(
    "demo-bavarian-wirtshaus",
    "leberknoedelsuppe",
    "photo-1547592166-23ac45744acd",
  ),
  "demo-bavarian-wirtshaus/kartoffelknoedel": source(
    "demo-bavarian-wirtshaus",
    "kartoffelknoedel",
    "photo-1632116766245-ac9ff0e59ceb",
  ),
  "demo-bavarian-wirtshaus/kaiserschmarrn": source(
    "demo-bavarian-wirtshaus",
    "kaiserschmarrn",
    "photo-1568571780763-574a1a4f8f6c",
  ),
  "demo-bavarian-wirtshaus/apfelstrudel": source(
    "demo-bavarian-wirtshaus",
    "apfelstrudel",
    "photo-1615488928798-6794e12686e2",
  ),
  "demo-bavarian-wirtshaus/brotzeit-board": source(
    "demo-bavarian-wirtshaus",
    "brotzeit-board",
    "photo-1532634922-8fe0b757fb13",
  ),
  "demo-bavarian-wirtshaus/munich-helles": source(
    "demo-bavarian-wirtshaus",
    "munich-helles",
    "photo-1523567830207-96731740fa71",
  ),
  "demo-bavarian-wirtshaus/radler": source(
    "demo-bavarian-wirtshaus",
    "radler",
    "photo-1586993451228-09818021e309",
  ),
  "demo-bavarian-wirtshaus/almdudler-spritz": source(
    "demo-bavarian-wirtshaus",
    "almdudler-spritz",
    "photo-1470337458703-46ad1756a187",
  ),
  "demo-bavarian-wirtshaus/weissbier": source(
    "demo-bavarian-wirtshaus",
    "weissbier",
    "photo-1462664450306-25ad625a342b",
  ),
  "demo-bavarian-wirtshaus/espresso-schnapserl": source(
    "demo-bavarian-wirtshaus",
    "espresso-schnapserl",
    "photo-1558722141-76ef6ca013be",
  ),

  "demo-asian-night-market/tokyo-shoyu-ramen": source(
    "demo-asian-night-market",
    "tokyo-shoyu-ramen",
    "photo-1569718212165-3a8278d5f624",
  ),
  "demo-asian-night-market/sichuan-mapo-tofu": source(
    "demo-asian-night-market",
    "sichuan-mapo-tofu",
    "photo-1511910849309-0dffb8785146",
  ),
  "demo-asian-night-market/thai-green-curry-chicken": source(
    "demo-asian-night-market",
    "thai-green-curry-chicken",
    "photo-1455619452474-d2be8b1e70cd",
  ),
  "demo-asian-night-market/mushroom-bibimbap": source(
    "demo-asian-night-market",
    "mushroom-bibimbap",
    "photo-1498654896293-37aacf113fd9",
  ),
  "demo-asian-night-market/pad-thai-tamarind-noodles": source(
    "demo-asian-night-market",
    "pad-thai-tamarind-noodles",
    "photo-1550967977-2ab262149a5f",
  ),
  "demo-asian-night-market/singapore-laksa": source(
    "demo-asian-night-market",
    "singapore-laksa",
    "photo-1555126634-323283e090fa",
  ),
  "demo-asian-night-market/miso-black-cod": source(
    "demo-asian-night-market",
    "miso-black-cod",
    "photo-1564834744159-ff0ea41ba4b9",
  ),
  "demo-asian-night-market/char-siu-eggplant": source(
    "demo-asian-night-market",
    "char-siu-eggplant",
    "photo-1503764654157-72d979d9af2f",
  ),
  "demo-asian-night-market/satay-chicken-skewers": source(
    "demo-asian-night-market",
    "satay-chicken-skewers",
    "photo-1617093727343-374698b1b08d",
  ),
  "demo-asian-night-market/chicken-karaage": source(
    "demo-asian-night-market",
    "chicken-karaage",
    "photo-1496116218417-1a781b1c416c",
  ),
  "demo-asian-night-market/prawn-toast-bites": source(
    "demo-asian-night-market",
    "prawn-toast-bites",
    "photo-1591814468924-caf88d1232e1",
  ),
  "demo-asian-night-market/korean-kimchi-pancake": source(
    "demo-asian-night-market",
    "korean-kimchi-pancake",
    "photo-1594476800904-f5789996ca8e",
  ),
  "demo-asian-night-market/sichuan-cucumber-smash": source(
    "demo-asian-night-market",
    "sichuan-cucumber-smash",
    "photo-1626804475315-9644b37a2fe4",
  ),
  "demo-asian-night-market/thai-mango-sticky-rice": source(
    "demo-asian-night-market",
    "thai-mango-sticky-rice",
    "photo-1623065422902-30a2d299bbe4",
  ),
  "demo-asian-night-market/matcha-cheesecake": source(
    "demo-asian-night-market",
    "matcha-cheesecake",
    "photo-1624863121571-c7add0307f30",
  ),
  "demo-asian-night-market/sesame-mochi-trio": source(
    "demo-asian-night-market",
    "sesame-mochi-trio",
    "photo-1616953882431-3b8158da5836",
  ),
  "demo-asian-night-market/yuzu-lemonade": source(
    "demo-asian-night-market",
    "yuzu-lemonade",
    "photo-1497534446932-c925b458314e",
  ),
  "demo-asian-night-market/oolong-highball": source(
    "demo-asian-night-market",
    "oolong-highball",
    "photo-1558642891-54be180ea339",
  ),

  "demo-vietnamese-house/pho-bo-tai": source(
    "demo-vietnamese-house",
    "pho-bo-tai",
    "photo-1577859623802-b5e3ca51f885",
  ),
  "demo-vietnamese-house/vegan-pho-nam": source(
    "demo-vietnamese-house",
    "vegan-pho-nam",
    "photo-1610452220299-5edf90b8a6ed",
  ),
  "demo-vietnamese-house/bun-bo-hue": source(
    "demo-vietnamese-house",
    "bun-bo-hue",
    "photo-1580694129446-25862b43c178",
  ),
  "demo-vietnamese-house/bun-cha-ha-noi": source(
    "demo-vietnamese-house",
    "bun-cha-ha-noi",
    "photo-1582878826629-29b7ad1cdc43",
  ),
  "demo-vietnamese-house/banh-mi-dac-biet": source(
    "demo-vietnamese-house",
    "banh-mi-dac-biet",
    "photo-1562147600-ee6e0707973b",
  ),
  "demo-vietnamese-house/lemongrass-chicken-rice-bowl": source(
    "demo-vietnamese-house",
    "lemongrass-chicken-rice-bowl",
    "photo-1509072619873-adb3dc289b50",
  ),
  "demo-vietnamese-house/goi-cuon-tom": source(
    "demo-vietnamese-house",
    "goi-cuon-tom",
    "photo-1562565652-a0d8f0c59eb4",
  ),
  "demo-vietnamese-house/banh-xeo": source(
    "demo-vietnamese-house",
    "banh-xeo",
    "photo-1599719455360-ff0be7c4dd06",
  ),
  "demo-vietnamese-house/com-tam-suon-nuong": source(
    "demo-vietnamese-house",
    "com-tam-suon-nuong",
    "photo-1603375589273-3aa651420cae",
  ),
  "demo-vietnamese-house/green-papaya-salad": source(
    "demo-vietnamese-house",
    "green-papaya-salad",
    "photo-1505253716362-afaea1d3d1af",
  ),
  "demo-vietnamese-house/crispy-tofu-lettuce-cups": source(
    "demo-vietnamese-house",
    "crispy-tofu-lettuce-cups",
    "photo-1504674900247-0877df9cc836",
  ),
  "demo-vietnamese-house/caramelized-claypot-eggplant": source(
    "demo-vietnamese-house",
    "caramelized-claypot-eggplant",
    "photo-1600454309261-3dc9b7597637",
  ),
  "demo-vietnamese-house/extra-herb-basket": source(
    "demo-vietnamese-house",
    "extra-herb-basket",
    "photo-1512621776951-a57141f2eefd",
  ),
  "demo-vietnamese-house/pickled-lotus-root-side": source(
    "demo-vietnamese-house",
    "pickled-lotus-root-side",
    "photo-1571917411767-20545014a0bc",
  ),
  "demo-vietnamese-house/pandan-coconut-flan": source(
    "demo-vietnamese-house",
    "pandan-coconut-flan",
    "photo-1624863121571-c7add0307f30",
  ),
  "demo-vietnamese-house/che-ba-mau": source(
    "demo-vietnamese-house",
    "che-ba-mau",
    "photo-1619898804188-e7bad4bd2127",
  ),
  "demo-vietnamese-house/ca-phe-sua-da": source(
    "demo-vietnamese-house",
    "ca-phe-sua-da",
    "photo-1461023058943-07fcbe16d735",
  ),
  "demo-vietnamese-house/coconut-lime-soda": source(
    "demo-vietnamese-house",
    "coconut-lime-soda",
    "photo-1587899053914-4894c3ca656d",
  ),

  "demo-indian-spice-room/butter-chicken": source(
    "demo-indian-spice-room",
    "butter-chicken",
    "photo-1603894584373-5ac82b2ae398",
  ),
  "demo-indian-spice-room/lamb-rogan-josh": source(
    "demo-indian-spice-room",
    "lamb-rogan-josh",
    "photo-1542367592-8849eb950fd8",
  ),
  "demo-indian-spice-room/hyderabadi-chicken-biryani": source(
    "demo-indian-spice-room",
    "hyderabadi-chicken-biryani",
    "photo-1563379091339-03b21ab4a4f8",
  ),
  "demo-indian-spice-room/paneer-tikka": source(
    "demo-indian-spice-room",
    "paneer-tikka",
    "photo-1574484284002-952d92456975",
  ),
  "demo-indian-spice-room/baingan-bharta": source(
    "demo-indian-spice-room",
    "baingan-bharta",
    "photo-1565557623262-b51c2513a641",
  ),
  "demo-indian-spice-room/goan-prawn-curry": source(
    "demo-indian-spice-room",
    "goan-prawn-curry",
    "photo-1588166524941-3bf61a9c41db",
  ),
  "demo-indian-spice-room/masala-dosa": source(
    "demo-indian-spice-room",
    "masala-dosa",
    "photo-1517244683847-7456b63c5969",
  ),
  "demo-indian-spice-room/amritsari-fish-fry": source(
    "demo-indian-spice-room",
    "amritsari-fish-fry",
    "photo-1555939594-58d7cb561ad1",
  ),
  "demo-indian-spice-room/papdi-chaat": source(
    "demo-indian-spice-room",
    "papdi-chaat",
    "photo-1599043513900-ed6fe01d3833",
  ),
  "demo-indian-spice-room/garlic-naan": source(
    "demo-indian-spice-room",
    "garlic-naan",
    "photo-1586524068358-77d2196875e7",
  ),
  "demo-indian-spice-room/peshwari-naan": source(
    "demo-indian-spice-room",
    "peshwari-naan",
    "photo-1640625314547-aee9a7696589",
  ),
  "demo-indian-spice-room/tandoori-roti": source(
    "demo-indian-spice-room",
    "tandoori-roti",
    "photo-1611107415406-1c12f8cda424",
  ),
  "demo-indian-spice-room/mango-kulfi": source(
    "demo-indian-spice-room",
    "mango-kulfi",
    "photo-1553279768-865429fa0078",
  ),
  "demo-indian-spice-room/gulab-jamun": source(
    "demo-indian-spice-room",
    "gulab-jamun",
    "photo-1546173159-315724a31696",
  ),
  "demo-indian-spice-room/cardamom-rice-pudding": source(
    "demo-indian-spice-room",
    "cardamom-rice-pudding",
    "photo-1619898804188-e7bad4bd2127",
  ),
  "demo-indian-spice-room/mango-lassi": source(
    "demo-indian-spice-room",
    "mango-lassi",
    "photo-1623065422902-30a2d299bbe4",
  ),
  "demo-indian-spice-room/masala-chai": source(
    "demo-indian-spice-room",
    "masala-chai",
    "photo-1583836632332-53825ce55a03",
  ),
  "demo-indian-spice-room/salted-nimbu-soda": source(
    "demo-indian-spice-room",
    "salted-nimbu-soda",
    "photo-1622824497447-b284a5493027",
  ),
};

export function demoDishImageKey(restaurantSlug: string, itemSlug: string) {
  return `${restaurantSlug}/${itemSlug}`;
}

export function getDemoDishImageSource(restaurantSlug: string, itemSlug: string) {
  return demoDishImageSources[demoDishImageKey(restaurantSlug, itemSlug)];
}

export function getDemoDishImageUrl(restaurantSlug: string, itemSlug: string) {
  return getDemoDishImageSource(restaurantSlug, itemSlug)?.url ?? null;
}
