
import { ILRequest, ILResponse, LCback, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { collection_add, collection_find_all, collection_find_one, collection_find_one_dict, collection_find_all_dict, collection_del_one_dict, collection_init, mkid, prepare_filters } from '../../liwe/arangodb';
import { DocumentCollection } from 'arangojs/collection';

import {
	Product, ProductKeys
} from './types';

let _liwe: ILiWE = null;

let _coll_products: DocumentCollection = null;

const COLL_PRODUCTS = "products";

/*=== d2r_start __file_header === */
import { keys_filter, keys_valid, set_attr } from '../../liwe/utils';
import { system_domain_get_by_session } from '../system/methods';
import { tag_obj } from '../tag/methods';

const _product_get = async ( req: ILRequest, id: string, return_empty: boolean = false ): Promise<Product> => {
	const domain = await system_domain_get_by_session( req );
	if ( !id && return_empty ) return { id: mkid( 'product' ), domain: domain.code } as Product;
	if ( !id ) return null;

	return await collection_find_one( _liwe.db, `FOR u IN ${ COLL_PRODUCTS } FILTER u.id == @id RETURN u`, { id } );
};

const _product_save = ( req: ILRequest, params: Product, return_empty = true, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		let code_ok = false;
		const err = { message: "Product code already in use" };
		try {
			const cprod = await product_get( req, null, params.code, null );
			if ( cprod.id === params.id )
				code_ok = true;

		} catch ( e ) {
			// If we don't find the product, the code is new
			code_ok = true;
		}

		if ( !code_ok ) {
			return cback ? cback( err ) : reject( err );
		}

		let prod = await _product_get( req, params.id, return_empty );

		if ( !prod ) {
			err.message = 'Product not found';
			return cback ? cback( err ) : reject( err );
		}

		if ( params.tags ) {
			const tags = params.tags;
			delete params.tags;

			await tag_obj( req, tags, prod, 'product' );
		}

		prod = { ...prod, ...keys_valid( params ) };

		prod = await collection_add( _coll_products, prod, false, ProductKeys );

		return cback ? cback( null, prod ) : resolve( prod );
	} );
};
/*=== d2r_end __file_header ===*/

/**
 * Adds a new product
 *
 * @param name - Product name [req]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [opt]
 * @param code_forn - Product unique code assigned by the provider [opt]
 * @param sku - Product SKU [opt]
 * @param description - Product description [opt]
 * @param short_description - Product short description [opt]
 * @param url - Product original URL [opt]
 * @param cost - Cost for buying it [opt]
 * @param price_net - The price, VAT free [opt]
 * @param price_vat - The price with VAT [opt]
 * @param curr_price_net - The current price, VAT free [opt]
 * @param curr_price_vat - The current price with VAT [opt]
 * @param vat - VAT applied [opt]
 * @param free - Flag T/F if the product is free [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [opt]
 * @param ordered - Quantity in back order [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [opt]
 * @param visible - Flag T/F if the product is visible [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [opt]
 * @param status - Product status [opt]
 * @param weight - Product weight (in grams) [opt]
 * @param width - Width of the product in millimiters [opt]
 * @param height - Height of the product in millimiters [opt]
 * @param depth - Depth of the product in millimiters [opt]
 * @param tags - Product tags [opt]
 *
 */
export const post_product_admin_add = ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability: number = 0, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free: boolean = false, discount?: number, quant: number = 0, ordered: number = 0, available?: Date, level: number = 0, visible: boolean = true, relevance: number = 0, status: number = 0, weight: number = 0, width: number = 0, height: number = 0, depth: number = 0, tags?: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start post_product_admin_add ===*/
		const p: Product = await _product_save( req, {
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags
		}, true );

		return cback ? cback( null, p ) : resolve( p );
		/*=== d2r_end post_product_admin_add ===*/
	} );
};

/**
 * Updates an existing product
 *
 * @param id - Product ID [req]
 * @param name - Product name [opt]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [opt]
 * @param code_forn - Product unique code assigned by the provider [opt]
 * @param sku - Product SKU [opt]
 * @param description - Product description [opt]
 * @param short_description - Product short description [opt]
 * @param url - Product original URL [opt]
 * @param cost - Cost for buying it [opt]
 * @param price_net - The price, VAT free [opt]
 * @param price_vat - The price with VAT [opt]
 * @param curr_price_net - The current price, VAT free [opt]
 * @param curr_price_vat - The current price with VAT [opt]
 * @param vat - VAT applied [opt]
 * @param free - Flag T/F if the product is free [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [opt]
 * @param ordered - Quantity in back order [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [opt]
 * @param visible - Flag T/F if the product is visible [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [opt]
 * @param status - Product status [opt]
 * @param weight - Product weight (in grams) [opt]
 * @param width - Width of the product in millimiters [opt]
 * @param height - Height of the product in millimiters [opt]
 * @param depth - Depth of the product in millimiters [opt]
 * @param tags - Product tags [opt]
 *
 */
export const patch_product_admin_update = ( req: ILRequest, id: string, name?: string, code?: string, id_maker?: string, id_category?: string, id_availability: number = 0, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free: boolean = false, discount?: number, quant: number = 0, ordered: number = 0, available?: Date, level: number = 0, visible: boolean = true, relevance: number = 0, status: number = 0, weight: number = 0, width: number = 0, height: number = 0, depth: number = 0, tags?: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start patch_product_admin_update ===*/
		const p: Product = await _product_save( req, {
			id,
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags
		}, false );

		return cback ? cback( null, p ) : resolve( p );
		/*=== d2r_end patch_product_admin_update ===*/
	} );
};

/**
 * Modifies some fields
 *
 * @param id - The product ID [req]
 * @param data - The field / value to patch [req]
 *
 */
export const patch_product_admin_fields = ( req: ILRequest, id: string, data: any, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start patch_product_admin_fields ===*/
		const p: Product = await _product_save( req, { id, ...data }, false );

		return cback ? cback( null, p ) : resolve( p );
		/*=== d2r_end patch_product_admin_fields ===*/
	} );
};

/**
 * List all products
 *
 * @param id_category - The category the product belongs to [opt]
 * @param skip - First line to return [opt]
 * @param rows - How many rows to return [opt]
 *
 */
export const get_product_admin_list = ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCback = null ): Promise<Product[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_product_admin_list ===*/
		const domain = await system_domain_get_by_session( req );
		const prods: Product[] = await collection_find_all_dict( req.db, COLL_PRODUCTS, { domain: domain.code, id_category }, ProductKeys, { rows, skip } );

		return cback ? cback( null, prods ) : resolve( prods );
		/*=== d2r_end get_product_admin_list ===*/
	} );
};

/**
 * Deletes a product
 *
 * @param id - The product id to be deleted [req]
 *
 */
export const delete_product_admin_del = ( req: ILRequest, id: string, cback: LCback = null ): Promise<string> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start delete_product_admin_del ===*/
		await collection_del_one_dict( req.db, COLL_PRODUCTS, { id } );

		return cback ? cback( null, id ) : resolve( id );
		/*=== d2r_end delete_product_admin_del ===*/
	} );
};

/**
 * Tag a product
 *
 * @param id - The product ID [req]
 * @param tags - A list of tags to be added to the user [req]
 *
 */
export const post_product_admin_tag = ( req: ILRequest, id: string, tags: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start post_product_admin_tag ===*/

		/*=== d2r_end post_product_admin_tag ===*/
	} );
};

/**
 * Get all product details
 *
 * @param id - Product unique ID [opt]
 * @param code - Product unique code [opt]
 * @param code_forn - Product manufacturer's code [opt]
 *
 */
export const get_product_details = ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_product_details ===*/
		product_get( req, id, code, code_forn, ( err, prod ) => {
			if ( err ) return cback ? cback( err ) : reject( err );

			keys_filter( prod, ProductKeys );

			return cback ? cback( null, prod ) : resolve( prod );
		} );
		/*=== d2r_end get_product_details ===*/
	} );
};

/**
 * List all products
 *
 * @param id_category - The category the product belongs to [opt]
 * @param skip - First line to return [opt]
 * @param rows - How many rows to return [opt]
 *
 */
export const get_product_list = ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCback = null ): Promise<Product[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_product_list ===*/
		const domain = await system_domain_get_by_session( req );
		const res: Product[] = await collection_find_all_dict( req.db, COLL_PRODUCTS, { id_category, visible: true, domain: domain.code }, ProductKeys, { rows, skip } );
		return cback ? cback( null, res ) : resolve( res );
		/*=== d2r_end get_product_list ===*/
	} );
};

/**
 * Initializes the product database
 *
 * @param liwe - LiWE full config [req]
 *
 */
export const product_db_init = ( liwe: ILiWE, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		_liwe = liwe;

		_coll_products = await collection_init( liwe.db, COLL_PRODUCTS, [
			{ type: "persistent", fields: [ "id" ], unique: true },
			{ type: "persistent", fields: [ "domain" ], unique: false },
			{ type: "persistent", fields: [ "id_owner" ], unique: false },
			{ type: "persistent", fields: [ "id_maker" ], unique: false },
			{ type: "persistent", fields: [ "id_category" ], unique: false },
			{ type: "persistent", fields: [ "id_availability" ], unique: false },
			{ type: "persistent", fields: [ "code" ], unique: true },
			{ type: "persistent", fields: [ "code_forn" ], unique: false },
			{ type: "persistent", fields: [ "sku" ], unique: false },
			{ type: "persistent", fields: [ "name" ], unique: false },
			{ type: "persistent", fields: [ "free" ], unique: false },
			{ type: "persistent", fields: [ "visible" ], unique: false },
			{ type: "persistent", fields: [ "status" ], unique: false },
			{ type: "persistent", fields: [ "relevance" ], unique: false },
			{ type: "persistent", fields: [ "tags[*]" ], unique: false },
		] );

		/*=== d2r_start product_db_init ===*/

		/*=== d2r_end product_db_init ===*/
	} );
};

/**
 * Creates a new product
 *
 * @param req - The ILRequest [req]
 * @param name - Product name [req]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [opt]
 * @param code_forn - Product unique code assigned by the provider [opt]
 * @param sku - Product SKU [opt]
 * @param description - Product description [opt]
 * @param short_description - Product short description [opt]
 * @param url - Product original URL [opt]
 * @param cost - Cost for buying it [opt]
 * @param price_net - The price, VAT free [opt]
 * @param price_vat - The price with VAT [opt]
 * @param curr_price_net - The current price, VAT free [opt]
 * @param curr_price_vat - The current price with VAT [opt]
 * @param vat - VAT applied [opt]
 * @param free - Flag T/F if the product is free [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [opt]
 * @param ordered - Quantity in back order [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [opt]
 * @param visible - Flag T/F if the product is visible [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [opt]
 * @param status - Product status [opt]
 * @param weight - Product weight (in grams) [opt]
 * @param width - Width of the product in millimiters [opt]
 * @param height - Height of the product in millimiters [opt]
 * @param depth - Depth of the product in millimiters [opt]
 * @param tags - Product tags [opt]
 *
 */
export const product_create = ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability: number = 0, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free: boolean = false, discount?: number, quant: number = 0, ordered: number = 0, available?: Date, level: number = 0, visible: boolean = true, relevance: number = 0, status: number = 0, weight: number = 0, width: number = 0, height: number = 0, depth: number = 0, tags?: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start product_create ===*/
		const p: Product = await _product_save( req, {
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags
		}, true );

		return cback ? cback( null, p ) : resolve( p );
		/*=== d2r_end product_create ===*/
	} );
};

/**
 * Creates a new product
 *
 * @param req - The ILRequest [req]
 * @param id - Product id [opt]
 * @param code - Product code [opt]
 * @param code_forn - Code forn [opt]
 *
 */
export const product_get = ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start product_get ===*/
		const [ filters, values ] = prepare_filters( 'prod', { id, code, code_forn } );
		const err = { "message": "No conditions specified" };

		if ( !filters ) return cback ? cback( err ) : reject( err );

		const prod = await collection_find_one( req.db, `FOR prod IN ${ COLL_PRODUCTS } ${ filters } RETURN prod`, values );

		if ( !prod ) {
			err.message = "Product not found";
			return cback ? cback( err ) : reject( err );
		}

		return cback ? cback( null, prod ) : resolve( prod );
		/*=== d2r_end product_get ===*/
	} );
};
