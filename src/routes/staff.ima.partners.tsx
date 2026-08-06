import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/partners')({
  head: () => ({ meta: [{ title: 'Industry Partners — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Industry Partners" dean="IMA Dean" description="Corporate partnerships & industry tie-ups" />,
});
