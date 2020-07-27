import Document, { Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/static/img/favicon.ico" />
          <style>{`body { margin: 0;padding: 0; overflow-x:hidden; }`}</style>
          <base href="../"></base>
          <link rel="stylesheet" href="./out/static/reset.css" />
          <link rel="stylesheet" href="./out/static/layer.css" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="./out/static/parse.js"></script>
          <script src="./out/static/ipc.js"></script>
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
