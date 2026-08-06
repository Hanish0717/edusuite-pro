import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/research-development/scholars')({
  head: () => ({ meta: [{ title: 'Research Scholars — R&D Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Ph.D Scholars" dean="Research & Development Dean" description="Doctoral scholars & Ph.D program tracking" />,
});
