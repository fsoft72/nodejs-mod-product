/*
 * This file has been generated by flow2code
 * See: https://flow.liwe.org
 */

import { ILRequest, ILResponse, LCback, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { $l } from '../../liwe/locale';
import { system_permissions_register } from '../system/methods';

import {
	Product, ProductKeys,
} from './types';

import _module_perms from './perms';

let _liwe: ILiWE = null;

const _ = ( txt: string, vals: any = null, plural = false ) => {
	return $l( txt, vals, plural, "product" );
};

const COLL_PRODUCTS = "products";

/*=== f2c_start __file_header === */
import { keys_filter, keys_valid, mkid, set_attr } from '../../liwe/utils';
import { system_domain_get_by_session } from '../system/methods';
import { tag_obj } from '../tag/methods';
import { adb_query_one, adb_record_add, adb_find_all, adb_find_one, adb_prepare_filters, adb_del_one, adb_collection_init } from '../../liwe/db/arango';

const _product_get = async ( req: ILRequest, id: string, return_empty: boolean = false ): Promise<Product> => {
	const domain = await system_domain_get_by_session( req );
	let prod: Product = null;

	if ( id ) {
		prod = await adb_find_one( req.db, COLL_PRODUCTS, { id, domain: domain.code } );
		if ( prod ) return prod;
	}

	if ( !prod && return_empty ) {
		return {
			id: id || mkid( 'prod' ),
			domain: domain.code,
			id_owner: req.user.id,
		};
	}

	return null;
};

const _product_save = ( req: ILRequest, err: ILError, params: Product, return_empty = true, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		err.message = "";

		// check if product code is not already in use
		const cprod = await product_get( req, null, params.code, null );
		if ( cprod && params.id && cprod.id !== params.id ) {
			err.message = "Product code already in use";
			return cback ? cback( null, null ) : resolve( null );
		}

		let prod = await _product_get( req, params.id, return_empty );

		if ( !prod ) {
			err.message = 'Product not found';
			return cback ? cback( null, null ) : resolve( null );
		}

		if ( params.tags ) {
			const tags = params.tags;
			delete params.tags;

			await tag_obj( req, tags, prod.id, 'product' );
		}

		prod = { ...prod, ...keys_valid( params ) };

		prod = await adb_record_add( req.db, COLL_PRODUCTS, prod, ProductKeys );

		return cback ? cback( null, prod ) : resolve( prod );
	} );
};
/*=== f2c_end __file_header ===*/

// {{{ post_product_admin_add ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], single?: boolean, cback: LCBack = null ): Promise<Product>
/**
 *
 * Adds product in the system.
 * This function returns the full `Product` structure
 *
 * @param name - Product name [req]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [default: 0] [opt]
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
 * @param free - Flag T/F if the product is free [default: false] [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [default: 0] [opt]
 * @param ordered - Quantity in back order [default: 0] [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [default: 0] [opt]
 * @param visible - Flag T/F if the product is visible [default: true] [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [default: 0] [opt]
 * @param status - Product status [default: 0] [opt]
 * @param weight - Product weight (in grams) [default: 0] [opt]
 * @param width - Width of the product in millimiters [default: 0] [opt]
 * @param height - Height of the product in millimiters [default: 0] [opt]
 * @param depth - Depth of the product in millimiters [default: 0] [opt]
 * @param tags - Product tags [opt]
 * @param single - If T, only one item per order can be bought [opt]
 *
 * @return product: Product
 *
 */
export const post_product_admin_add = ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], single?: boolean, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start post_product_admin_add ===*/
		const err: ILError = { message: "" };
		const domain = await system_domain_get_by_session( req );
		const p: Product = await _product_save( req, err, {
			id: mkid( 'prod' ),
			domain: domain.code,
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags, single
		}, true );

		if ( err.message ) return cback ? cback( err ) : reject( err );

		return cback ? cback( null, p ) : resolve( p );
		/*=== f2c_end post_product_admin_add ===*/
	} );
};
// }}}

// {{{ patch_product_admin_update ( req: ILRequest, id: string, name?: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], cback: LCBack = null ): Promise<Product>
/**
 *
 * Updates the product specified by `id`.
 * This function returns the full `Product` structure
 *
 * @param id - Product ID [req]
 * @param name - Product name [opt]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [default: 0] [opt]
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
 * @param free - Flag T/F if the product is free [default: false] [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [default: 0] [opt]
 * @param ordered - Quantity in back order [default: 0] [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [default: 0] [opt]
 * @param visible - Flag T/F if the product is visible [default: true] [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [default: 0] [opt]
 * @param status - Product status [default: 0] [opt]
 * @param weight - Product weight (in grams) [default: 0] [opt]
 * @param width - Width of the product in millimiters [default: 0] [opt]
 * @param height - Height of the product in millimiters [default: 0] [opt]
 * @param depth - Depth of the product in millimiters [default: 0] [opt]
 * @param tags - Product tags [opt]
 *
 * @return product: Product
 *
 */
export const patch_product_admin_update = ( req: ILRequest, id: string, name?: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start patch_product_admin_update ===*/
		const err = { message: "" };
		const p: Product = await _product_save( req, err, {
			id,
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags
		}, false );

		if ( err.message ) return cback ? cback( err ) : reject( err );

		return cback ? cback( null, p ) : resolve( p );
		/*=== f2c_end patch_product_admin_update ===*/
	} );
};
// }}}

// {{{ patch_product_admin_fields ( req: ILRequest, id: string, data: any, cback: LCBack = null ): Promise<Product>
/**
 *
 * The call modifies one or more fields.
 * This function returns the full `Product` structure
 *
 * @param id - The product ID [req]
 * @param data - The field / value to patch [req]
 *
 * @return product: Product
 *
 */
export const patch_product_admin_fields = ( req: ILRequest, id: string, data: any, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start patch_product_admin_fields ===*/
		const err = { message: "" };
		const p: Product = await _product_save( req, err, { id, ...data }, false );

		if ( err.message ) return cback ? cback( err ) : reject( err );

		return cback ? cback( null, p ) : resolve( p );
		/*=== f2c_end patch_product_admin_fields ===*/
	} );
};
// }}}

// {{{ get_product_admin_list ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCBack = null ): Promise<Product[]>
/**
 *
 * Returns all products.
 * This function returns a list of full `Product` structure.
 * This function supports pagination.
 *
 * @param id_category -  [opt]
 * @param skip -  [opt]
 * @param rows -  [opt]
 *
 * @return products: Product
 *
 */
export const get_product_admin_list = ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCback = null ): Promise<Product[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_product_admin_list ===*/
		const domain = await system_domain_get_by_session( req );
		const prods: Product[] = await adb_find_all( req.db, COLL_PRODUCTS, { domain: domain.code, id_category }, ProductKeys, { rows, skip } );

		return cback ? cback( null, prods ) : resolve( prods );
		/*=== f2c_end get_product_admin_list ===*/
	} );
};
// }}}

// {{{ delete_product_admin_del ( req: ILRequest, id: string, cback: LCBack = null ): Promise<string>
/**
 *
 * Deletes a product from the system.
 *
 * @param id - The product id to be deleted [req]
 *
 * @return id: string
 *
 */
export const delete_product_admin_del = ( req: ILRequest, id: string, cback: LCback = null ): Promise<string> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start delete_product_admin_del ===*/
		await adb_del_one( req.db, COLL_PRODUCTS, { id } );

		return cback ? cback( null, id ) : resolve( id );
		/*=== f2c_end delete_product_admin_del ===*/
	} );
};
// }}}

// {{{ get_product_admin_tag ( req: ILRequest, id: string, tags: string[], cback: LCBack = null ): Promise<Product>
/**
 *
 * This endpoint allows you to add tags to a product.
 *
 * @param id - The product ID [req]
 * @param tags - A list of tags to be added to the user [req]
 *
 * @return product: Product
 *
 */
export const get_product_admin_tag = ( req: ILRequest, id: string, tags: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_product_admin_tag ===*/

		/*=== f2c_end get_product_admin_tag ===*/
	} );
};
// }}}

// {{{ get_product_details ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCBack = null ): Promise<Product>
/**
 *
 * Returns all product details only if the product is `visible`.
 * The product can be identified by  `id`, `code` or `code_forn`.
 * You can pass more than a field, but one is enough.
 * This function returns the full `Product` structure
 *
 * @param id - Product unique ID [opt]
 * @param code - Product unique code [opt]
 * @param code_forn - Product manufacturer's code [opt]
 *
 * @return product: Product
 *
 */
export const get_product_details = ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_product_details ===*/
		product_get( req, id, code, code_forn, ( err, prod ) => {
			if ( err ) return cback ? cback( err ) : reject( err );

			keys_filter( prod, ProductKeys );

			return cback ? cback( null, prod ) : resolve( prod );
		} );
		/*=== f2c_end get_product_details ===*/
	} );
};
// }}}

// {{{ get_product_list ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCBack = null ): Promise<Product[]>
/**
 *
 * Returns all visible products.
 * Products with `visible` set to `false` are not shown.
 * This function returns a list of full `Product` structure.
 * This function supports pagination.
 *
 * @param id_category - The category the product belongs to [opt]
 * @param skip - First line to return [opt]
 * @param rows - How many rows to return [opt]
 *
 * @return products: Product
 *
 */
export const get_product_list = ( req: ILRequest, id_category?: string, skip: number = 0, rows: number = -1, cback: LCback = null ): Promise<Product[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_product_list ===*/
		const domain = await system_domain_get_by_session( req );
		const res: Product[] = await adb_find_all( req.db, COLL_PRODUCTS, { id_category, visible: true, domain: domain.code }, ProductKeys, { rows, skip } );
		return cback ? cback( null, res ) : resolve( res );
		/*=== f2c_end get_product_list ===*/
	} );
};
// }}}

// {{{ get_product_admin_details ( req: ILRequest, id: string, cback: LCBack = null ): Promise<Product>
/**
 *
 * The product must be specified by its `id`
 *
 * @param id - The product id [req]
 *
 * @return product: Product
 *
 */
export const get_product_admin_details = ( req: ILRequest, id: string, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_product_admin_details ===*/
		const domain = await system_domain_get_by_session( req );
		const prod: Product = await adb_find_one( req.db, COLL_PRODUCTS, { id, domain: domain.code }, ProductKeys );

		if ( !prod.id_category ) prod.id_category = 'undefined';

		console.log( "==== PROD: ", prod );

		return cback ? cback( null, prod ) : resolve( prod );
		/*=== f2c_end get_product_admin_details ===*/
	} );
};
// }}}

// {{{ post_product_admin_import_csv ( req: ILRequest, file: File, cback: LCBack = null ): Promise<number>
/**
 *
 * @param file - CSV File to read [req]
 *
 * @return products: number
 *
 */
export const post_product_admin_import_csv = ( req: ILRequest, file: File, cback: LCback = null ): Promise<number> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start post_product_admin_import_csv ===*/
    let err: ILError = {
      message: "File not received correctly"
    };

    if (!file) return cback ? cback(err) : reject(err);

    err.message = "Couldn't read file";
    const lines: string[] = file.text.toString().split('\n');
    if (!lines) return cback ? cback(err) : reject(err);
    
    err.message = "Error pasing CSV";
    let uploaded_prods: number = 0;
    lines.forEach( async (line) => {
      const fields: string[] = line.split(',');
      try {
        const prod: Product = {
          id: mkid('prod'),
          id_maker: fields[0]
        };

        const res = await adb_record_add(req.db, COLL_PRODUCTS, { prod });
        if (res.err) return

        uploaded_prods++;
      } catch (e: unknown) {
        console.log('ERROR (CSV PARSING) =', e);
        throw(e);
      }
    });

    return cback ? cback(uploaded_prods) : resolve(uploaded_prods);
		/*=== f2c_end post_product_admin_import_csv ===*/
	} );
};
// }}}

// {{{ product_get ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCBack = null ): Promise<Product>
/**
 *
 * Creates a new product
 *
 * @param req - The ILRequest [req]
 * @param id - Product id [opt]
 * @param code - Product code [opt]
 * @param code_forn - Code forn [opt]
 *
 * @return : Product
 *
 */
export const product_get = ( req: ILRequest, id?: string, code?: string, code_forn?: string, cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start product_get ===*/
		const domain = await system_domain_get_by_session( req );
		const [ filters, values ] = adb_prepare_filters( 'prod', { id, code, code_forn, domain: domain.code } );
		const err = { "message": "No conditions specified" };

		if ( !filters ) return cback ? cback( err ) : reject( err );

		const prod = await adb_query_one( req.db, `FOR prod IN ${ COLL_PRODUCTS } ${ filters } RETURN prod`, values );

		if ( !prod ) {
			err.message = "Product not found";
			return cback ? cback( null, null ) : resolve( null );
		}

		return cback ? cback( null, prod ) : resolve( prod );
		/*=== f2c_end product_get ===*/
	} );
};
// }}}

// {{{ product_create ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], cback: LCBack = null ): Promise<Product>
/**
 *
 * Creates a new product
 *
 * @param req - The ILRequest [req]
 * @param name - Product name [req]
 * @param code - Product unique code [opt]
 * @param id_maker - The user id of the product manufacturer [opt]
 * @param id_category - Product Category ID [opt]
 * @param id_availability - ID of availability [default: 0] [opt]
 * @param code_forn - Product unique code assigned by the provider [opt]
 * @param sku - Product SKU [opt]
 * @param description - Product description [opt]
 * @param short_description - Product short description [opt]
 * @param url - Product original URL [opt]
 * @param cost - Cost to buy it [opt]
 * @param price_net - The price, VAT free [opt]
 * @param price_vat - The price with VAT [opt]
 * @param curr_price_net - The current price, VAT free [opt]
 * @param curr_price_vat - The current price with VAT [opt]
 * @param vat - VAT applied [opt]
 * @param free - Flag T/F if the product is free [default: false] [opt]
 * @param discount - Percentage discount [opt]
 * @param quant - Quantity available in the warehouse [default: 0] [opt]
 * @param ordered - Quantity in back order [default: 0] [opt]
 * @param available - Product availability date [opt]
 * @param level - User level required to see the product [default: 0] [opt]
 * @param visible - Flag T/F if the product is visible [default: true] [opt]
 * @param relevance - Importance of the product in search results (the more, the better) [default: 0] [opt]
 * @param status - Product status [default: 0] [opt]
 * @param weight - Product weight (in grams) [default: 0] [opt]
 * @param width - Width of the product in millimiters [default: 0] [opt]
 * @param height - Height of the product in millimiters [default: 0] [opt]
 * @param depth - Depth of the product in millimiters [default: 0] [opt]
 * @param tags - Product tags [opt]
 *
 * @return : Product
 *
 */
export const product_create = ( req: ILRequest, name: string, code?: string, id_maker?: string, id_category?: string, id_availability?: number, code_forn?: string, sku?: string, description?: string, short_description?: string, url?: string, cost?: number, price_net?: number, price_vat?: number, curr_price_net?: number, curr_price_vat?: number, vat?: number, free?: boolean, discount?: number, quant?: number, ordered?: number, available?: Date, level?: number, visible?: boolean, relevance?: number, status?: number, weight?: number, width?: number, height?: number, depth?: number, tags?: string[], cback: LCback = null ): Promise<Product> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start product_create ===*/
		const err = { message: "" };
		const domain = await system_domain_get_by_session( req );
		const p: Product = await _product_save( req, err, {
			id: mkid( 'prod' ), domain: domain.code,
			name, code, id_maker, id_category, id_availability, code_forn, description, short_description, url,
			cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level,
			visible, relevance, status, weight, width, height, depth, sku, tags
		}, true );

		if ( err.message ) return cback ? cback( err ) : reject( err );

		return cback ? cback( null, p ) : resolve( p );
		/*=== f2c_end product_create ===*/
	} );
};
// }}}

// {{{ product_db_init ( liwe: ILiWE, cback: LCBack = null ): Promise<boolean>
/**
 *
 * Initializes the module's database
 *
 * @param liwe - The Liwe object [req]
 *
 * @return : boolean
 *
 */
export const product_db_init = ( liwe: ILiWE, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		_liwe = liwe;

		system_permissions_register( 'product', _module_perms );

		await adb_collection_init( liwe.db, COLL_PRODUCTS, [
			{ type: "persistent", fields: [ "id" ], unique: true },
			{ type: "persistent", fields: [ "domain" ], unique: false },
			{ type: "persistent", fields: [ "id_owner" ], unique: false },
			{ type: "persistent", fields: [ "id_maker" ], unique: false },
			{ type: "persistent", fields: [ "id_category" ], unique: false },
			{ type: "persistent", fields: [ "id_availability" ], unique: false },
			{ type: "persistent", fields: [ "code" ], unique: false },
			{ type: "persistent", fields: [ "code_forn" ], unique: false },
			{ type: "persistent", fields: [ "sku" ], unique: false },
			{ type: "persistent", fields: [ "name" ], unique: false },
			{ type: "persistent", fields: [ "free" ], unique: false },
			{ type: "persistent", fields: [ "visible" ], unique: false },
			{ type: "persistent", fields: [ "status" ], unique: false },
			{ type: "persistent", fields: [ "relevance" ], unique: false },
			{ type: "persistent", fields: [ "tags[*]" ], unique: false },
		], { drop: false } );

		/*=== f2c_start product_db_init ===*/

		/*=== f2c_end product_db_init ===*/
	} );
};
// }}}


