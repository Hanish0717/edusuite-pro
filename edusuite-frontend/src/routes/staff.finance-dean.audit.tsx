import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/audit')({
  head: () => ({ meta: [{ title: 'Financial Audit — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Financial Audit" dean="Finance Dean" description="Internal & external financial auditing" />,
});
