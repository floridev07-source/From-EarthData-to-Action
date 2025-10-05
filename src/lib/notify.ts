import { toast } from 'sonner';

export function notificationsEnabled(): boolean {
  const saved = localStorage.getItem('notifications');
  return saved === null ? true : saved === 'true';
}

export const notify = {
  success: (message: string) => {
    if (notificationsEnabled()) toast.success(message);
  },
  info: (message: string) => {
    if (notificationsEnabled()) toast.info(message);
  },
  error: (message: string) => {
    if (notificationsEnabled()) toast.error(message);
  },
  message: (message: string) => {
    if (notificationsEnabled()) toast(message);
  },
};

export default notify;
