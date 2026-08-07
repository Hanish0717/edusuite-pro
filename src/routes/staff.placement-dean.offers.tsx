import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/placement-dean/offers')({
  head: () => ({ meta: [{ title: 'Job Offers — Placement Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Job Offers & CTC" dean="Placement Dean" description="Issued offer letters & CTC tracking" />,
});
