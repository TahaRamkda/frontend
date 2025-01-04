// MonitorFormikContext.js
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

const MonitorFormikContext = ({ setMessagePreview, defaultImage }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    const footer = values.footer || '';
    let media = null;

    if (["4", "2", "3", 2, 3, 4].includes(values.headerType)) {
      const headerText = '';
      media = values.headerMedia || defaultImage?.src || '';

      setMessagePreview((prev) => ({
        ...prev,
        header: headerText,
      }));
    }

    setMessagePreview((prev) => ({
      ...prev,
      footer: footer,
      media: media,
    }));
  }, [values, setMessagePreview, defaultImage]);

  return null;  // No UI to render, just handles logic
};

export default MonitorFormikContext;
