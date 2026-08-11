import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/placement-dean/training')({
  head: () => ({ meta: [{ title: 'Placement Training — Placement Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Placement Training" dean="Placement Dean" description="Aptitude, technical & mock interview training" />,
});
