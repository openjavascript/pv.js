;'use strict';  
define( [ 'jquery' ], function(){
    /** @namespace V */
    !window.V && ( window.V = {} );

    $.extend( true, V, {
        /** 
         * 全局常量命名空间
         * <br />v.js 里所有的操作都通过 V.Const 的事件名进行触发
         * @see {@link v.module.const}
         * @namespace V#Const 
         */
        Const: V.Const || {}
        /**
         * @name V#ZINDEX
         * @type Int
         * @default 1000
         */
        , ZINDEX: 1000
        /**
         * $( document.documentElement )
         * @name V#HTML
         * @type Selector
         */
        , HTML: $( document.documentElement ),      JHTML: $( document.documentElement )
        /**
         * $( document )
         * @namespace V#DOC
         */
        , DOC: $( document ),                       JDOC: $( document )
        /**
         * $( document.body )
         * @name V#BODY
         * @type Selector
         */
        , BODY: $( document.body ),                 JBODY: $( document.body )
        /**
         * $( window )
         * @namespace V#WIN
         */
        , WIN: $( window ),                         JWIN: $( window )
        /** @namespace V#app */
        , app: V.app || {
            /**
             * @name V#app#prefix
             * @type String
             * @default  app_prefix_
             */
            prefix: 'app_prefix_'
            /**
             * 给输入字符串添加 前后缀, 防止命名冲突
             * @method getPrefixVal
             * @param {String} _v 
             * @return {String}
             * @memberof V#app
             */
            , getPrefixVal:
                function( _v ){
                    return V.utils.printf( '{0}_{1}_{2}', V.app.prefix, V.app.iotId, _v );
                }
        }
        /** @namespace V#utils */
        , utils: {
            getMobileOperatingSystem: getMobileOperatingSystem
            , detectCommand: detectCommand
            , getNumberValue: getNumberValue
            , getStringValue: getStringValue
            , printf: printf
            , printKey: printKey
            , formatDate: formatDate
            , parseFinance: parseFinance
            , parseBool: parseBool
            , padChar: padChar
            , parentSelector: parentSelector
            , isDecimal: isDecimal
            , isMoney: isMoney
            , cloneObject: cloneObject
        } 
        /** @namespace V#is */
        , is: {
            wexin: isWeiXin()
            /**
             * 判断客户端是否为微信
             * @name weixin
             * @type {boolean}
             * @memberof V#is
             */
            , weixin: isWeiXin()
        }
    });
    function isWeiXin(){ 
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
            return true; 
        }else{ 
            return false; 
        } 
    } 
    /**
     * 保存数据到 Selector, 可以为非字符串内容
     * @method rawData
     * @param {String} _k 
     * @param {*} _v 
     * @return {*}
     * @memberof Zepto
     */
    $.fn.rawData =
        function( _k, _v ){
            var _selector = $( this ), _r = _v;

            _selector.each( function( _sk, _sv ){
                _sv.rawDataEx = _sv.rawDataEx || {};
                if( _k ){
                    typeof _v != 'undefined' && ( _sv.rawDataEx[ _k ] = _v );
                    !_sk && ( _r = _sv.rawDataEx[ _k ] );
                }
            });

            return _r;
        };

    /**
     * 深度克隆对象, 使用 JSON.stringify
     * @method  cloneObject
     * @param   {Object}    _obj
     * @return  Object
     * @memberof V#utils
     */
    function cloneObject( _obj ){
        return JSON.parse( JSON.stringify( _obj ) );
    }
    /**
     * 获取数值的值, 如果为空返回 '-'
     * @method  getNumberValue
     * @param   {*}    _v
     * @return  {String|Number}
     * @memberof V#utils
     */
    function getNumberValue( _v ){
        var _r = '-';
        if( typeof _v == 'string' || ( typeof _v == 'number' && !isNaN( _v ) ) ){
            _r = _v;
        }
        return _r;
    }
    /**
     * 获取字符串的值, 如果为空返回 '-'
     * @method  getStringValue
     * @param   {*}    _v
     * @return  {String}
     * @memberof V#utils
     */
    function getStringValue( _v ){
        var _r = '-';
        if( typeof _v == 'string' || typeof _v == 'number' ){
            _r = _v.toString();
        }
        return _r;
    }
    /**
     * js 附加字串函数
     * @method  padChar
     * @param   {string}    _str
     * @param   {intl}      _len
     * @param   {string}    _char
     * @return  string
     * @memberof V#utils
     */
    function padChar( _str, _len, _char ){
        _len  = _len || 2; _char = _char || "0"; 
        _str += '';
        if( _str.length >= _len ) return _str;
        _str = new Array( _len + 1 ).join( _char ) + _str
        return _str.slice( _str.length - _len );
    }
    /**
     * 从字符串解析变量值
     * <br />变量值层级关系以 "." 为分隔
     * <br />根变量必须为 window
     * @method  detectCommand
     * @param   {string}    _cmd
     * @return  string
     * @memberof V#utils
     */
    function detectCommand( _cmd ){
        var _r = _cmd, _tmp, _done;
        
        if( /\./.test( _r ) ){
            _tmp = window;
            _done = true;
            _r = _r.split( '.' );
            $.each( _r, function( _k, _v ){
                if( !_v ){ _done = false; return false; }
                if( !( _tmp = _tmp[ _v ] ) ){ _done = false; return false; }
            });
            _done && _tmp && ( _cmd = _tmp );
        }

        return _cmd;
    }
    /**
     * 格式化日期为 YYYY-m-d 格式
     * <br /><b>require</b>: pad\_char\_f
     * @method  formatDate
     * @param   {date}                  _date       要格式化日期的日期对象
     * @param   {string|undefined}      _split      定义年月日的分隔符, 默认为 '-'
     * @return  string
     * @memberof V#utils
     *
     */
    function formatDate( _date, _split ){
        _date = _date || new Date(); typeof _split == 'undefined' && ( _split = '-' );
        return [ _date.getFullYear(), _date.getMonth() + 1, _date.getDate() ].join(_split);
    }
    /**
     * Determine the mobile operating system.
     * This function either returns 'iOS', 'Android' or 'unknown'
     * @method getMobileOperatingSystem
     * @returns {String}
     * @memberof V#utils
     */
    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
        {
            return 'iOS';

        }
        else if( userAgent.match( /Android/i ) )
        {

            return 'Android';
        }
        else
        {
            return 'unknown';
        }
    }
     /**
     * 按格式输出字符串
     * @method printf
     * @param   {string}    _str
     * @return  string
     * @memberof V#utils
     * @example
     *      printf( 'asdfasdf{0}sdfasdf{1}', '000', 1111 );
     *      //return asdfasdf000sdfasdf1111
     */
    function printf( _str ){
        for(var i = 1, _len = arguments.length; i < _len; i++){
            _str = _str.replace( new RegExp('\\{'+( i - 1 )+'\\}', 'g'), arguments[i] );
        }
        return _str;
    }
     /**
     * 按格式输出字符串
     * @method printKey
     * @param   {string}    _str
     * @param   {object}    _keys
     * @return  string
     * @memberof V#utils
     * @example
     *      JC.f.printKey( 'asdfasdf{key1}sdfasdf{key2},{0}', { 'key1': '000', 'key2': 1111, '0': 222 );
     *      //return asdfasdf000sdfasdf1111,222
     */
    function printKey( _str, _keys ){
        for( var k in _keys ){
            _str = _str.replace( new RegExp('\\{'+( k )+'\\}', 'g'), _keys[k] );
        }
        return _str;
    }

    /**
     * 取小数点的N位
     * <br />JS 解析 浮点数的时候，经常出现各种不可预知情况，这个函数就是为了解决这个问题
     * @method  parseFinance
     * @param   {number}    _i
     * @param   {int}       _dot  default = 2
     * @return  number
     * @memberof V#utils
     */
    function parseFinance( _i, _dot ){
        _i = parseFloat( _i ) || 0;
        typeof _dot == 'undefined' && ( _dot = 2 );
        _i && ( _i = parseFloat( _i.toFixed( _dot ) ) );
        return _i;
    }
    /**
     *  判断数值是否为十进制 
     * @method  isDecimal
     * @param   {number}    _n
     * @return  Boolean
     * @memberof V#utils
     */
    function isDecimal( _n ){
        var _r = true;
        if( typeof _n == 'string' ){
            _n = _n.trim();
            ( /^(?:[0]{2,}|0x|[0]\d)/i.test( _n ) ) && ( _r = false );
        }
        return _r;
    }
    /**
     *  判断数值是否为金额
     * @method  isMoney
     * @param   {number}    _n
     * @param   {int}    _dot  浮点数长度
     * @return  Boolean
     * @memberof V#utils
     */
    function isMoney( _n, _dot ){
        _n = ( _n || '' ).toString();
        typeof _dot == 'undefined' && ( _dot = 0 );
        var _r = isDecimal( _n );
        _r && _dot && /\./.test( _n ) && ( _n.split( '.' )[1].length > _dot ) && ( _r = false );
        return _r;
    }
    /**
     * 扩展 jquery 选择器
     * <br />扩展起始字符的 '/' 符号为 jquery 父节点选择器
     * <br />扩展起始字符的 '|' 符号为 jquery 子节点选择器
     * <br />扩展起始字符的 '(' 符号为 jquery 父节点查找识别符
     * @method  parentSelector
     * @param   {selector}  _item
     * @param   {String}    _selector
     * @param   {selector}  _finder
     * @return  selector
     * @memberof V#utils
     */
    function parentSelector( _item, _selector, _finder ){
        _item && ( _item = $( _item ) );
        if( /\,/.test( _selector ) ){
            var _multiSelector = [], _tmp;
            _selector = _selector.split(',');
            $.each( _selector, function( _ix, _subSelector ){
                _subSelector = _subSelector.trim();
                _tmp = parentSelector( _item, _subSelector, _finder );
                _tmp && _tmp.length 
                    &&  ( 
                            ( _tmp.each( function(){ _multiSelector.push( $(this) ) } ) )
                        );
            });
            return $( _multiSelector );
        }
        var _pntChildRe = /^([\/]+)/, _childRe = /^([\|]+)/, _pntRe = /^([<\(]+)/;
        if( _pntChildRe.test( _selector ) ){
            _selector = _selector.replace( _pntChildRe, function( $0, $1 ){
                for( var i = 0, j = $1.length; i < j; i++ ){
                    _item = _item.parent();
                }
                _finder = _item;
                return '';
            });
            _selector = _selector.trim();
            return _selector ? _finder.find( _selector ) : _finder;
        }else if( _childRe.test( _selector ) ){
            _selector = _selector.replace( _childRe, function( $0, $1 ){
                for( var i = 1, j = $1.length; i < j; i++ ){
                    _item = _item.parent();
                }
                _finder = _item;
                return '';
            });
            _selector = _selector.trim();
            return _selector ? _finder.find( _selector ) : _finder;
        }else if( _pntRe.test( _selector ) ){
            _selector = _selector.replace( _pntRe, '' ).trim();
            if( _selector ){
                if( /[\s]/.test( _selector ) ){
                    var _r;
                    _selector.replace( /^([^\s]+)([\s\S]+)/, function( $0, $1, $2 ){
                        _r = _item.closest( $1 ).find( $2.trim() );
                    });
                    return _r || _selector;
                }else{
                    return _item.closest( _selector );
                }
            }else{
                return _item.parent();
            }
        }else{
            return _finder ? _finder.find( _selector ) : (window.jQuery || window.Zepto)( _selector );
        }
    }
    /**
     * 把输入值转换为布尔值
     * @method parseBool
     * @param   {*} _in
     * @return bool
     * @memberof V#utils
     */
    function parseBool( _in ){
        if( typeof _in == 'string' ){
            _in = _in.replace( /[\s]/g, '' ).toLowerCase();
            if( _in && ( _in == 'false' 
                            || _in == '0' 
                            || _in == 'null'
                            || _in == 'undefined'
           )) _in = false;
           else if( _in ) _in = true;
        }
        return !!_in;
    }

    return V;
});
