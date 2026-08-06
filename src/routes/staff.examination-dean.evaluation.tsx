import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/examination-dean/evaluation')({
  head: () => ({ meta: [{ title: 'Evaluation — Examination Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Answer Sheet Evaluation" dean="Examination Dean" description="Evaluation center & mark entry tracking" />,
});
