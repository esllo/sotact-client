import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TitleBar from '../comp/TitleBar';
import FlexBox from '../comp/FlexBox';
import Konva from 'konva';
import Split from '../comp/Split';

const Home = (props) => {
  useEffect(() => {
    function bindLoop() {
      if (window == undefined || window.useEffectOccured == undefined) {
        setTimeout(bindLoop, 200);
      } else {
        window.useEffectOccured();
      }
    }
    bindLoop();
  }, []);
  const [to, setTo] = useState(0);
  const [from, setFrom] = useState(100);
  const compOpers = ["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];

  // animate with path
  //https://stackoverflow.com/questions/53330168/animate-a-shape-along-a-line-or-path-in-konva
  return (
    <div className="page">
      <Head>
        <title>TAW</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TitleBar></TitleBar>
        <FlexBox dir="column" style={{ height: 'calc(100vh - 30px)' }}>
          <FlexBox className="titleHead" dir="row" minHeight="20px" background="#BDBDBD" style={{ color: '#191818', justifyContent: 'center' }}>
            <h2 id="title_head">Title Text</h2>
          </FlexBox>
          <FlexBox className="top" dir="row" minHeight="50px" background="#191818">
            <input id="selector_hidden" type="file" style={{ display: 'none' }} />
            <input id="selector" type="button" value="Open Local" />
            <input id="cloudSelect" type="button" value="Open Cloud" />
            <input id="save" type="button" value="Save" />
            <input id="clear" type="button" value="Clear" />
            <div style={{ width: '4px' }}></div>
            <input id="tb0" type="button" value="Start" />
            <input id="tb1" type="button" value="Stop" />
            <input id="tb2" type="button" value="Reset" />
            <label style={{ display: 'none' }}>Speed :
              <input type="range" min="1" max="20" id="speed" />
            </label>
            <label>Scale :
              <input type="range" min="1" max="200" id="scale" />
            </label>
            <input type="button" value="" style={{ flex: 1 }} />
            <input className="session" type="button" value="Session" />
            <input className="login" type="button" value="Login" />
          </FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="middle" dir="row" weight={1}>
            <FlexBox className="left" dir="column" style={{ width: '290px' }}>
              <div className="property">
                <p>Layer</p>
              </div>
              <FlexBox className="layers" dir="column">
              </FlexBox>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox
              className="center"
              dir="row"
              weight={1}>
              <div id="container"></div>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox
              className="right"
              dir="column"
              style={{ width: '280px' }}>
              {/*<FlexBox className="fx_value" dir="row">
                 <input class="fx_from" type="text" value={to} onChange={e => setTo(e.target.value)} style={{ flex: 1 }} />
                 <input class="fx_to" type="text" value={from} onChange={e => setFrom(e.target.value)} style={{ flex: 1 }} />
  </FlexBox>*/}
              <FlexBox className="fx_presets">

              </FlexBox>
            </FlexBox>
          </FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="bottom" dir="row" style={{ height: '240px' }}>
            <FlexBox
              className="properties"
              dir="column"
              style={{ width: '290px' }}>

              <div className="property">
                <p>Properties</p>
              </div>
              <div className="prop_label">
                <p id="nval"></p>
              </div>
              <FlexBox dir="row">
                <FlexBox dir="column" weight="1">
                  <label className="prop_label">
                    <p>X :&nbsp;</p>
                    <input id="xval" />
                  </label>
                  <label className="prop_label">
                    <p>Y :&nbsp;</p>
                    <input id="yval" />
                  </label>
                  <label className="prop_label">
                    <p>R :&nbsp;</p>
                    <input id="rval" />
                  </label>
                </FlexBox>
                <FlexBox dir="column" weight="1">
                  <label className="prop_label">
                    <p>W :&nbsp;</p>
                    <input id="sxval" />
                  </label>
                  <label className="prop_label">
                    <p>H :&nbsp;</p>
                    <input id="syval" />
                  </label>
                  <label className="prop_label">
                    <p>O :&nbsp;</p>
                    <input id="oval" />
                  </label>
                </FlexBox>
              </FlexBox>
              <label className="prop_label">
                <p>Visible :&nbsp;</p>
                <select id="vval">
                  <option value="true">show</option>
                  <option value="false">hide</option>
                </select>
              </label>
              <label className="prop_label">
                <p>Operation :&nbsp;</p>
                <select id="coval" style={{ flex: '1' }}>
                  {compOpers.map((co, i) => <option key={`co-${i}`} value={co}>{co}</option>)}
                </select>
              </label>

            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="timeline" dir="row" weight={1}>
              <FlexBox className="timeline_head" style={{ width: '220px', position: 'relative' }}>
                <div id="timehead_head">
                  <label>
                    <input type="checkbox" id="tm_toggle" />
                  타임라인
                </label>
                </div>
                <div id="tl_names" className="nsb"></div>
              </FlexBox>
              <Split dir="vertical"></Split>
              <FlexBox className="timeline_body" weight={1} style={{ position: 'relative' }}>
                <div className="timebar"></div>
                <div id="timebody_head"></div>
                <div id="tl_props" className="nsb"></div>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </FlexBox>
        <input style={{ display: 'none' }} type="file" id="folder" webkitdirectory directory />
      </main>
    </div>
  );
};

export default Home;
