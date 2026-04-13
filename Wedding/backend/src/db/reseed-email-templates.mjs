/**
 * Deletes all rows in `email_templates` and inserts `DEFAULT_EMAIL_TEMPLATES`.
 * Run on deploy when REPLACE_EMAIL_TEMPLATES=true (see docker-entrypoint.sh).
 */
import EmailTemplateRepository from '../../repositories/EmailTemplateRepository.js';
import { DEFAULT_EMAIL_TEMPLATES } from '../seed/emailTemplates.js';
import { getDb } from './database.js';

const db = getDb();
const repo = new EmailTemplateRepository(db);

await db.query('DELETE FROM email_templates');
for (const t of DEFAULT_EMAIL_TEMPLATES) {
  await repo.create(t);
}

console.log(
  `[reseed-email-templates] Inserted ${DEFAULT_EMAIL_TEMPLATES.length} template(s):`,
  DEFAULT_EMAIL_TEMPLATES.map((x) => x.id).join(', ')
);

await db.pool.end();
