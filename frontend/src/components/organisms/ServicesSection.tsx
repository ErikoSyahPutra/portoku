"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/atoms/Button";
import { ServiceAccordionItem } from "@/components/molecules/ServiceAccordionItem";
import { PortfolioService } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface ServicesSectionProps {
  services?: PortfolioService[];
  defaultOpenId?: string;
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = defaultPortfolioData.services,
  defaultOpenId,
  className = "",
}) => {
  // By default, open either the provided defaultOpenId, or the 2nd service (#02 UI/UX) as in Figma, or the 1st
  const initialOpenId =
    defaultOpenId ?? (services[1]?.id || services[0]?.id || "");
  const [openServiceId, setOpenServiceId] = useState<string>(initialOpenId);

  const handleToggle = (serviceId: string) => {
    setOpenServiceId((current) => (current === serviceId ? "" : serviceId));
  };

  return (
    <section
      id="services"
      aria-label="Services and Specializations"
      className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {/* Top Header Bar: Section Header on Left + CTA on Right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <SectionHeader
          eyebrow="— My Specialization"
          title="Services I Provide"
          highlightWord="Provide"
          description="Crafting resilient web architectures, modern responsive frontends, and high-performance digital solutions tailored to user needs."
          hasSparkle={true}
        />

        <div className="shrink-0">
          <Button
            href="#contact"
            variant="outline"
            size="md"
            icon={<ArrowUpRight size={16} />}
            iconPosition="right"
          >
            View All Services
          </Button>
        </div>
      </div>

      {/* Accordion List of Services */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {services.map((service) => (
          <ServiceAccordionItem
            key={service.id}
            service={service}
            isOpen={openServiceId === service.id}
            onToggle={() => handleToggle(service.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
