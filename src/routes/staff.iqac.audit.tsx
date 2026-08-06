import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/iqac/audit')({
  head: () => ({ meta: [{ title: 'Academic Audit — IQAC Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Academic Audit" dean="IQAC Dean" description="Internal & external quality audit management" />,
});
