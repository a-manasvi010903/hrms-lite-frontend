import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return dateString;
    return format(date, formatStr);
  } catch {
    return dateString;
  }
};

export const formatDateForAPI = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return format(date, 'yyyy-MM-dd');
};

export const getTodayDate = () => format(new Date(), 'yyyy-MM-dd');

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'present': return 'badge-success';
    case 'absent': return 'badge-danger';
    default: return 'badge-gray';
  }
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name) => {
  const colors = [
    'var(--primary-500)',
    'var(--accent-500)',
    'var(--success-500)',
    'var(--warning-500)',
    'var(--danger-500)',
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};