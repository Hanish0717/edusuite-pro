import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/fees')({
  head: () => ({ meta: [{ title: 'Fee Collection — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Fee Collection" dean="Finance Dean" description="Tuition, hostel & transport fee collection ledger" />,
});
