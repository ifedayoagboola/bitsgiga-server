import { ProductVariant } from '@src/interfaces/product';
import { fetchAllCategoriesRepo, findCategoryRepo } from '@src/apis/repositories/categories.repository';
import { findStoreRepo } from '@src/apis/repositories/store.repository';
import { STATUS } from '@src/constants/store.constant';
import { BadRequestError, ConflictError } from '@src/common/errors';
import { IStatus } from '@src/interfaces/generals';
import { Product, ProductWithVariants } from '@src/interfaces/product';
import slug from 'slug';
import {
  activateOrDeactivateProductRepo,
  createBulkProductRepo,
  createProductRepo,
  createProductSpecialRepo,
  deleteProductRepo,
  fetchProductsRepo,
  fetchProductsWithVariantsRepo,
  findProductRepo,
  findProductWithVariantsRepo,
  increamentProdutViewsRepo,
  searchProductByName,
  updateProductRepo
} from '../../repositories/product.repository';

import SendboxIntegration from '@src/integrations/sendbox-logistics';
import ElasticSearch from '@src/integrations/elastic-search';
import { logger } from '@src/utilities';

const Sendbox = new SendboxIntegration();
const ElasticSearchService = new ElasticSearch();

export const createProductSrv = async (product: Partial<Product>): Promise<Product> => {
  const foundCategory = await findCategoryRepo({ id: product.category_id });
  if (!foundCategory) {
    throw new BadRequestError('Invalid category id provided');
  }
  const createProduct = await createProductRepo({
    ...product,
    slug: slug(product.name + ' ' + product.user_id),
    status: 'INACTIVE'
  });

  return createProduct;
};
export const createBulkProductSrv = async (product: Partial<Product>): Promise<Product> => {

  const foundStore = await findStoreRepo({ id: product.store_id });
  if (!foundStore) {
    console.log("store not found")
    throw new BadRequestError('Store not found');
  }
  const createProduct = await createProductSpecialRepo(product);

  return createProduct;
};

export const searchProductSrc = async (searchString: string): Promise<Product[]> => {
  try {
    return await searchProductByName(searchString);
  } catch {
    console.log("Error searching products: " + searchString)
    return []
  }
}

export const searchSrv = async (searchString: string, ratings: number): Promise<Product | any> => {
  let result
  try {
    if (ratings) {
      result = await ElasticSearchService.SearchRecord.SearchRecord({
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: searchString,
                  fields: ['name^2', 'description', 'store.brand_name']
                }
              }
            ],
            should: [
              {
                match: {
                  rating: ratings
                }
              }
            ]
          }
        }
      });
    } else {
      result = await ElasticSearchService.SearchRecord.SearchRecord({
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: searchString,
                  fields: ['name^2', 'description', 'store.brand_name']
                }
              }
            ]
          }
        }
      });
    }

    const product_ids = result.map((product: any) => product._source.id);

    return await fetchProductsRepo({ id: { in: product_ids } });
  } catch (error) {
    return []
  }

};


export const findProductSrv = async (data: Partial<Product>): Promise<Product | undefined> => {
  const product = await findProductRepo(data);
  if (!product) {
    throw new BadRequestError('Product not found');
  }
  return product;
};

export const findProductsWithVariantsSrv = async (filters: Partial<Product>): Promise<Product | undefined> => {
  let product: any = await findProductWithVariantsRepo({ id: filters.id });
  if (!product || product.length === 0) {
    throw new BadRequestError('Product not found');
  }

  return product;
};

export const activateOrDeactivateProductSrv = async (filter: Partial<Product>, status: IStatus): Promise<Product> => {
  const product = await findProductRepo({ ...filter });
  if (!product) {
    throw new BadRequestError('Product not found');
  }

  // if (product.status === status) {
  //   throw new BadRequestError(`Product is already ${status}`);
  // }

  const store = await findStoreRepo({ id: product.store_id });
  if (store.status !== STATUS.ACTIVE && status === STATUS.ACTIVE) {
    throw new BadRequestError(`This store is currently inactive kindly activate store.`);
  }

  const updatedStore = await activateOrDeactivateProductRepo({ id: filter.id }, status);
  return updatedStore;
};

export const fetchProductsSrv = async (filters?: Partial<Product>): Promise<Product | Product[]> => {
  const categories = await fetchAllCategoriesRepo({});
  let products = await fetchProductsRepo(filters);

  products = products.map((product: any) => {
    const { product_variants } = product;
    let img_url = null;
    let product_variant_count: number = 0;
    let amount: number = 0;
    let product_variant_id = null;
    let product_variant_spec_id = null;
    if (product_variants && product_variants.length > 0) {
      const foundVariant = product_variants.find((variant: ProductVariant) => variant.status === STATUS.ACTIVE);
      const img_urls = foundVariant?.img_urls;
      img_url = img_urls && img_urls.length > 0 ? img_urls[0] : null;
      product_variant_count = product_variants.length;
      amount = foundVariant?.product_variant_specs[0]?.amount;
      product_variant_id = foundVariant?.id;
      product_variant_spec_id = foundVariant?.product_variant_specs[0]?.id;
    }
    if (!(filters.slug || filters.id)) {
      delete product.product_variants;
    }
    return {
      ...product,
      category: categories.find((c) => c.id === product.category_id)?.category,
      product_variant_id,
      product_variant_spec_id,
      product_variant_count,
      img_url,
      amount: Number(amount)
    };
  });

  if (filters.slug || filters.id) {
    const singleProduct = products[0];
    // await ElasticSearchService.CreateRecord.createRecord(products[0])
    await increamentProdutViewsRepo({ id: singleProduct.id });
    return singleProduct;
  }

  return products;
};

export const findProductsWithVariantRepo = async (filters?: Partial<Product>): Promise<Product[]> => {
  const products = await fetchProductsWithVariantsRepo(filters);
  return products;
};

export const updateProductSrv = async (filter: Partial<Product>, data: Partial<Product>): Promise<Product> => {
  const product = await findProductRepo({ ...filter });
  if (!product) {
    throw new BadRequestError('Product not found');
  }

  const updatedProduct = await updateProductRepo({ id: filter.id }, data);
  return updatedProduct;
};

export const incrementProductViewsSrv = async (filter: Partial<Product>): Promise<Product> => {
  const product = await findProductRepo({ ...filter });
  if (!product) {
    logger.info(`produt not found, views not registered`)
  }

  const updatedProduct = await increamentProdutViewsRepo({ id: filter.id });
  return updatedProduct;
};

export const deleteProductSrv = async (filter: Partial<Product>) => {
  const product = await findProductRepo({ ...filter });
  if (!product) {
    throw new BadRequestError('Product not found');
  }
  const deletedProduct = await deleteProductRepo({ id: filter.id });
  return deletedProduct;
};

export const getProductDeliverySrv = async (payload: any) => {
  const getQuote = await Sendbox.Quote.getQuote(payload);
  return getQuote;
};
