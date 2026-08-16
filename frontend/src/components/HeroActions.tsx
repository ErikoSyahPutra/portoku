"use client";

import { useState } from "react";
import { translations } from "@/lib/translations";
import { Profile, Experience, Academic } from "@/lib/api";
import CvModal from "@/components/CvModal";
import {
  HiOutlineRocketLaunch,
  HiOutlineDocumentText,
} from "react-icons/hi2";

interface HeroActionsProps {
  lang: string;
  profile: Profile;
  experiences?: Experience[];
  academics?: Academic[];
}

export default function HeroActions({
  lang,
  profile,
  experiences = [],
  academics = [],
}: HeroActionsProps) {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const t = translations[lang] || translations.id;

  return (
    <>
      <div className="hero-actions">
        <a href="#projects" className="btn btn-primary">
          <HiOutlineRocketLaunch size={18} /> {t.viewWork}
        </a>
        <button
          type="button"
          onClick={() => setIsCvOpen(true)}
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <HiOutlineDocumentText size={18} /> {t.viewCv}
        </button>
      </div>

      <CvModal
        isOpen={isCvOpen}
        onClose={() => setIsCvOpen(false)}
        profile={profile}
        experiences={experiences}
        academics={academics}
        lang={lang}
      />
    </>
  );
}
