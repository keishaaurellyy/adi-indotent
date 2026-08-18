/**
 * peralatan-pendukung controller
 */

import { factories } from '@strapi/strapi';
import { orderFieldsByLayout } from '../../../utils/layout';
import { ITEMS_WITH_IMAGE, MEDIA_POPULATE } from '../../../utils/media';
import { trimSingle } from '../../../utils/response';

const UID = 'api::peralatan-pendukung.peralatan-pendukung';

const RESPONSE_FIELDS = [
  'id',
  'title',
  'description',
  'hero_image',
  'equipment_groups',
] as const;

const DEFAULT_POPULATE = {
  hero_image: MEDIA_POPULATE,
  equipment_groups: ITEMS_WITH_IMAGE,
};

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: ctx.query?.populate ?? DEFAULT_POPULATE };

    const fields = await orderFieldsByLayout(strapi, UID, RESPONSE_FIELDS);
    return trimSingle(await super.find(ctx), fields);
  },
}));
