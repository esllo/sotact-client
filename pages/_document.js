import Document, { Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

class MyDocument extends Document {
  render() {
    const css_list = ['reset', 'theme', 'timeline'];
    const js_list = ['util', 'ctx', 'tool', 'socket', 'parse', 'ipc', 'event', 'view', 'save', 'preset'];
    const env = process.env.ISDEV == "true" ? './static/' : './out/static/';
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/static/img/favicon.ico" />
          <base href="../"></base>
          {css_list.map((v) => (
            <link rel="stylesheet" href={env + 'css/' + v + '.css'}></link>
          ))}
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          {js_list.map((v) => (
            <script src={env + 'js/' + v + '.js'}></script>
          ))}
        </body>
      </html>
    );
  }
}

export default MyDocument;
