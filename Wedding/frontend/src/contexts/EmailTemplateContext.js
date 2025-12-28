import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_TEMPLATES, populateTemplate } from '../models/emailTemplateModel';
import { fetchTemplates, createTemplate, updateTemplateApi, deleteTemplateApi } from '../services/emailTemplateService';

/**
 * Context for managing email templates
 * @type {React.Context}
 */
const EmailTemplateContext = createContext();

/**
 * Provider component for EmailTemplateContext
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Provider component
 */
export const EmailTemplateProvider = ({ children }) => {
  // State for templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load templates from API, fallback to defaults
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchTemplates();
        setTemplates(list);
      } catch (e) {
        console.error('Failed to load templates from API, falling back to defaults', e);
        setTemplates(DEFAULT_TEMPLATES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  /**
   * Add a new template
   * 
   * @param {Object} template - Template object
   */
  const addTemplate = async (template) => {
    const created = await createTemplate(template);
    setTemplates(prev => [...prev, created]);
  };
  
  /**
   * Update an existing template
   * 
   * @param {string} id - Template ID
   * @param {Object} updatedTemplate - Updated template data
   */
  const updateTemplate = async (id, updatedTemplate) => {
    const updated = await updateTemplateApi(id, updatedTemplate);
    setTemplates(prev => prev.map(t => t.id === id ? updated : t));
  };
  
  /**
   * Delete a template
   * 
   * @param {string} id - Template ID
   */
  const deleteTemplate = async (id) => {
    await deleteTemplateApi(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };
  
  /**
   * Reset templates to defaults
   */
  const resetTemplates = () => {
    setTemplates(DEFAULT_TEMPLATES);
  };
  
  /**
   * Get a template by ID
   * 
   * @param {string} id - Template ID
   * @returns {Object|undefined} - Template object if found
   */
  const getTemplateById = (id) => {
    return templates.find(template => template.id === id);
  };
  
  /**
   * Prepare a template with guest data
   * 
   * @param {string} templateId - Template ID
   * @param {Object} guestData - Guest data for template variables
   * @returns {Object} - Prepared template with populated content
   */
  const prepareTemplate = (templateId, guestData) => {
    const template = getTemplateById(templateId);
    if (!template) return null;
    
    const preparedTemplate = { ...template };
    preparedTemplate.text = populateTemplate(template.text, guestData);
    preparedTemplate.html = populateTemplate(template.html, guestData);
    preparedTemplate.subject = populateTemplate(template.subject, guestData);
    
    return preparedTemplate;
  };
  
  const value = {
    templates,
    loading,
    selectedTemplate,
    setSelectedTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    resetTemplates,
    getTemplateById,
    prepareTemplate
  };
  
  return (
    <EmailTemplateContext.Provider value={value}>
      {children}
    </EmailTemplateContext.Provider>
  );
};

/**
 * Hook for using EmailTemplateContext
 * 
 * @returns {Object} - Email template context values
 */
export const useEmailTemplates = () => {
  const context = useContext(EmailTemplateContext);
  if (!context) {
    throw new Error('useEmailTemplates must be used within an EmailTemplateProvider');
  }
  return context;
};