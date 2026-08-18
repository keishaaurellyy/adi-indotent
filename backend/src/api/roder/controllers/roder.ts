/**
 * roder controller
 */

import { factories } from '@strapi/strapi';
import { orderFieldsByLayout } from '../../../utils/layout';
import { ITEMS_WITH_IMAGE, MEDIA_POPULATE } from '../../../utils/media';
import { trimSingle } from '../../../utils/response';

const UID = 'api::roder.roder';

const RESPONSE_FIELDS = [
  'id',
  'title',
  'description',
  'hero_image',
  'use_cases',
  'jenis_roder',
  'pilihan_dinding',
  'size_variants',
  'yang_anda_dapatkan',
  'flooring_modul',
  'specifications',
  'pertanyaan_umum',
] as const;

const WITH_IMAGE = ITEMS_WITH_IMAGE;

const TEXT_ONLY = { populate: { items: true } };

const DEFAULT_POPULATE = {
  hero_image: MEDIA_POPULATE,
  use_cases: TEXT_ONLY,
  jenis_roder: WITH_IMAGE,
  pilihan_dinding: WITH_IMAGE,
  size_variants: WITH_IMAGE,
  yang_anda_dapatkan: TEXT_ONLY,
  flooring_modul: WITH_IMAGE,
  specifications: TEXT_ONLY,
  pertanyaan_umum: TEXT_ONLY,
};

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: ctx.query?.populate ?? DEFAULT_POPULATE };

    const fields = await orderFieldsByLayout(strapi, UID, RESPONSE_FIELDS);
    return trimSingle(await super.find(ctx), fields);
  },
}));
