import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/examination-dean/schedule')({
  head: () => ({ meta: [{ title: 'Exam Schedule — Examination Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Exam Schedule" dean="Examination Dean" description="End-semester & mid-term examination timetables" />,
});
