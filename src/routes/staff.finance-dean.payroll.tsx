import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/finance-dean/payroll')({
  head: () => ({ meta: [{ title: 'Payroll — Finance Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Faculty & Staff Payroll" dean="Finance Dean" description="Salary disburals, tax deductions & payroll processing" />,
});
