import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/student-dean/profiles')({
  head: () => ({ meta: [{ title: 'Student Profiles — Student Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Student Profiles" dean="Student Dean" description="Individual student profiles and records" />,
});
