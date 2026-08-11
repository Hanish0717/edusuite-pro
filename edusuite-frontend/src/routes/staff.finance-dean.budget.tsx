import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/budget')({
  head: () => ({ meta: [{ title: 'Budget Management — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Budget Management" dean="Finance Dean" description="Institutional budget allocation & department funds" />,
});
