import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/industrial-visits')({
  head: () => ({ meta: [{ title: 'Industrial Visits — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Industrial Visits" dean="IMA Dean" description="Student factory & corporate site visits" />,
});
