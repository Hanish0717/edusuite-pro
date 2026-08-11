import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/research-development/grants')({
  head: () => ({ meta: [{ title: 'Grants — R&D Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Research Grants" dean="Research & Development Dean" description="Government and DST/SERB grant proposals & tracking" />,
});
