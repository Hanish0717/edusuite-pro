import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/accounts')({
  head: () => ({ meta: [{ title: 'Accounts — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="General Ledger & Accounts" dean="Finance Dean" description="Account statements & balance sheet overview" />,
});
