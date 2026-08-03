'use client'

import Script from "next/script"

const Metrics = () => {
    return (
        <Script
            id="smartlook-analyrtrics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                window.smartlook||(function(d) {
                    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
                    var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
                    c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
                    })(document);
                    smartlook('init', 'd0f5158f0ad454f643760e626131927829f6a0a5', { region: 'eu' });
                `,
            }}
        />
    )
}

export default Metrics