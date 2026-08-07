import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/guest-lectures')({
  head: () => ({ meta: [{ title: 'Guest Lectures — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Guest Lectures" dean="IMA Dean" description="Industry guest speaker sessions & expert talks" />,
});
