import { createFileRoute } from '@tanstack/react-router';
import { DeanSubPage } from '@/modules/deans/components/DeanSubPage';

export const Route = createFileRoute('/staff/ima/mou')({
  head: () => ({ meta: [{ title: 'MoUs — IMA Dean — EduSuite Pro' }] }),
  component: () => <DeanSubPage title="Memorandums of Understanding (MoUs)" dean="IMA Dean" description="Active MoUs and corporate agreements" />,
});
