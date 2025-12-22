// @ts-check

/** Check minimal Node.js version for using Node Test runner */

import { version as node_version } from 'node:process' ;

/** newest used feature: `suite()` */
const minimal_node_version = 'v20.13.0' ;

/** Do check */
const my_err = () => 'Node.js version not appropiate for Node.js Test runner - given: ' + node_version + ', required min.: ' + minimal_node_version ;
const to_num_segments = ( version_string = '' ) => version_string.split( 'v' )[ 1 ].split( '.' ).map( value => parseInt( value ) ) ;
const given = to_num_segments( node_version ) ;
const req = to_num_segments( minimal_node_version ) ;
let open = true ;
if( open && given[ 0 ] < req[ 0 ] ) throw Error( my_err() ) ;
if( open && given[ 0 ] > req[ 0 ] ) open = false ;
if( open && given[ 1 ] < req[ 1 ] ) throw Error( my_err() ) ;
if( open && given[ 1 ] > req[ 1 ] ) open = false ;
if( open && given[ 2 ] < req[ 2 ] ) throw Error( my_err() ) ;
