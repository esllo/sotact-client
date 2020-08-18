import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Konva from 'konva';
import TitleBar from '../comp/TitleBar';
import FlexBox from '../comp/FlexBox';
import Split from '../comp/Split';

const Home = (props) => {
  useEffect(() => {
    if (window !== undefined){
      useEffectOccured();
    }
  }, []);

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
          <FlexBox className="top" dir="row" minHeight="34px"></FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="middle" dir="row" weight={1}>
            <FlexBox className="left" dir="column" style={{ width: '280px' }}>
              <input type="file" />
              <input type="range" min="1" max="200" id="scale" />
              <label>
                <input type="checkbox" id="tm_toggle" />
                타임라인
              </label>
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
              style={{ width: '280px' }}></FlexBox>
          </FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="bottom" dir="row" style={{ height: '260px' }}>
            <FlexBox
              className="properties"
              dir="column"
              style={{ width: '400px' }}>
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

              <button id="tb0">Start Timebar</button>
              <button id="tb1">Stop Timebar</button>
              <button id="tb2">Reset Timebar</button>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="timeline" dir="row" weight={1}>
              <FlexBox className="timeline_head" style={{ width: '220px', position: 'relative' }}>
                <div id="timehead_head"></div>
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
      </main>
    </div>
  );
};

export default Home;
