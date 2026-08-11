import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/purchases')({
  head: () => ({ meta: [{ title: 'Purchase Requests — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Purchase Requests" dean="Finance Dean" description="Procurement requests & purchase order approvals" />,
});
