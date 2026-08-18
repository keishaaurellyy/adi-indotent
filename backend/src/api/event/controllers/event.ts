/**
 * event controller
 */

import { factories } from '@strapi/strapi';
import { orderFieldsByLayout } from '../../../utils/layout';
import { MEDIA_POPULATE } from '../../../utils/media';
import { trimList, trimSingle } from '../../../utils/response';

const UID = 'api::event.event';

const RESPONSE_FIELDS = [
  'id',
  'name',
  'event_category',
  'location',
  'duration',
  'is_featured',
  'display_order',
  'image',
] as const;

const DEFAULT_POPULATE = { image: MEDIA_POPULATE };
const DEFAULT_SORT = ['display_order:asc', 'name:asc'];

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      sort: DEFAULT_SORT,
      ...ctx.query,
      populate: ctx.query?.populate ?? DEFAULT_POPULATE,
    };

    const fields = await orderFieldsByLayout(strapi, UID, RESPONSE_FIELDS);
    return trimList(await super.find(ctx), fields);
  },

  async findOne(ctx) {
    ctx.query = { ...ctx.query, populate: ctx.query?.populate ?? DEFAULT_POPULATE };

    const fields = await orderFieldsByLayout(strapi, UID, RESPONSE_FIELDS);
    return trimSingle(await super.findOne(ctx), fields);
  },
}));
