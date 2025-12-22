// @ts-check

const my_name = 'error_manage' ;

/** @typedef { ( error_id: string ) => object } _exposed_get_error_function
 * @param { string } error_id - Previously with `set()` defined error_id
*/
/** @typedef { ( error_id: string, return_value?: any ) => boolean } _exposed_log_error_function
 * @param { string } error_id - Previously with `set()` defined error_id
 * @param { any } return_value - optional: value to return, default: true
*/
/** @typedef { ( error_id: string, func: function, use_external?: boolean ) => object } _internal_get_error_function
 * @param { string } error_id - error_id to get or set
 * @param { function } func - Function to clip Error.stack at ("captureStackTrace")
 * @param { boolean } [ use_external ] - Flag: internal function reused by exposed function
 *
*/
/** @typedef { ( error_id: string, func: function, opts?: _optional_internal_args ) => any } _mk_error_message
 * @param { string } error_id - error_id to get or set
 * @param { function } func - Function to clip Error.stack at ("captureStackTrace")
 * @param { _optional_internal_args } [ opts ]
*/
/** @typedef { Object } _optional_internal_args
 * @prop { boolean } [ use_external ] - optional: flag: internal function reused by exposed function
 * @prop { string[] } [ msgs ] - optional: messages to output
 *  * default: `[ dev_msg, user_msg ]`
 *  * example: `[ dev_msg ]`
 * @prop { 'JSON' | 'key: val' } [ out_format ] - optional: format for output
 *  * default: `'JSON'`
 *  * example: `'key: val'`
 */

/** @typedef { [ caller: function, name: string, message: string ] } _spread_params_my_error
 * @see MyError
 */

  /** @type { Object< string, string[] > } */
const error_store = {} ;

  /** Check existence of entry in error_store for get / set
   * @param { string } error_id - ID of error to get or set
   * @param { 'get' | 'set' } action - achieved action
   * @param { function } func - function that asks for action
  */
const error_store_exists = ( error_id, action, func ) => {
  if( error_store.hasOwnProperty( error_id ) ) {
    if( action === 'get' ) return true ;
    set( 'a728e70d', my_name + ' `' + func.name + '()`: error_id `' + error_id + '` is already defined', '' ) ;
    throw syntax_intern( 'a728e70d', func ) ;
  }
  if( ! error_store.hasOwnProperty( error_id ) ) {
    if( action === 'set' ) return true ;
    set( 'a1bd23d1', my_name + ' `' + func.name + '()`: error_id `' + error_id + '` is not defined', '' ) ;
    throw reference_intern( 'a1bd23d1', func ) ;
  }
  return true ;
}

  /** ISSUES#878835e1 */
class MyError extends EvalError {
    /**
     * @param { function } caller - the function that should be named as error source
     * @param { string } name - Error Type display name potentially used by Chrome / Node.js (see ISSUES#878835e1)
     * @param { string } message - Error message (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)
     */
  constructor( caller, name, message ) {
    super(message);
    if( 'captureStackTrace' in Error ) {
      // @ts-ignore
      Error.captureStackTrace( this, caller );
    }
    this.name = name;
  }
}

  /** @type{ _mk_error_message }*/
const mk_error_message = ( error_id, func, opts = {} ) => {
  if( typeof opts.use_external === 'undefined' ) opts.use_external = true ;
  if( typeof opts.msgs === 'undefined' ) opts.msgs = [ 'dev_msg', 'user_msg' ] ;
  if( typeof opts.out_format === 'undefined' ) opts.out_format = 'JSON' ;
  error_store_exists( error_id, 'get', func ) ;
    /** @type { Object< string, string > } */
  const my_obj = { error_id: error_id } ;
  opts.msgs.forEach( ( value, index ) =>
    {
      if( error_store[ error_id ][ index ] !== '' ) my_obj[ value ] = error_store[ error_id ][ index ] ;
    }
  );
  if( ! opts.use_external ) delete error_store[ error_id ] ;
  if( opts.out_format === 'JSON' ) return JSON.stringify( my_obj ) ;
  if( opts.out_format === 'key: val' ) return Object.values( my_obj ).join( ': ' ) ;
}

/** @typedef { string } _argument_name - Name of an argument with associated `type_rule`*/
/** @typedef { string } _type_rule - Properties associated to an `argument_name`: a type like "string" etc., optionally followed by a rule
 *    * rules = word attached by a comma
 *      * currently recognized rules:
 *        * "non-empty" = argument must not be empty, esp. not an empty string
 *        * "optional" = argument is optional
 */
  /** Check number and type of args
   * @param { function } func - function that asks for check
   * @param { string[] } args_array - given `arguments` property of `func` as array (! see ISSUES#bd1c5690)
   * @param { Object< _argument_name, _type_rule > } expected - arguments expected by `func`
  */
const check_args = ( func, args_array, expected ) => {
    /** @type { string | undefined } */
  let type = undefined ;
    /** @type { string | undefined } */
  let rule = undefined ;
  /** @type { string[] } */
  const my_arr_opt = [] ;
    /** @type { string[] } */
  const my_arr_req = [] ;
  Object.keys( expected ).forEach( ( argument_name, index ) => {
    [ type, rule ] = expected[ argument_name ].split( ',' ) ;
    if( rule && rule === 'optional' ) {
      my_arr_opt.push( argument_name + ':' + expected[ argument_name ] )
    }
    else {
      if( rule && rule === 'non-empty' && args_array[ index ] === '' ) {
        set( 'b62f9810', my_name + ' `' + func.name + '()`: `' + argument_name + '` must not be empty', '' ) ;
        throw syntax_intern( 'b62f9810', func ) ;
      }
      my_arr_req.push( argument_name + ':' + expected[ argument_name ] )
    }
  });
    /** @type { string | undefined } */
  let arr_number_fail = undefined ;
  if( args_array.length < my_arr_req.length ) arr_number_fail = '' ;
  if( args_array.length > ( my_arr_req.length + my_arr_opt.length ) ) arr_number_fail = 'not more than ' ;
  if( typeof arr_number_fail !== 'undefined' ) {
      /** @param data_array { string[] } */
    const get_sg_pl = ( data_array ) => ( data_array.length > 1 ) ? ' arguments' : ' argument' ;
    const required = ( my_arr_req.length === 0 ) ? '' : 'expects ' + arr_number_fail + my_arr_req.length + ' required' + get_sg_pl( my_arr_req ) ;
    const optional = ( my_arr_opt.length === 0 ) ? '' : 'allows ' + arr_number_fail + my_arr_opt.length + ' optional' + get_sg_pl( my_arr_opt ) ;
    const conjunct = ( my_arr_req.length > 0 && my_arr_opt.length > 0 ) ? ' and ' : '' ;
    set( '982eb5f8', my_name + ' `' + func.name + '()` ' + required + conjunct + optional + ': ' + my_arr_req.concat( my_arr_opt ).join( ', ' ), '' ) ;
    throw syntax_intern( '982eb5f8', func ) ;
  }
  args_array.forEach( ( arg, index ) => {
    [ type, rule ] = Object.values( expected )[ index ].split( ',' ) ;
    if( type !== 'any' && typeof arg !== type ) {
      set( '86669f3b', my_name + ' `' + func.name + '()`: `' + arg + '` must be of type `' + type + '`', '' ) ;
      throw syntax_intern( '86669f3b', func ) ;
    }
  }) ;
  return true ;
}

  /**
   * @param { string } error_id - ID for error information to set
   * @param { string } dev_msg - Developer oriented message for error information to set
   * @param { string } [ user_msg ] - User oriented message for error information to set
  */
export function set( error_id, dev_msg, user_msg = '' ) {
  check_args( set, Array.from( arguments ), { error_id: 'string,non-empty', dev_msg: 'string', user_msg: 'string,optional' } ) ;
  error_store_exists( error_id, 'set', set ) ;
  error_store[ error_id ] = [ dev_msg, user_msg ] ;
}

  /** @type { _exposed_get_error_function } */
export function fail( error_id ) {
  check_args( fail, Array.from( arguments ), { error_id: 'string,non-empty' } ) ;
  class Error extends MyError {
      /** @param { _spread_params_my_error } params */
    constructor( ...params ) {
      super( ...params );
    }
  }
  return new Error( fail, 'Error', mk_error_message( error_id, fail ) ) ;
}

  /** @type { _exposed_get_error_function } */
export function range( error_id ) {
  check_args( range, Array.from( arguments ), { error_id: 'string,non-empty' } ) ;
  class RangeError extends MyError {
      /** @param { _spread_params_my_error } params */
    constructor( ...params ) {
      super( ...params );
    }
  }
  return new RangeError( range, 'RangeError', mk_error_message( error_id, range ) ) ;
}

  /** @type { _exposed_get_error_function } */
export function reference( error_id ) {
  check_args( reference, Array.from( arguments ), { error_id: 'string,non-empty' } ) ;
  return reference_intern( error_id, reference, true ) ;
}

  /** @type { _internal_get_error_function } */
export function reference_intern( error_id, func, use_external = false ) {
  check_args( func, Array.from( arguments ), { error_id: 'string,non-empty', func: 'function,non-empty', use_external: 'boolean,optional' } ) ;
  class ReferenceError extends MyError {
      /** @param { _spread_params_my_error } params */
    constructor( ...params ) {
      super( ...params );
    }
  }
  return new ReferenceError( func, 'ReferenceError', mk_error_message( error_id, func, { use_external: use_external } ) ) ;
}

  /** @type { _exposed_get_error_function } */
export function syntax( error_id ) {
  check_args( syntax, Array.from( arguments ), { error_id: 'string,non-empty' } ) ;
  return syntax_intern( error_id, syntax, true ) ;
}

  /** @type { _internal_get_error_function } */
function syntax_intern( error_id, func, use_external = false ) {
  check_args( func, Array.from( arguments ), { error_id: 'string,non-empty', func: 'function,non-empty', use_external: 'boolean,optional' } ) ;
  class SyntaxError extends MyError {
      /** @param { _spread_params_my_error } params */
    constructor( ...params ) {
      super( ...params );
    }
  }
  return new SyntaxError( func, 'SyntaxError', mk_error_message( error_id, func, { use_external: use_external } ) ) ;
}

  /** @type { _exposed_get_error_function } */
export function type( error_id ) {
  check_args( type, Array.from( arguments ), { error_id: 'string,non-empty' } ) ;
  class TypeError extends MyError {
      /** @param { _spread_params_my_error } params */
    constructor( ...params ) {
      super( ...params );
    }
  }
  return new TypeError( type, 'TypeError', mk_error_message( error_id, type ) ) ;
}

  /** @param { function } func - calling function
   * @param { Array<any> } args_array - args according to _exposed_log_error_function
   */
function log_emit( func, args_array ) {
  check_args( func, args_array, { error_id: 'string,non-empty', return_value: 'any,optional' } ) ;
    /** @type { 'info' | 'warn' | 'error' } */
  let log_type = 'info' ;
  if( func.name === 'warn' ) log_type = 'warn' ;
  if( func.name === 'error' ) log_type = 'error' ;
  const error_id = args_array[ 0 ] ;
  const return_value = args_array.length > 1 ? args_array[ 1 ] : true ;
  console[ log_type ]( '(' + log_type + ') ' + mk_error_message( error_id, func, { msgs: [ 'dev_msg' ], out_format: 'key: val' } ) );
  return return_value ;
}

  /** @type { _exposed_log_error_function } */
export function info( error_id, return_value = true ) {
  return log_emit( info, Array.from( arguments ) ) ;
}

  /** @type { _exposed_log_error_function } */
export function warn( error_id, return_value = true ) {
  return log_emit( warn, Array.from( arguments ) ) ;
}

  /** @type { _exposed_log_error_function } */
export function error( error_id, return_value = true ) {
  return log_emit( error, Array.from( arguments ) ) ;
}
