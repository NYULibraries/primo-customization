function injectScriptTagForChatWidget() {
    const COOPER_UNION_CHAT_WIDGET_LOADER_URL = 'https://cooper.libanswers.com/load_chat.php?hash=e1e8429ae379786fe54c6681a8ad95b9';

    const scriptElement = document.createElement( 'script' );
    scriptElement.setAttribute( 'src', COOPER_UNION_CHAT_WIDGET_LOADER_URL );
    document.body.appendChild( scriptElement )
}

injectScriptTagForChatWidget();
