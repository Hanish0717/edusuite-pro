import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/examination-dean/invigilators')({
  head: () => ({ meta: [{ title: 'Invigilators — Examination Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Invigilators Allocation" dean="Examination Dean" description="Exam hall invigilation duty roster & allocation" />,
});
