import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Konva from 'konva';
import TitleBar from '../comp/TitleBar';
import FlexBox from '../comp/FlexBox';
import Split from '../comp/Split';

const Home = (props) => {
  let stage;
  useEffect(() => {
    window.Konva = Konva;
    stage = new Konva.Stage({
      container: 'container',
      width: 500,
      height: 500,
    });
    window.stage = stage;
    const center = document.querySelector('.center');
    stage.width(center.offsetWidth);
    stage.height(center.offsetHeight);
    useEffectOccured();
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
              style={{ width: '440px' }}>
              <lable>
                name :&nbsp;
                <input id="nval" />
              </lable>
              <lable>
                x :&nbsp;
                <input id="xval" />
              </lable>
              <lable>
                y :&nbsp;
                <input id="yval" />
              </lable>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="timeline" dir="row" weight={1}>
              <FlexBox
                className="timeline_head"
                style={{ width: '220px' }}></FlexBox>
              <Split dir="vertical"></Split>
              <FlexBox className="timeline_body" weight={1}></FlexBox>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </main>
    </div>
  );
};

export default Home;
