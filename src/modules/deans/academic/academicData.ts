import { QuickAction, RecentActivity, Notification } from '@/modules/deans/types';
import { toast } from 'sonner';
import { Check, X, Download } from 'lucide-react';

export const quickActions = [
  {
    label: 'Approve Curriculum',
    onClick: () => {
      toast.success('Curriculum approved');
    },
  },
  {
    label: 'Approve Timetable',
    onClick: () => {
      toast.success('Timetable approved');
    },
  },
  {
    label: 'Generate Academic Report',
    onClick: () => {
      toast.success('Academic report generated');
    },
  },
];

export const recentActivities = [
  { title: 'Curriculum Updated', description: 'Updated CSE curriculum for 2024‑25', time: '2h ago' },
  { title: 'Timetable Approved', description: 'Approved June exam timetable', time: '5h ago' },
  { title: 'Department Audit', description: 'Audit completed for Mechanical Dept.', time: '1d ago' },
];

export const notifications = [
  { title: 'NAAC Accreditation Reminder', time: 'Today' },
  { title: 'New Scholarship Applications', time: 'Yesterday' },
  { title: 'Faculty Workload Alert', time: '2 days ago' },
];
