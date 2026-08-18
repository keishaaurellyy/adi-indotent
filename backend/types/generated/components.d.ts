import type { Schema, Struct } from '@strapi/strapi';

export interface ProductEquipmentGroup extends Struct.ComponentSchema {
  collectionName: 'components_product_equipment_groups';
  info: {
    description: 'Grup peralatan (mis. Dekorasi & Ruangan, Kursi & Meja)';
    displayName: 'Equipment Group';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.equipment-item', true>;
  };
}

export interface ProductEquipmentItem extends Struct.ComponentSchema {
  collectionName: 'components_product_equipment_items';
  info: {
    description: 'Item peralatan (mis. Misty Fan, Kursi Futura)';
    displayName: 'Equipment Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_product_faq_items';
  info: {
    description: 'Satu pertanyaan & jawaban';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_product_faq_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi daftar pertanyaan umum';
    displayName: 'FAQ Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.faq-item', true>;
  };
}

export interface ProductFlooringSection extends Struct.ComponentSchema {
  collectionName: 'components_product_flooring_sections';
  info: {
    description: 'Section dengan judul, deskripsi, dan galeri gambar';
    displayName: 'Flooring Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.image-item', true>;
  };
}

export interface ProductImageItem extends Struct.ComponentSchema {
  collectionName: 'components_product_image_items';
  info: {
    description: 'Item berisi gambar saja (mis. galeri Flooring Modul)';
    displayName: 'Image Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface ProductItemSection extends Struct.ComponentSchema {
  collectionName: 'components_product_item_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi daftar item';
    displayName: 'Item Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.section-item', true>;
  };
}

export interface ProductNameImageItem extends Struct.ComponentSchema {
  collectionName: 'components_product_name_image_items';
  info: {
    description: 'Item dengan nama & gambar saja (mis. jenis-jenis Roder)';
    displayName: 'Name & Image Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductNameImageSection extends Struct.ComponentSchema {
  collectionName: 'components_product_name_image_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi item bernama & bergambar';
    displayName: 'Name & Image Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.name-image-item', true>;
  };
}

export interface ProductSectionItem extends Struct.ComponentSchema {
  collectionName: 'components_product_section_items';
  info: {
    description: 'Item umum dalam sebuah section (nama, deskripsi, gambar)';
    displayName: 'Section Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSizeVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_size_variants';
  info: {
    description: 'Varian ukuran (mis. Sarnafil 3x3, 5x5)';
    displayName: 'Size Variant';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSizeVariantSection extends Struct.ComponentSchema {
  collectionName: 'components_product_size_variant_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi daftar varian ukuran';
    displayName: 'Size Variant Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.size-variant', true>;
  };
}

export interface ProductSpecSection extends Struct.ComponentSchema {
  collectionName: 'components_product_spec_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi baris spesifikasi';
    displayName: 'Spec Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.specification', true>;
  };
}

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    description: 'Baris tabel spesifikasi material';
    displayName: 'Specification';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.Text;
  };
}

export interface ProductTextItem extends Struct.ComponentSchema {
  collectionName: 'components_product_text_items';
  info: {
    description: 'Item berisi teks saja (mis. daftar "Yang Anda Dapatkan")';
    displayName: 'Text Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ProductTextSection extends Struct.ComponentSchema {
  collectionName: 'components_product_text_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi daftar teks';
    displayName: 'Text Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.text-item', true>;
  };
}

export interface ProductUseCaseItem extends Struct.ComponentSchema {
  collectionName: 'components_product_use_case_items';
  info: {
    description: 'Kartu "Cocok untuk Berbagai Acara" (tanpa gambar)';
    displayName: 'Use Case Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductUseCaseSection extends Struct.ComponentSchema {
  collectionName: 'components_product_use_case_sections';
  info: {
    description: 'Section dengan judul (group_name) berisi daftar use case';
    displayName: 'Use Case Section';
  };
  attributes: {
    group_name: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'product.use-case-item', true>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'product.equipment-group': ProductEquipmentGroup;
      'product.equipment-item': ProductEquipmentItem;
      'product.faq-item': ProductFaqItem;
      'product.faq-section': ProductFaqSection;
      'product.flooring-section': ProductFlooringSection;
      'product.image-item': ProductImageItem;
      'product.item-section': ProductItemSection;
      'product.name-image-item': ProductNameImageItem;
      'product.name-image-section': ProductNameImageSection;
      'product.section-item': ProductSectionItem;
      'product.size-variant': ProductSizeVariant;
      'product.size-variant-section': ProductSizeVariantSection;
      'product.spec-section': ProductSpecSection;
      'product.specification': ProductSpecification;
      'product.text-item': ProductTextItem;
      'product.text-section': ProductTextSection;
      'product.use-case-item': ProductUseCaseItem;
      'product.use-case-section': ProductUseCaseSection;
    }
  }
}
