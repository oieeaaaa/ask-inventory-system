import isObjectEmpty from 'js/utils/isObjectEmpty';
import { safeType } from './safety';

export const disconnectSingle = (data) =>
  !isObjectEmpty(data) ? { disconnect: true } : {};

export const disconnectMultiple = (data) => {
  const disconnectList = safeType
    .array(data)
    .map(({ id }) => ({ id: safeType.string(id) }))
    .filter((d) => !!d.id);

  if (!disconnectList.length) return {};

  return {
    disconnect: disconnectList
  };
};

export default {
  disconnectSingle,
  disconnectMultiple
};
