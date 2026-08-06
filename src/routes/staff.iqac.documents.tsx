import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/iqac/documents')({
  head: () => ({ meta: [{ title: 'Documents — IQAC Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Documents Repository" dean="IQAC Dean" description="NAAC/NBA evidentiary documents archive" />,
});
