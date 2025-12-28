const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function fetchTemplates() {
	const res = await fetch(`${API_BASE}/api/email-templates`);
	if (!res.ok) throw new Error('Failed to fetch templates');
	return res.json();
}

export async function createTemplate(template) {
	const res = await fetch(`${API_BASE}/api/email-templates`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(template),
	});
	if (!res.ok) throw new Error('Failed to create template');
	return res.json();
}

export async function updateTemplateApi(id, updates) {
	const res = await fetch(`${API_BASE}/api/email-templates/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updates),
	});
	if (!res.ok) throw new Error('Failed to update template');
	return res.json();
}

export async function deleteTemplateApi(id) {
	const res = await fetch(`${API_BASE}/api/email-templates/${id}`, { method: 'DELETE' });
	if (!res.ok) throw new Error('Failed to delete template');
	return res.json();
}
