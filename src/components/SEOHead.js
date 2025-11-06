import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

const SEOHead = ({ 
  title = null, 
  description = null, 
  keywords = null,
  pageType = 'website'
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    // 设置页面标题
    const pageTitle = title || t('app.title', language);
    document.title = pageTitle;

    // 设置或更新meta标签
    const setMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setMetaProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 基本SEO标签
    setMetaTag('description', description || t('app.description', language));
    setMetaTag('keywords', keywords || t('app.keywords', language));
    setMetaTag('author', 'AI Interview Assistant');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // 语言相关
    const htmlElement = document.documentElement;
    htmlElement.lang = language;

    // Open Graph标签
    setMetaProperty('og:title', pageTitle);
    setMetaProperty('og:description', description || t('app.description', language));
    setMetaProperty('og:type', pageType);
    setMetaProperty('og:locale', language);
    setMetaProperty('og:site_name', t('app.title', language));

    // Twitter Card标签
    setMetaTag('twitter:card', 'summary');
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', description || t('app.description', language));

    // 清理函数
    return () => {
      // 不需要清理，因为这些是全局设置
    };
  }, [language, title, description, keywords, pageType]);

  return null; // 这个组件不渲染任何内容
};

export default SEOHead;
