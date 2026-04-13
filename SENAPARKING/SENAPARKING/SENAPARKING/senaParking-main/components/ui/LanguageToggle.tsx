import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "./button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
    >
      {language === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
    </Button>
  );
}