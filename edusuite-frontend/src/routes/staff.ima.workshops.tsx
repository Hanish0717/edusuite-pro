import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/workshops')({
  head: () => ({ meta: [{ title: 'Workshops — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Industry Workshops" dean="IMA Dean" description="Joint industry workshops & technical seminars" />,
});
