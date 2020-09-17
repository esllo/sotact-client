import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Konva from 'konva';
import TitleBar from '../comp/TitleBar';
import FlexBox from '../comp/FlexBox';
import Split from '../comp/Split';
import { divide } from 'lodash';

const Home = (props) => {
  useEffect(() => {
    if (window !== undefined) {
      useEffectOccured();
    }
  }, []);
  const [to, setTo] = useState(0);
  const [from, setFrom] = useState(100);

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
          <FlexBox className="top" dir="row" minHeight="34px" background="#3d3d3d">
            <input id="selector_hidden" type="file" style={{ display: 'none' }} />
            <input id="selector" type="button" value="Open File" />
            <input id="save" type="button" value="Save" />
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
            <FlexBox className="left" dir="column" style={{ width: '280px' }}>
              <div className="property">
                <p>Layer</p>
              </div>
              <FlexBox className="layers" dir="column">
              </FlexBox>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox
              background="#828282"
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
          <FlexBox className="bottom" dir="row" style={{ height: '260px' }}>
            <FlexBox
              className="properties"
              dir="column"
              style={{ width: '400px' }}>

              <div className="property">
                <p>Properties</p>
              </div>
              <label>
                <p>name :&nbsp;</p>
                <input id="nval" disabled style={{ width: '200px' }} />
              </label>
              <FlexBox dir="row">
                <FlexBox dir="column" weight="1">
                  <label>
                    <p>x :&nbsp;</p>
                    <input id="xval" />
                  </label>
                  <label>
                    <p>y :&nbsp;</p>
                    <input id="yval" />
                  </label>
                </FlexBox>
                <FlexBox dir="column" weight="1">
                  <label>
                    <p>rotation :&nbsp;</p>
                    <input id="rval" />
                  </label>
                  <label>
                    <p>opacity :&nbsp;</p>
                    <input id="oval" />
                  </label>
                </FlexBox>
              </FlexBox>

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
        <input style={{display:'none'}} type="file" id="folder" webkitdirectory directory/>
      </main>
    </div>
  );
};

export default Home;
