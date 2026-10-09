export type PanelInterior = "acb" | "drawers" | "capacitors" | "plc" | "vfd" | "mcb" | "controller" | "starter" | "stabilizer";

export type PanelModel = {
  form: "floor" | "wall" | "stabilizer";
  bays: number;
  finish: "light" | "dark";
  interior: PanelInterior;
  hmi?: boolean;
  meters?: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  category: "Power Panels" | "Control Systems" | "Automation" | "Distribution" | "Power Quality";
  image: string;
  shortDescription: string;
  description: string;
  rating: string;
  features: string[];
  applications: string[];
  specifications: Record<string, string>;
  model: PanelModel;
};

const img = (slug: string) => `/images/products/${slug}.webp`;

const products: Product[] = [
  {
    id: 1,
    name: "LT Control Panel",
    slug: "lt-control-panel",
    category: "Control Systems",
    image: img("lt-control-panel"),
    rating: "Up to 4000A",
    shortDescription: "Safe, dependable low-tension control for demanding industrial operations.",
    description: "Custom-engineered LT control panels designed for reliable switching, protection and control of low-voltage electrical systems across process industries. Built on CRCA sheet steel with seven-tank pre-treatment and powder coating.",
    features: ["Modular CRCA construction", "Premium switchgear (L&T, Schneider, ABB)", "High fault-level withstand", "Clear circuit identification", "Form 2 / 3 / 4 segregation", "Front and rear access"],
    applications: ["Process plants", "Commercial facilities", "Manufacturing units", "Hotels and hospitals"],
    specifications: { Voltage: "415V AC", Frequency: "50Hz", Phase: "3 Phase, 4 Wire", "Current Rating": "Up to 4000A", "Fault Level": "50kA for 1 sec", Protection: "IP54 / IP65", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 3, finish: "light", interior: "mcb", meters: 3 },
  },
  {
    id: 2,
    name: "PCC Panel",
    slug: "pcc-panel",
    category: "Power Panels",
    image: img("pcc-panel"),
    rating: "Up to 6300A",
    shortDescription: "Centralized power control and distribution with advanced protection.",
    description: "Power Control Centre panels built for efficient distribution, monitoring and protection of high-capacity electrical loads, with ACB incomers, bus couplers and multiple MCCB outgoing feeders.",
    features: ["Busbar up to 6300A", "Draw-out or fixed ACB modules", "Digital multifunction metering", "Type-tested design", "Bus coupler with interlocks", "Aluminium or copper busbar"],
    applications: ["Steel plants", "Large factories", "Utilities", "Data centres"],
    specifications: { Voltage: "415V / 690V", Frequency: "50Hz", Phase: "3 Phase", "Current Rating": "Up to 6300A", "Fault Level": "65kA for 1 sec", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 5, finish: "light", interior: "acb", meters: 3 },
  },
  {
    id: 3,
    name: "MCC Panel",
    slug: "mcc-panel",
    category: "Control Systems",
    image: img("mcc-panel"),
    rating: "Up to 800kW",
    shortDescription: "Intelligent motor control engineered for uptime and protection.",
    description: "Motor Control Centre panels providing centralized control, isolation and protection for multiple motors and process loads, with fixed or draw-out feeder modules.",
    features: ["DOL, star-delta and soft starters", "Intelligent motor protection relays", "PLC ready architecture", "Draw-out feeder modules", "Easy maintenance access", "Cable alley with glands"],
    applications: ["Water treatment", "Cement plants", "Material handling", "Sugar mills"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "Feeder Type": "DOL / Star-Delta / Soft Starter", Construction: "Fixed / Draw-out", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 4, finish: "light", interior: "drawers", meters: 2 },
  },
  {
    id: 4,
    name: "APFC Panel",
    slug: "apfc-panel",
    category: "Power Quality",
    image: img("apfc-panel"),
    rating: "Up to 1000 kVAR",
    shortDescription: "Automatic power factor correction for lower energy bills.",
    description: "Microprocessor-based APFC panels that continuously monitor reactive power and switch capacitor banks to maintain an optimal power factor near unity under varying plant loads.",
    features: ["Automatic PF correction to 0.99", "Heavy-duty MPP capacitors", "Detuned reactor options", "Thyristor switching available", "Forced-air cooling", "Energy-saving operation"],
    applications: ["Manufacturing industries", "Commercial buildings", "Industrial plants", "Textile mills"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "kVAR Rating": "50 to 1000 kVAR", Switching: "Contactor / Thyristor", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 2, finish: "light", interior: "capacitors", meters: 1 },
  },
  {
    id: 5,
    name: "PLC Automation Panel",
    slug: "plc-automation-panel",
    category: "Automation",
    image: img("plc-automation-panel"),
    rating: "Up to 2048 I/O",
    shortDescription: "Integrated process automation with PLC, HMI and SCADA control.",
    description: "Scalable automation panels that integrate PLC, HMI, instrumentation and industrial communication systems for precise process control and remote visibility.",
    features: ["Siemens / Allen-Bradley / Delta PLC", "HMI touchscreen integration", "Remote diagnostics and IoT", "Modbus, Profinet, Ethernet/IP", "Expandable I/O", "Factory acceptance testing"],
    applications: ["Batch processing", "Assembly lines", "Packaging systems", "Pharma plants"],
    specifications: { Voltage: "230V / 415V", Frequency: "50Hz", Phase: "1 / 3 Phase", "Control Voltage": "24V DC", Communication: "Modbus / Profinet", Protection: "IP55", Mounting: "Wall / Floor" },
    model: { form: "floor", bays: 1, finish: "light", interior: "plc", hmi: true, meters: 0 },
  },
  {
    id: 6,
    name: "VFD Control Panel",
    slug: "vfd-control-panel",
    category: "Automation",
    image: img("vfd-control-panel"),
    rating: "0.75 to 500 kW",
    shortDescription: "Precise speed control that improves process and energy efficiency.",
    description: "VFD panels designed for smooth motor speed regulation, lower starting current and significant energy savings in pumps, fans, blowers and conveyors.",
    features: ["Accurate speed control", "Built-in bypass option", "Harmonic filters and line reactors", "Thermal management with fans", "Remote / local operation", "Up to 40% energy savings"],
    applications: ["HVAC systems", "Pumps and blowers", "Conveyors", "Cooling towers"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "Drive Rating": "0.75 to 500 kW", Cooling: "Forced Air", Protection: "IP54", Mounting: "Wall / Floor" },
    model: { form: "floor", bays: 2, finish: "dark", interior: "vfd", hmi: true, meters: 1 },
  },
  {
    id: 7,
    name: "Distribution Panel",
    slug: "distribution-panel",
    category: "Distribution",
    image: img("distribution-panel"),
    rating: "63A to 1250A",
    shortDescription: "Flexible and protected power distribution for any facility.",
    description: "Robust main and sub-distribution boards that provide safe circuit protection and balanced power delivery across industrial sheds, offices and commercial complexes.",
    features: ["Flexible MCCB / MCB feeders", "Integrated metering", "Surge protection devices", "Compact wall-mount footprint", "Double door option", "Neutral and earth links"],
    applications: ["Industrial sheds", "Data facilities", "Commercial complexes", "Residential towers"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "Current Rating": "63A to 1250A", Ways: "4 to 24 Way", Protection: "IP42 / IP54", Mounting: "Wall / Floor" },
    model: { form: "wall", bays: 1, finish: "light", interior: "mcb", meters: 1 },
  },
  {
    id: 8,
    name: "DG Synchronization Panel",
    slug: "dg-synchronization-panel",
    category: "Power Panels",
    image: img("dg-synchronization-panel"),
    rating: "Up to 8 DG sets",
    shortDescription: "Automatic synchronization and load sharing for multiple generators.",
    description: "Advanced synchronizing panels enabling safe paralleling, automatic load sharing and seamless control of multiple DG sets with utility power.",
    features: ["Auto synchronization", "kW and kVAr load sharing", "AMF and mains paralleling", "Generator protection", "Woodward / DEIF / ComAp controllers", "Mimic diagram"],
    applications: ["Hospitals", "Infrastructure projects", "Continuous process plants", "IT parks"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "DG Capacity": "62.5 to 2500 kVA each", Controller: "Woodward / DEIF / ComAp", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 3, finish: "dark", interior: "controller", hmi: true, meters: 3 },
  },
  {
    id: 9,
    name: "DG AMF Panel",
    slug: "amf-panel",
    category: "Power Panels",
    image: img("amf-panel"),
    rating: "100A to 1600A",
    shortDescription: "Auto mains failure control that starts your generator instantly.",
    description: "AMF panels automatically detect mains failure, start the DG set, transfer load and switch back on mains restoration, keeping critical loads powered without manual intervention.",
    features: ["Fully automatic changeover", "Digital AMF controller", "Battery charger built in", "Mechanical and electrical interlock", "Engine protection", "Remote monitoring ready"],
    applications: ["Housing societies", "Hospitals", "Factories", "Telecom sites"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "Current Rating": "100A to 1600A", Changeover: "Contactor / ACB", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 1, finish: "light", interior: "controller", meters: 2 },
  },
  {
    id: 10,
    name: "Star Delta Starter Panel",
    slug: "star-delta-starter-panel",
    category: "Control Systems",
    image: img("star-delta-starter-panel"),
    rating: "5 to 200 HP",
    shortDescription: "Reduced-voltage motor starting for smooth, protected operation.",
    description: "Star-delta and DOL starter panels that reduce motor inrush current, protect against overload and single phasing, and extend the life of pumps and compressors.",
    features: ["Automatic star-delta timer", "Overload and single phasing protection", "Ammeter and voltmeter", "Start / stop push buttons", "Compact wall-mount design", "Pump and compressor ready"],
    applications: ["Water pumps", "Compressors", "Agriculture", "Small industries"],
    specifications: { Voltage: "415V", Frequency: "50Hz", Phase: "3 Phase", "Motor Rating": "5 to 200 HP", Starter: "DOL / Star-Delta", Protection: "IP54", Mounting: "Wall Mounted" },
    model: { form: "wall", bays: 1, finish: "light", interior: "starter", meters: 2 },
  },
  {
    id: 11,
    name: "Servo Voltage Stabilizer",
    slug: "servo-voltage-stabilizer",
    category: "Power Quality",
    image: img("servo-voltage-stabilizer"),
    rating: "5 to 2000 kVA",
    shortDescription: "Stable output voltage that protects sensitive equipment.",
    description: "Servo-controlled voltage stabilizers that correct input fluctuations within milliseconds, delivering a steady output for CNC machines, medical equipment and production lines.",
    features: ["±1% output accuracy", "Microcontroller servo control", "Oil or air cooled", "Over/under voltage cut-off", "Digital display", "Bypass switch"],
    applications: ["CNC machines", "Hospitals", "Printing presses", "Textile looms"],
    specifications: { "Input Range": "300V to 460V", Output: "415V ±1%", Phase: "3 Phase", Capacity: "5 to 2000 kVA", Cooling: "Air / Oil", Protection: "IP42", Mounting: "Floor with wheels" },
    model: { form: "stabilizer", bays: 1, finish: "light", interior: "stabilizer", meters: 3 },
  },
  {
    id: 12,
    name: "ACB Incomer Panel",
    slug: "acb-incomer-panel",
    category: "Distribution",
    image: img("acb-incomer-panel"),
    rating: "800A to 6300A",
    shortDescription: "Main incoming protection with draw-out air circuit breakers.",
    description: "ACB incomer panels act as the main gateway between transformer and plant, providing high breaking capacity protection, metering and busbar trunking connection.",
    features: ["Draw-out ACB with interlocks", "65kA breaking capacity", "Busduct / cable entry", "Multifunction meter", "Earth leakage protection", "Shutter mechanism"],
    applications: ["Transformer incomers", "Main LT rooms", "Commercial towers", "Industrial parks"],
    specifications: { Voltage: "440V", Frequency: "50Hz", Phase: "3 Phase", "Current Rating": "800A to 6300A", "Breaking Capacity": "65kA", Protection: "IP54", Mounting: "Floor Mounted" },
    model: { form: "floor", bays: 1, finish: "light", interior: "acb", meters: 3 },
  },
];

export const categories = ["All", "Power Panels", "Control Systems", "Automation", "Distribution", "Power Quality"] as const;

export default products;
