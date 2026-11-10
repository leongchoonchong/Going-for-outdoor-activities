import { OutdoorSpot, ActivityCategory } from '../types/weather';

export const SINGAPORE_OUTDOOR_SPOTS: OutdoorSpot[] = [
  {
    id: 'macritchie-reservoir',
    name: 'MacRitchie Reservoir & TreeTop Walk',
    area: 'Central Water Catchment',
    region: 'central',
    description: 'Singapore’s oldest reservoir surrounded by mature tropical rainforest with 11km of dirt trails and suspension bridge.',
    image: '/src/assets/images/sg_macritchie_trail_1794290277096.jpg',
    activities: ['running', 'hiking', 'watersports'],
    pathType: 'Boardwalk & Dirt Trail',
    elevationGain: '85m',
    shadeRating: 'High',
    shelterPoints: [
      'Reservoir Amenities Centre',
      'Mushroom Café / Main Entrance',
      'Tee-pee Shelters along Lornie Trail (approx. every 1.5km)',
      'TreeTop Walk Ranger Station'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Long-tailed Macaque monkeys (keep food hidden in bags)',
      'Slippery roots and mud during sudden downpours',
      'No lightning shelters along exposed boardwalk sections'
    ],
    localTips: 'Start before 08:00 AM to beat the heat. TreeTop Walk is closed on Mondays and closes gate promptly at 17:00.',
    coords: { xPercent: 51, yPercent: 48 }
  },
  {
    id: 'east-coast-park',
    name: 'East Coast Park (ECP) Coastal Path',
    area: 'Marine Parade',
    region: 'east',
    description: '15km stretch of beachside recreation, dedicated bicycle lanes, sea breezes, and open-air food enclaves.',
    image: '/src/assets/images/sg_east_coast_park_1794290278373.jpg',
    activities: ['cycling', 'running', 'watersports', 'picnic'],
    pathType: 'Paved Asphalt PCN',
    elevationGain: 'Flat (5m)',
    shadeRating: 'Partial',
    shelterPoints: [
      'Parkland Green sheltered complex (Area C)',
      'Marine Cove sheltered playground & dining (Area C)',
      'Lagoon Food Village (Area E)',
      'Underpass connections to Marine Parade estates'
    ],
    waterPointsAvailable: true,
    hazards: [
      'High UV exposure midday with minimal canopy cover',
      'High headwind on eastern stretches during Northeast Monsoon',
      'Busy pedestrian/cycling intersections near Parkland Green'
    ],
    localTips: 'Rent bikes at Area C or E. Best breeze is between 17:00 and 19:30. Good water coolers every 2km.',
    coords: { xPercent: 68, yPercent: 63 }
  },
  {
    id: 'marina-bay-loop',
    name: 'Marina Bay Waterfront & Gardens Loop',
    area: 'City',
    region: 'south',
    description: 'Iconic 3.5km to 11km urban loop featuring Marina Bay Sands, Helix Bridge, Merlion, and Marina Barrage.',
    image: '/src/assets/images/sg_marina_bay_skyline_1794290278718.jpg',
    activities: ['running', 'cycling', 'nightwalk', 'picnic'],
    pathType: 'Smooth Granite & Concrete Promenade',
    elevationGain: 'Flat (10m)',
    shadeRating: 'Direct Sun',
    shelterPoints: [
      'The Shoppes at Marina Bay Sands',
      'Esplanade Theatres on the Bay concourse',
      'Marina Barrage visitor centre & gallery',
      'Gardens by the Bay Supertree Grove walkways'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Concrete heat radiance between 11:00 and 16:00',
      'Heavy tourist foot traffic along Merlion and Helix Bridge',
      'Kite flying lines at Marina Barrage green roof'
    ],
    localTips: 'World-class night running route with full lighting and skyline reflections. Ideal after 18:30.',
    coords: { xPercent: 54, yPercent: 64 }
  },
  {
    id: 'bukit-timah-reserve',
    name: 'Bukit Timah Nature Reserve',
    area: 'Bukit Timah',
    region: 'central',
    description: 'Singapore’s highest natural summit (163m) surrounded by primary equatorial dipterocarp rainforest.',
    activities: ['hiking', 'running'],
    pathType: 'Steep Tarmac & Natural Stone Steps',
    elevationGain: '163m (steep)',
    shadeRating: 'High',
    shelterPoints: [
      'Bukit Timah Visitor Centre (Hindhede Rd)',
      'Kruing Hut halfway up Main Road',
      'Summit Pavilion at summit plateau'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Very steep initial 400m gradient (>20% incline)',
      'Sudden tree branch fall risks during squalls',
      'Humid microclimate with rapid dehydration'
    ],
    localTips: 'Tough cardiovascular workout. Take the Red Main Road for direct climb, or Green/Yellow routes for rugged forest trails.',
    coords: { xPercent: 44, yPercent: 49 }
  },
  {
    id: 'rail-corridor',
    name: 'The Rail Corridor (Central & South)',
    area: 'Queenstown / Bukit Timah',
    region: 'central',
    description: '24km continuous ecological green corridor linking Kranji in the north to Tanjong Pagar in the south.',
    activities: ['running', 'cycling', 'hiking'],
    pathType: 'Gravel & Porous Pavement',
    elevationGain: 'Rolling (30m)',
    shadeRating: 'Partial',
    shelterPoints: [
      'Bukit Timah Railway Station refurbished hall',
      'Holland Green linear park underpasses',
      'King Albert Park MRT connection',
      'Buona Vista Node sheltered plazas'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Porous gravel sections can get squishy after torrential rains',
      'Occasional monitor lizards crossing path',
      'Cyclist speed limits (10 km/h) enforced on shared paths'
    ],
    localTips: 'The stretch between King Albert Park and Buona Vista is the most scenic with heritage steel bridges.',
    coords: { xPercent: 46, yPercent: 56 }
  },
  {
    id: 'sentosa-beaches',
    name: 'Sentosa Coastal & Beach Walk (Siloso / Palawan)',
    area: 'Southern Islands',
    region: 'south',
    description: 'Sandy beaches, palm trees, paddle boarding, kayaking, and open ocean breeze on Singapore’s resort island.',
    activities: ['watersports', 'running', 'picnic', 'nightwalk'],
    pathType: 'Boardwalk, Sand & Paved Beach Path',
    elevationGain: 'Flat',
    shadeRating: 'Direct Sun',
    shelterPoints: [
      'Beach Station transport hub & basement',
      'Siloso Beach pavilion & F&B outlets',
      'Palawan Green covered stage & changing facilities'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Extreme UV index between 11:00 and 15:30',
      'Reflective sand increases heat stress significantly',
      'Lightning risk over open water and beach shores'
    ],
    localTips: 'If thunder rumbles, vacate the water immediately. Excellent showers and lockers at Siloso and Palawan.',
    coords: { xPercent: 49, yPercent: 74 }
  },
  {
    id: 'southern-ridges',
    name: 'Southern Ridges & Henderson Waves',
    area: 'Bukit Merah',
    region: 'south',
    description: '10km of connecting hilltop trails, forest canopy walks, and Singapore’s highest pedestrian bridge (Henderson Waves).',
    activities: ['hiking', 'running', 'nightwalk'],
    pathType: 'Elevated Metal Grid & Paved Trails',
    elevationGain: '120m',
    shadeRating: 'Partial',
    shelterPoints: [
      'Mount Faber Peak cable car station',
      'Telok Blangah Hill Terrace Garden gazebo',
      'HortPark multi-purpose air-conditioned hall',
      'Labrador Park MRT station'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Exposed metal grid walkway slippery when wet',
      'Elevated heights on Forest Walk and Henderson Waves during lightning',
      'Stairs and steep ramps at Mount Faber'
    ],
    localTips: 'Henderson Waves is softly illuminated with LED ribbons from 19:00 to 07:00 daily—a magical evening walk.',
    coords: { xPercent: 48, yPercent: 63 }
  },
  {
    id: 'changi-bay-point',
    name: 'Changi Bay Point & Coastal PCN',
    area: 'Changi',
    region: 'east',
    description: 'Scenic waterfront link with seaside boardwalks, coastal views towards Pulau Tekong, and tranquil cycling path.',
    activities: ['cycling', 'running'],
    pathType: 'Wide Smooth Asphalt PCN',
    elevationGain: 'Flat',
    shadeRating: 'Direct Sun',
    shelterPoints: [
      'Changi Bay Point Pavilion with solar charging benches',
      'Changi Beach Park Carpark 7 shelters',
      'Changi Jurassic Mile connector'
    ],
    waterPointsAvailable: false,
    hazards: [
      'Completely open to harsh sun and offshore gusts',
      'Water point is 3km away at Changi Beach Park; carry 1L+ fluid',
      'No vehicle access along the central boardwalk'
    ],
    localTips: 'Top spot for sunrise cycling (06:45 - 07:30). Reminiscent of Jeju coastal trails with wooden fences.',
    coords: { xPercent: 88, yPercent: 46 }
  },
  {
    id: 'jurong-lake-gardens',
    name: 'Jurong Lake Gardens & Rasau Walk',
    area: 'Jurong East',
    region: 'west',
    description: '90-hectare national garden surrounding Jurong Lake featuring boardwalks, grass mounds, and water sport centre.',
    activities: ['running', 'cycling', 'watersports', 'picnic'],
    pathType: 'Smooth Paved PCN & Floating Wetlands',
    elevationGain: 'Gentle mounds (15m)',
    shadeRating: 'Partial',
    shelterPoints: [
      'Lakeside Field pavilion',
      'Forest Ramble entrance shelter',
      'PAssion WaVe @ Jurong Lake Gardens',
      'Lakeside MRT station (600m)'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Afternoon convection storms strike western Singapore frequently',
      'Open grass mounds offer no lightning protection',
      'Muddy patches near dog run after rain'
    ],
    localTips: 'The Lone Tree (sculpture made from recycled iron) and Grasslands are prime sunset photography spots.',
    coords: { xPercent: 28, yPercent: 54 }
  },
  {
    id: 'kallang-riverside',
    name: 'Kallang Riverside & Sports Hub Promenade',
    area: 'Kallang',
    region: 'central',
    description: 'Flat scenic loop around Kallang Basin with Singapore National Stadium 100PLUS covered track contingency.',
    activities: ['running', 'cycling', 'watersports', 'racquet'],
    pathType: 'Paved PCN & Sheltered Running Track',
    elevationGain: 'Flat',
    shadeRating: 'Partial',
    shelterPoints: [
      '100PLUS Promenade (completely weatherproof 888m indoor/outdoor track)',
      'Kallang Wave Mall',
      'Singapore Sports Hub Visitor Centre',
      'Stadium MRT station'
    ],
    waterPointsAvailable: true,
    hazards: [
      'Weekend dragon boat & kayak crowds along jetty',
      'High ambient humidity from river basin'
    ],
    localTips: 'The ultimate wet-weather backup in Singapore! If sudden rain hits, head straight to the 100PLUS Promenade for a free, sheltered, high-grip 888m running loop.',
    coords: { xPercent: 57, yPercent: 57 }
  }
];

export const ACTIVITY_PROFILES: Record<
  ActivityCategory,
  {
    title: string;
    icon: string;
    intensity: 'High' | 'Moderate' | 'Low';
    idealTempRange: string;
    maxComfortWbgt: number; // °C
    maxUvTolerance: number;
    description: string;
    gearMandatory: string[];
    gearRecommended: string[];
  }
> = {
  running: {
    title: 'Running & Jogging',
    icon: 'Activity',
    intensity: 'High',
    idealTempRange: '25°C - 29°C',
    maxComfortWbgt: 31,
    maxUvTolerance: 7,
    description: 'High cardiovascular strain. Tropical humidity restricts sweat evaporation. Early morning and evening are prime.',
    gearMandatory: ['Moisture-wicking singlet/shorts', 'Hydration (min. 500ml for >5km)'],
    gearRecommended: ['Electrolyte chews/tabs', 'Breathable running cap', 'Water-resistant phone pocket', 'Reflective gear for night']
  },
  cycling: {
    title: 'Road & PCN Cycling',
    icon: 'Bike',
    intensity: 'Moderate',
    idealTempRange: '25°C - 31°C',
    maxComfortWbgt: 32,
    maxUvTolerance: 8,
    description: 'Airflow aids cooling, but prolonged sun exposure on open PCN/coastal routes requires rigorous UV defense.',
    gearMandatory: ['Certified bicycle helmet', 'Front & rear safety lights', 'Minimum 750ml bidon'],
    gearRecommended: ['UV arm sleeves', 'Polarized cycling sunglasses', 'Mini-pump & patch kit', 'Electrolyte drink']
  },
  hiking: {
    title: 'Hiking & Nature Walk',
    icon: 'Footprints',
    intensity: 'Moderate',
    idealTempRange: '24°C - 29°C',
    maxComfortWbgt: 31.5,
    maxUvTolerance: 6,
    description: 'Canopy provides sun shelter but traps humidity. Soil trails become slick with mud after downpours.',
    gearMandatory: ['Shoes with trail tread / grip', '1L+ water bottle'],
    gearRecommended: ['Mosquito / DEET insect repellent', 'Light packable rain poncho', 'Small hand towel for sweat', 'Small ziploc bag for electronics']
  },
  watersports: {
    title: 'Water Sports & Beach',
    icon: 'Waves',
    intensity: 'High',
    idealTempRange: '27°C - 32°C',
    maxComfortWbgt: 32.5,
    maxUvTolerance: 10,
    description: 'Great for cooling off, but water and sand reflection doubles UV exposure. Strictly heed lightning alerts.',
    gearMandatory: ['PFD / Life vest (if boating)', 'Waterproof dry bag', 'SPF 50+ broad-spectrum water-resistant sunscreen'],
    gearRecommended: ['Rash guard / UV swim shirt', 'Water booties', 'Floating sunglasses strap', 'Hydration pack']
  },
  racquet: {
    title: 'Tennis & Outdoor Racquet',
    icon: 'Trophy',
    intensity: 'High',
    idealTempRange: '26°C - 30°C',
    maxComfortWbgt: 31,
    maxUvTolerance: 7,
    description: 'Hard courts radiate intense thermal heat midday. Slick painted court surface becomes unplayable when wet.',
    gearMandatory: ['Non-marking court shoes', '1L+ water with electrolytes'],
    gearRecommended: ['Wristbands & head sweatband', 'Towel', 'Spare overgrips (sweaty palms)', 'Court towel for damp lines']
  },
  picnic: {
    title: 'Park Picnic & Leisure',
    icon: 'Coffee',
    intensity: 'Low',
    idealTempRange: '26°C - 31°C',
    maxComfortWbgt: 33,
    maxUvTolerance: 8,
    description: 'Relaxed outdoor gathering. Need shade under mature trees or gazebos, plus quick access to rain shelter.',
    gearMandatory: ['Waterproof-backed picnic mat', 'Cold drinks & cooler'],
    gearRecommended: ['Insect repellent / mosquito patches', 'Portable mini fan', 'Foldable umbrella', 'Trash bags (clean up for wildlife)']
  },
  nightwalk: {
    title: 'Evening & Night Walk',
    icon: 'Moon',
    intensity: 'Low',
    idealTempRange: '26°C - 29°C',
    maxComfortWbgt: 30,
    maxUvTolerance: 0,
    description: 'Zero UV index and ambient temperatures cooling down. Ideal time to enjoy Singapore’s illuminated waterfronts.',
    gearMandatory: ['Comfortable walking shoes', 'Hydration bottle'],
    gearRecommended: ['Light insect repellent', 'Phone camera for skyline', 'Small umbrella (night showers occur)']
  }
};
