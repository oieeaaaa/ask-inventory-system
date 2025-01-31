import { safeType } from 'js/utils/safety';
import omit from 'lodash.omit';

/* ============================================================================
  CONNECT OR CREATE
 ============================================================================ */
export const connectOrCreate = (payload = {}, uniqueKey = 'id') => ({
  connectOrCreate: {
    where: {
      [uniqueKey]: safeType.string(payload[uniqueKey])
    },
    create: payload
  }
});

export const connectOrCreateByName = (payload) =>
  connectOrCreate(payload, 'name');

export const multiConnectOrCreate = (list = [], uniqueKey = 'id') => ({
  connectOrCreate: list.map((listItem) => ({
    where: {
      [uniqueKey]: safeType.string(listItem[uniqueKey])
    },
    create: listItem
  }))
});

export const multiConnectOrCreateByName = (payload) =>
  multiConnectOrCreate(
    payload.map((item) => omit(item, ['id'])),
    'name'
  );

/* ============================================================================
  CONNECT
 ============================================================================ */
export const connect = (item, uniqueKey = 'id') => ({
  connect: {
    [uniqueKey]: safeType.string(item[uniqueKey])
  }
});

export const connectByName = (item) => connect(omit(item, ['id']), 'name');

export const multiConnect = (items, uniqueKey = 'id') => ({
  connect: items.map((item) => ({
    [uniqueKey]: safeType.string(item[uniqueKey])
  }))
});

/* ============================================================================
  CREATE
 ============================================================================ */
export const create = (item) => ({
  create: item
});

export const multiCreate = (items) => ({
  create: items
});

/* ============================================================================
  SELECT
 ============================================================================ */
export const select = (attributes) => ({
  select: attributes.reduce(
    (selected, attribute) => ({ ...selected, [attribute]: true }),
    {}
  )
});

export const selectSingle = (attribute) => ({
  select: { [attribute]: true }
});
