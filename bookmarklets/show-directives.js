javascript:(
    function () {
        function checkReady( callback ) {
            if ( window.jQuery ) {
                callback( jQuery )
            } else {
                window.setTimeout( function () {
                    checkReady( callback )
                }, 100 )
            }
        }

        const script = document.createElement( 'script' );
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
        script.type = 'text/javascript';

        document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

        checkReady(
            function ( $ ) {
                $( 'primo-explore [parent-ctrl="$ctrl"]' ).not( ':has(a.already-revealed)' )
                    .each(
                        function () {
                            const $this = $( this );
                            const id = $this[ 0 ].tagName
                                .toLowerCase()
                                .replaceAll(
                                    /-([a-z])/g,
                                    function( match, p ) {
                                        return p.toUpperCase()
                                    },
                                );

                            $this.append(
                                `<a class="already-revealed" href="#" title="${ id }" style="display:block;height:auto;color:purple;">${id}</a>`,
                            );
                        } )
            },
        )
    }
)();
