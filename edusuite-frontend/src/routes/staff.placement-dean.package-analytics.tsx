import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/placement-dean/package-analytics')({
  head: () => ({ meta: [{ title: 'Package Analytics — Placement Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Salary & Package Analytics" dean="Placement Dean" description="Highest, average & median salary analytics" />,
});
