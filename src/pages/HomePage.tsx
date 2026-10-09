import Hero from "../components/home/Hero";
import Marquee from "../components/home/Marquee";
import Showroom from "../components/home/Showroom";
import Anatomy from "../components/home/Anatomy";
import {
  AboutBlock, CertificationsBlock, FaqBlock, IndustriesBlock, ProcessBlock, ProductsShowcase, ProjectsBlock, ServicesBlock, TestimonialsBlock,
} from "../components/home/Sections";
import { CTA } from "../components/kit";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={["LT Panels", "PCC Panels", "MCC Panels", "APFC Panels", "PLC Automation", "VFD Panels", "DG Synchronization", "AMF Panels"]} />
      <Showroom />
      <Anatomy />
      <ProductsShowcase />
      <AboutBlock />
      <ServicesBlock />
      <ProcessBlock />
      <Marquee tone="orange" items={["Designed to IEC 61439", "Tested before dispatch", "Pan-India commissioning", "24/7 service support"]} />
      <IndustriesBlock />
      <ProjectsBlock />
      <TestimonialsBlock />
      <CertificationsBlock />
      <FaqBlock />
      <CTA />
    </>
  );
}
