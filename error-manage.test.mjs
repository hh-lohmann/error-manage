// @ts-check

/** Must be run with Node.js
 *  - newest used feature: `suite()`
 *  - according minimal Node.js version reflected in `node-test-runner-version-check.mjs
 */

import { suite, test } from 'node:test';
import assert from 'assert';
import * as error_manage from "./error-manage.mjs";

suite( 'set()', () => {

  suite( 'should work with correct arg count and types' , () => {
    test( '`dev_msg` only ' , () => {
      error_manage.set( crypto.randomUUID(), 'dev_msg' ) ;
    });
    test( '`dev_msg` + optional `user_msg`' , () => {
      error_manage.set( crypto.randomUUID(), 'dev_msg', 'user_msg' ) ;
    });
  });

  test( 'should throw Structured SyntaxError a728e70d on duplicate error_id' , () => {
    assert.throws(
      () => {
        const my_id = crypto.randomUUID() ;
        error_manage.set( my_id, 'dev_msg', 'user_msg' ) ;
        error_manage.set( my_id, 'dev_msg', 'user_msg' ) ;
      },
      {
        name: 'SyntaxError',
        message: /"error_id":"a728e70d","dev_msg":"/
      }
    );
  });

  test( 'should throw Structured SyntaxError 982eb5f8 on too few args' , () => {
    assert.throws(
      () => {
          // @ts-ignore - intended wrong arg count
        error_manage.set( 'error_id' ) ;
      },
      {
        name: 'SyntaxError',
        message: /"error_id":"982eb5f8","dev_msg":"/
      }
    );
  });

  test( 'should throw Structured SyntaxError 982eb5f8 on too many args' , () => {
    assert.throws(
      () => {
        error_manage.set( 'error_id', 'dev_msg', 'user_msg', 'nonsense' ) ;
      },
      {
        name: 'SyntaxError',
        message: /"error_id":"982eb5f8","dev_msg":"/
      }
    );
  });

  test( 'should throw Structured SyntaxError 86669f3b on wrong arg type' , () => {
    assert.throws(
      () => {
          // @ts-ignore - intended wrong arg
        error_manage.set( [crypto.randomUUID()], 'dev_msg', 'user_msg' ) ;
      },
      {
        name: 'SyntaxError',
        message: /"error_id":"86669f3b","dev_msg":"/
      }
    );
  });

});

suite( 'exposed get error functions', () => {
  [ 'fail', 'range', 'reference', 'syntax', 'type' ].forEach( value => {
    suite( value + '()', () => {
      test( 'should work with correct arg count and types' , () => {
        const message = '{"error_id":"' + value + '_error_id","dev_msg":"dev_msg","user_msg":"user_msg"}' ;
        let name = '' ;
        if( value === 'fail' ) name = 'Error' ;
        if( value === 'range' ) name = 'RangeError' ;
        if( value === 'reference' ) name = 'ReferenceError' ;
        if( value === 'syntax' ) name = 'SyntaxError' ;
        if( value === 'type' ) name = 'TypeError' ;
        assert.throws(
          () => {
            error_manage.set( value + '_error_id', 'dev_msg', 'user_msg' ) ;
            throw eval( 'error_manage.' + value + '( value + "_error_id" )' ) ;
          },
          {
            name: name,
            message: message
          }
        );
      });
      test( 'should throw Structured ReferenceError a1bd23d1 on call for undefined error_id' , () => {
        assert.throws(
          () => {
            eval( 'error_manage.' + value + '( crypto.randomUUID() )' ) ;
          },
          {
            name: 'ReferenceError',
            message: /"error_id":"a1bd23d1","dev_msg":"/
          }
        );
      });
      test( 'should throw Structured SyntaxError b62f9810 on empty error_id' , () => {
        assert.throws(
          () => {
            eval( 'error_manage.' + value + '( "" )' ) ;
          },
          {
            name: 'SyntaxError',
            message: /"error_id":"b62f9810","dev_msg":"/
          }
        );
      });
      test( 'should throw Structured SyntaxError 982eb5f8 on too few args' , () => {
        assert.throws(
          () => {
            eval( 'error_manage.' + value + '()' ) ;
          },
          {
            name: 'SyntaxError',
            message: /"error_id":"982eb5f8","dev_msg":"/
          }
        );
      });
      test( 'should throw Structured SyntaxError 982eb5f8 on too many args' , () => {
        assert.throws(
          () => {
            eval( 'error_manage.' + value + '( "one", "two" )' ) ;
          },
          {
            name: 'SyntaxError',
            message: /"error_id":"982eb5f8","dev_msg":"/
          }
        );
      });
      test( 'should throw Structured SyntaxError 86669f3b on wrong arg type' , () => {
        assert.throws(
          () => {
            eval( 'error_manage.' + value + '( ["one"] )' ) ;
          },
          {
            name: 'SyntaxError',
            message: /"error_id":"86669f3b","dev_msg":"/
          }
        );
      });
    });
  });
});

suite( 'exposed log error functions', () => {
  suite( 'log only', () => {
    [ 'info', 'warn', 'error' ].forEach( value => {
      suite( value + '()', () => {
        test( 'should work with correct arg count and types' , () => {
          let log_output = '';
          const my_id = crypto.randomUUID() ;
          error_manage.set( my_id, 'dev_msg', 'user_msg' ) ;
          let continued_after_log = undefined ;
          const my_function = () => {
              // @ts-ignore
            console[ value ] = function( msg ) {
              log_output = msg ;
              process.stdout.write( msg + '\n' ) ;
            };
            eval( 'error_manage.' + value + '( "' + my_id + '" )' ) ;
            continued_after_log = true ;
          }
          my_function() ;
          if( ! continued_after_log ) throw Error( '! test function did not proceed after ' + value + '()') ;
          if( ! log_output.startsWith( '(' + value + ') ' ) ) throw Error( '! console output does not start with `(' + value + ') `' ) ;
        });
        test( 'should throw Structured ReferenceError a1bd23d1 on call for undefined error_id' , () => {
          assert.throws(
            () => {
              eval( 'error_manage.' + value + '( crypto.randomUUID() )' ) ;
            },
            {
              name: 'ReferenceError',
              message: /"error_id":"a1bd23d1","dev_msg":"/
            }
          );
        });
        test( 'should throw Structured SyntaxError b62f9810 on empty error_id' , () => {
          assert.throws(
            () => {
              eval( 'error_manage.' + value + '( "" )' ) ;
            },
            {
              name: 'SyntaxError',
              message: /"error_id":"b62f9810","dev_msg":"/
            }
          );
        });
        test( 'should throw Structured SyntaxError 982eb5f8 on too few args' , () => {
          assert.throws(
            () => {
              eval( 'error_manage.' + value + '()' ) ;
            },
            {
              name: 'SyntaxError',
              message: /"error_id":"982eb5f8","dev_msg":"/
            }
          );
        });
        test( 'should throw Structured SyntaxError 982eb5f8 on too many args' , () => {
          assert.throws(
            () => {
              eval( 'error_manage.' + value + '( "one", "two", "three" )' ) ;
            },
            {
              name: 'SyntaxError',
              message: /"error_id":"982eb5f8","dev_msg":"/
            }
          );
        });
        test( 'should throw Structured SyntaxError 86669f3b on wrong arg type' , () => {
          assert.throws(
            () => {
              eval( 'error_manage.' + value + '( ["one"] )' ) ;
            },
            {
              name: 'SyntaxError',
              message: /"error_id":"86669f3b","dev_msg":"/
            }
          );
        });
      });
    });
  });
  suite( 'with `return` + `return_val`', () => {
    [ 'info', 'warn', 'error' ].forEach( value => {
      suite( value + '()', () => {
        test( 'should work with correct arg count and types' , () => {
          const my_id = crypto.randomUUID() ;
          error_manage.set( my_id, 'dev_msg', 'user_msg' ) ;
          let continued_after_log = undefined ;
          const my_function = () => {
            return eval( 'error_manage.' + value + '( "' + my_id + '", "' + my_id + '" )' ) ;
            continued_after_log = true ;
          }
          const res = my_function() ;
          if( continued_after_log ) throw Error( '! test function did proceed after ' + value + '()') ;
          if( res !== my_id ) throw Error( '! test function did not return given return_val' ) ;
        });
      });
    });
  });
});
