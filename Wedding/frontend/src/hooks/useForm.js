import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - The initial form values
 * @param {Function} validateFn - A validation function that returns errors object
 * @param {Function} submitFn - The function to call when form is submitted and valid
 * @returns {Object} Form handling utilities
 */
export const useForm = (initialValues = {}, validateFn = () => ({}), submitFn = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * @param {Event|string} event - The change event or field name
   * @param {any} [valueArg] - Value to set (if first param is field name)
   */
  const handleChange = useCallback((event, valueArg) => {
    const isString = typeof event === 'string';
    const name = isString ? event : event.target.name;
    const value = isString ? valueArg : event.target.value;
    
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle form blur - mark field as touched
   * @param {Event|string} event - The blur event or field name
   */
  const handleBlur = useCallback((event) => {
    const name = typeof event === 'string' ? event : event.target.name;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const fieldErrors = validateFn({ [name]: values[name] });
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  }, [values, validateFn]);

  /**
   * Reset form to initial state or new values
   * @param {Object} [newValues] - New values to set
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) event.preventDefault();
    
    // Validate all fields
    const formErrors = validateFn(values);
    setErrors(formErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    // If no errors, call submit function
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await submitFn(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateFn, submitFn]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};

/**
 * Custom hook for simple form handling without validation
 * @param {Object} initialValues - The initial form values
 * @returns {Object} Simple form state and handlers
 */
export const useSimpleForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    setValues,
    handleChange,
    resetForm,
  };
};