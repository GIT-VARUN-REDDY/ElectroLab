export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length <= length ? text : text.substring(0, length) + '...';
};

export const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

export const getDifficultyColor = (level) => {
  const colors = {
    beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
    intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  };
  return colors[level] || colors.beginner;
};

export const getLevelBadge = (level) => {
  const labels = { diploma: 'Diploma', btech: 'B.Tech', ieee: 'IEEE', finalyear: 'Final Year', general: 'General' };
  return labels[level] || 'General';
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};