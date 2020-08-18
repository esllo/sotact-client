import Document, { Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

class MyDocument extends Document {
  render() {
    const css_list = ['reset', 'theme', 'timeline'];
    const js_list = ['util', 'tool', 'parse', 'ipc', 'event', 'view', 'save'];
    const env = process.env.ISDEV=="true" ? './static/' : './out/static/';
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/static/img/favicon.ico" />
          <base href="../"></base>
          {css_list.map((v) => (
            <link rel="stylesheet" href={env + v + '.css'}></link>
          ))}
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          {js_list.map((v) => (
            <script src={env + v + '.js'}></script>
          ))}
        </body>
      </html>
    );
  }
}

// MyDocument.getInitialProps = async ctx => {
//   // Resolution order
//   const originalRenderPage = ctx.renderPage;

//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: App => props => sheets.collect(<App {...props} />),
//     });

//   const initialProps = await Document.getInitialProps(ctx);

//   return {
//     ...initialProps,
//     // Styles fragment is rendered after the app and page rendering finish.
//     styles: [
//       ...React.Children.toArray(initialProps.styles),
//       sheets.getStyleElement(),
//     ],
//   };
// };

export default MyDocument;
