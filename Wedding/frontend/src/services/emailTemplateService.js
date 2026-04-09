import { apiFetch } from './apiFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function fetchTemplates() {
  return apiFetch(`${API_BASE}/api/email-templates`);
}

export async function createTemplate(template) {
  return apiFetch(`${API_BASE}/api/email-templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  });
}

export async function updateTemplateApi(id, updates) {
  return apiFetch(`${API_BASE}/api/email-templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteTemplateApi(id) {
  return apiFetch(`${API_BASE}/api/email-templates/${id}`, { method: 'DELETE' });
}
