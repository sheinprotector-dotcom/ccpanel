import {
  Bolt, Building2, CircuitBoard, ClipboardCheck, Cog, Cpu, Droplets, Factory, FlaskConical, Gauge, HardHat,
  Hospital, PackageCheck, PencilRuler, Pill, Plane, Server, Settings, SlidersHorizontal, TrainFront, Truck, Wheat, Wrench,
} from "lucide-react";

export const company = {
  name: "Powertech Engineers",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "https://wa.me/919876543210",
  email: "projects@powertech.in",
  address: "Plot 42, GIDC Industrial Estate, Vadodara, Gujarat 390010",
  hours: "Monday to Saturday, 9:00 AM to 6:30 PM",
};

export const services = [
  { icon: CircuitBoard, title: "Panel Manufacturing", text: "LT, PCC, MCC, APFC and automation panels fabricated in-house on CNC punching and bending lines." },
  { icon: Cog, title: "Industrial Automation", text: "PLC, HMI, SCADA and drive integration that improves productivity, visibility and process consistency." },
  { icon: Wrench, title: "Electrical Installation", text: "Safe site installation, cable laying, termination and integration by certified project teams." },
  { icon: Bolt, title: "HT / LT Solutions", text: "End-to-end power distribution from the transformer yard to the final industrial load." },
  { icon: Gauge, title: "Testing & Commissioning", text: "Primary and secondary injection, IR, HV and protection testing for dependable start-up." },
  { icon: Settings, title: "Annual Maintenance", text: "Preventive, predictive and breakdown maintenance plans that protect uptime and asset life." },
  { icon: Factory, title: "Turnkey Projects", text: "Single-point responsibility from engineering and supply through installation and handover." },
  { icon: SlidersHorizontal, title: "Energy Audits", text: "Power quality, harmonics and load studies that identify savings and correct power factor." },
];

export const process = [
  { icon: ClipboardCheck, title: "Requirement Study", text: "Site survey, load list and single line diagram review with your consultant." },
  { icon: PencilRuler, title: "Engineering & GA", text: "3D GA drawings, BOM and wiring schematics submitted for approval." },
  { icon: Cpu, title: "Fabrication", text: "CNC punched CRCA sheet, 7-tank pre-treatment and powder coating." },
  { icon: HardHat, title: "Assembly & Wiring", text: "Busbar fabrication, component mounting and ferruled, dressed wiring." },
  { icon: PackageCheck, title: "Routine Testing", text: "HV, IR and functional tests with client FAT before dispatch." },
  { icon: Truck, title: "Install & Support", text: "On-site erection, commissioning and long-term maintenance support." },
];

export const industries = [
  { icon: Factory, name: "Automotive" },
  { icon: Pill, name: "Pharmaceuticals" },
  { icon: Droplets, name: "Water & Wastewater" },
  { icon: Building2, name: "Commercial Real Estate" },
  { icon: Hospital, name: "Healthcare" },
  { icon: Server, name: "Data Centres" },
  { icon: FlaskConical, name: "Chemicals" },
  { icon: Wheat, name: "Food Processing" },
  { icon: TrainFront, name: "Metro & Rail" },
  { icon: Plane, name: "Airports" },
];

export type Project = { name: string; location: string; category: string; image: string; scope: string; year: string };

export const projects: Project[] = [
  { name: "Automotive Assembly Power Upgrade", location: "Sanand, Gujarat", category: "Industrial", image: "/images/project-automotive.webp", scope: "6300A PCC, 14 MCC sections, busduct", year: "2025" },
  { name: "Water Treatment Automation", location: "Indore, Madhya Pradesh", category: "Automation", image: "/images/project-water.webp", scope: "PLC-SCADA, 22 VFD panels", year: "2025" },
  { name: "Hospital DG Synchronization", location: "Ahmedabad, Gujarat", category: "Infrastructure", image: "/images/project-dg.webp", scope: "3 x 1010 kVA DG sync with AMF", year: "2024" },
  { name: "Commercial Tower LT Distribution", location: "Pune, Maharashtra", category: "Commercial", image: "/images/project-commercial.webp", scope: "LT panels, APFC, rising mains", year: "2024" },
  { name: "Pharma Plant MCC Modernization", location: "Ankleshwar, Gujarat", category: "Industrial", image: "/images/wiring-closeup.webp", scope: "Draw-out MCC retrofit, IE3 motors", year: "2023" },
  { name: "Warehouse Energy Management", location: "Navi Mumbai, Maharashtra", category: "Automation", image: "/images/engineers-testing.webp", scope: "EMS, APFC 600 kVAR, smart metering", year: "2023" },
];

export const testimonials = [
  { quote: "Powertech delivered our 6300A PCC and 14 MCC sections two weeks ahead of schedule. The wiring quality and documentation were the best we have seen from any panel builder.", name: "Rakesh Mehta", role: "Head of Projects, Arvind Auto Components" },
  { quote: "Their APFC panels brought our power factor to 0.99 and we stopped paying penalties from the very first billing cycle. Service response is excellent.", name: "Priya Nair", role: "Plant Manager, Zenith Pharma" },
  { quote: "From PLC programming to SCADA dashboards, the team understood our process and commissioned the plant with zero downtime. Highly recommended.", name: "Anil Deshpande", role: "Executive Engineer, Orbit Water Utilities" },
];

export const clients = ["ARVIND AUTO", "ZENITH PHARMA", "NEXA STEEL", "SURYODAY CEMENT", "VARDHAN INFRA", "ORBIT WATER", "TITAN PROCESS", "ASCENT FOODS", "WESTERN RAIL", "PRIME POLYMERS", "INDUS ENGG", "BLUEPEAK ENERGY"];

export const certifications = ["ISO 9001:2015", "IEC 61439 Design", "CPRI Type Tested", "ERDA Verified", "CE Components", "MSME Registered"];

export const faqs = [
  { q: "Which panels do you manufacture?", a: "We manufacture LT, PCC, MCC, APFC, PLC automation, VFD, AMF, DG synchronization, ACB incomer, distribution panels, starter panels and servo voltage stabilizers, all customized to your load and site." },
  { q: "Which switchgear brands do you use?", a: "We work with L&T, Schneider Electric, Siemens, ABB, Legrand and other approved makes, or the make list specified by your consultant." },
  { q: "How long does manufacturing take?", a: "Standard panels typically ship in 2 to 3 weeks after drawing approval. Large PCC and MCC lineups take 4 to 6 weeks depending on switchgear availability." },
  { q: "Do you provide installation and commissioning?", a: "Yes. Our site teams handle erection, cable termination, testing and commissioning, and we offer annual maintenance contracts after handover." },
  { q: "Can we inspect panels before dispatch?", a: "Absolutely. Every panel undergoes routine testing, and we welcome client and consultant factory acceptance tests at our Vadodara facility." },
];
