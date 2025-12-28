import React, { useState } from 'react';


const defaultTheme = {
  primary: '#000000',
  secondary: '#ffffff',
  accent: '#043A14',
  fontSize: 16,
};


function ThemeSelector({ customstyle = {} }) {
  const [theme, setTheme] = useState(defaultTheme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newTheme = { ...theme, [name]: name === 'fontSize' ? Number(value) : value };
    setTheme(newTheme);
    if (name === 'primary') {
      document.documentElement.style.setProperty('--primary-color', value);
    }
    if (name === 'secondary') {
      document.documentElement.style.setProperty('--secondary-color', value);
    }
    if (name === 'accent') {
      document.documentElement.style.setProperty('--accent-color', value);
    }
    if (name === 'fontSize') {
      document.documentElement.style.setProperty('--global-font-size', `${newTheme.fontSize}px`);
    }
    // Set background to secondary and text to primary
    document.documentElement.style.setProperty('--global-bg', newTheme.secondary);
    document.documentElement.style.setProperty('--global-color', newTheme.primary);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      minWidth: 200,
      fontFamily: 'inherit',
      fontSize: 14,
      color: '#232323',
      opacity: 0.95,
      ...customstyle
    }}>
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Theme Selector</div>
      <div style={{ marginBottom: 8 }}>
        <label>Primary (Main): </label>
        <input type="color" name="primary" value={theme.primary} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Secondary: </label>
        <input type="color" name="secondary" value={theme.secondary} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Accent: </label>
        <input type="color" name="accent" value={theme.accent} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Font Size: </label>
        <input type="range" name="fontSize" min="12" max="32" value={theme.fontSize} onChange={handleChange} />
        <span style={{ marginLeft: 8 }}>{theme.fontSize}px</span>
      </div>
    </div>
  );
}

export default ThemeSelector;
