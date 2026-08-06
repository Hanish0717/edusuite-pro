import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/iqac/criteria')({
  head: () => ({ meta: [{ title: 'NAAC Criteria — IQAC Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="NAAC Criteria" dean="IQAC Dean" description="7 NAAC Criteria breakdown & performance" />,
});
