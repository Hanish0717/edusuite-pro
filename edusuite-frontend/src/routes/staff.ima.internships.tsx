import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/internships')({
  head: () => ({ meta: [{ title: 'Internships — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Industry Internships" dean="IMA Dean" description="Student industry internships & corporate training" />,
});
