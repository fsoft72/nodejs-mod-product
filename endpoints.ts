
import { ILRequest, ILResponse, ILApplication, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { send_error, send_ok, typed_dict } from "../../liwe/utils";

import { perms } from '../../liwe/auth';

import {
	post_product_admin_add, patch_product_admin_update, patch_product_admin_fields, get_product_admin_list, delete_product_admin_del, post_product_admin_tag, get_product_details, get_product_list, product_db_init, product_create, product_get
} from './methods';

import {
	Product
} from './types';

/*=== d2r_start __header ===*/

/*=== d2r_end __header ===*/

/* === PRODUCT API === */
export const init = ( liwe: ILiWE ) => {
	const app = liwe.app;

	console.log( "    - Product " );

	product_db_init( liwe );


	app.post( "/api/product/admin/add", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { name, code, id_maker, id_category, id_availability, code_forn, sku, description, short_description, url, cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level, visible, relevance, status, weight, width, height, depth, tags, ___errors } = typed_dict( req.fields || req.body, [
			{ name: "name", type: "string", required: true },
			{ name: "code", type: "string" },
			{ name: "id_maker", type: "string" },
			{ name: "id_category", type: "string" },
			{ name: "id_availability", type: "number" },
			{ name: "code_forn", type: "string" },
			{ name: "sku", type: "string" },
			{ name: "description", type: "string" },
			{ name: "short_description", type: "string" },
			{ name: "url", type: "string" },
			{ name: "cost", type: "number" },
			{ name: "price_net", type: "number" },
			{ name: "price_vat", type: "number" },
			{ name: "curr_price_net", type: "number" },
			{ name: "curr_price_vat", type: "number" },
			{ name: "vat", type: "number" },
			{ name: "free", type: "boolean" },
			{ name: "discount", type: "number" },
			{ name: "quant", type: "number" },
			{ name: "ordered", type: "number" },
			{ name: "available", type: "Date" },
			{ name: "level", type: "number" },
			{ name: "visible", type: "boolean" },
			{ name: "relevance", type: "number" },
			{ name: "status", type: "number" },
			{ name: "weight", type: "number" },
			{ name: "width", type: "number" },
			{ name: "height", type: "number" },
			{ name: "depth", type: "number" },
			{ name: "tags", type: "string[]" }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		post_product_admin_add( req, name, code, id_maker, id_category, id_availability, code_forn, sku, description, short_description, url, cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level, visible, relevance, status, weight, width, height, depth, tags, ( err: ILError, product: Product ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { product } );
		} );
	} );

	app.patch( "/api/product/admin/update", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, name, code, id_maker, id_category, id_availability, code_forn, sku, description, short_description, url, cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level, visible, relevance, status, weight, width, height, depth, tags, ___errors } = typed_dict( req.fields || req.body, [
			{ name: "id", type: "string", required: true },
			{ name: "name", type: "string" },
			{ name: "code", type: "string" },
			{ name: "id_maker", type: "string" },
			{ name: "id_category", type: "string" },
			{ name: "id_availability", type: "number" },
			{ name: "code_forn", type: "string" },
			{ name: "sku", type: "string" },
			{ name: "description", type: "string" },
			{ name: "short_description", type: "string" },
			{ name: "url", type: "string" },
			{ name: "cost", type: "number" },
			{ name: "price_net", type: "number" },
			{ name: "price_vat", type: "number" },
			{ name: "curr_price_net", type: "number" },
			{ name: "curr_price_vat", type: "number" },
			{ name: "vat", type: "number" },
			{ name: "free", type: "boolean" },
			{ name: "discount", type: "number" },
			{ name: "quant", type: "number" },
			{ name: "ordered", type: "number" },
			{ name: "available", type: "Date" },
			{ name: "level", type: "number" },
			{ name: "visible", type: "boolean" },
			{ name: "relevance", type: "number" },
			{ name: "status", type: "number" },
			{ name: "weight", type: "number" },
			{ name: "width", type: "number" },
			{ name: "height", type: "number" },
			{ name: "depth", type: "number" },
			{ name: "tags", type: "string[]" }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		patch_product_admin_update( req, id, name, code, id_maker, id_category, id_availability, code_forn, sku, description, short_description, url, cost, price_net, price_vat, curr_price_net, curr_price_vat, vat, free, discount, quant, ordered, available, level, visible, relevance, status, weight, width, height, depth, tags, ( err: ILError, product: Product ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { product } );
		} );
	} );

	app.patch( "/api/product/admin/fields", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, data, ___errors } = typed_dict( req.fields || req.body, [
			{ name: "id", type: "string", required: true },
			{ name: "data", type: "any", required: true }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		patch_product_admin_fields( req, id, data, ( err: ILError, product: Product ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { product } );
		} );
	} );

	app.get( "/api/product/admin/list", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id_category, skip, rows, ___errors } = typed_dict( req.query as any, [
			{ name: "id_category", type: "string" },
			{ name: "skip", type: "number" },
			{ name: "rows", type: "number" }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		get_product_admin_list( req, id_category, skip, rows, ( err: ILError, products: Product[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { products } );
		} );
	} );

	app.delete( "/api/product/admin/del", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, ___errors } = typed_dict( req.fields || req.body, [
			{ name: "id", type: "string", required: true }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		delete_product_admin_del( req, id, ( err: ILError, id: string ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { id } );
		} );
	} );

	app.post( "/api/product/admin/tag", perms( [ "product.add" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, tags, ___errors } = typed_dict( req.fields || req.body, [
			{ name: "id", type: "string", required: true },
			{ name: "tags", type: "string[]", required: true }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		post_product_admin_tag( req, id, tags, ( err: ILError, product: Product ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { product } );
		} );
	} );

	app.get( "/api/product/details", ( req: ILRequest, res: ILResponse ) => {
		const { id, code, code_forn, ___errors } = typed_dict( req.query as any, [
			{ name: "id", type: "string" },
			{ name: "code", type: "string" },
			{ name: "code_forn", type: "string" }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		get_product_details( req, id, code, code_forn, ( err: ILError, product: Product ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { product } );
		} );
	} );

	app.get( "/api/product/list", ( req: ILRequest, res: ILResponse ) => {
		const { id_category, skip, rows, ___errors } = typed_dict( req.query as any, [
			{ name: "id_category", type: "string" },
			{ name: "skip", type: "number" },
			{ name: "rows", type: "number" }
		] );

		if ( ___errors.length ) return send_error( res, { message: `Missing required fields: ${ ___errors.join( ', ' ) }` } );

		get_product_list( req, id_category, skip, rows, ( err: ILError, products: Product[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { products } );
		} );
	} );

};
