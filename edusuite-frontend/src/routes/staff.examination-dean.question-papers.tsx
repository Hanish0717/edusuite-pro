import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/examination-dean/question-papers')({
  head: () => ({ meta: [{ title: 'Question Papers — Examination Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Question Paper Management" dean="Examination Dean" description="Question paper repository, moderation & encryption" />,
});
