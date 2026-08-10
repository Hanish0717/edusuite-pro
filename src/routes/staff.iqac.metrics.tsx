import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/iqac/metrics')({
  head: () => ({ meta: [{ title: 'Quality Metrics — IQAC Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Quality Metrics" dean="IQAC Dean" description="Key performance metrics and quality benchmarks" />,
});
