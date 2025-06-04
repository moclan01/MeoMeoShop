import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Lưu ngôn ngữ đã chọn vào localStorage
    localStorage.setItem('language', lng);
  };

  // Lấy ngôn ngữ từ localStorage khi component được mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="language-switcher">
      <ButtonGroup size="sm">
        <Button
          variant={i18n.language === 'en' ? 'primary' : 'outline-primary'}
          onClick={() => changeLanguage('en')}
          className="language-button"
        >
          EN
        </Button>
        <Button
          variant={i18n.language === 'vi' ? 'primary' : 'outline-primary'}
          onClick={() => changeLanguage('vi')}
          className="language-button"
        >
          VI
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LanguageSwitcher; 