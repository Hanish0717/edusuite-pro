import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/research-development/innovation')({
  head: () => ({ meta: [{ title: 'Innovation — R&D Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Innovation Cell" dean="Research & Development Dean" description="Institution's Innovation Council (IIC) activities" />,
});
