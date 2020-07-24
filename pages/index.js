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
              dir="row"
              style={{ width: '440px' }}></FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="timeline" dir="row"></FlexBox>
          </FlexBox>
        </FlexBox>
      </main>
    </div>
  );
};

export default Home;
