import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/research-development/projects')({
  head: () => ({ meta: [{ title: 'Research Projects — R&D Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Research Projects" dean="Research & Development Dean" description="Sponsored and funded research project tracking" />,
});
