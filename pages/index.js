import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Konva from 'konva';
import TitleBar from '../comp/TitleBar';
import FlexBox from '../comp/FlexBox';
import Split from '../comp/Split';

const Home = (props) => {
  let stage;
  let layer = null;
  let objs = [];
  useEffect(() => {
    window.Konva = Konva;
    stage = new Konva.Stage({
      container: 'container',
      width: 1000,
      height: 1000,
    });
    console.log(stage);
    window.stage = stage;
  }, []);
  const randColor = () => {
    let color = '#';
    color += Math.floor(Math.random() * 256).toString(16);
    color += Math.floor(Math.random() * 256).toString(16);
    color += Math.floor(Math.random() * 256).toString(16);
    console.log(color);
    return color;
  };
  const addButton = (e) => {
    if (layer == null) {
      layer = new Konva.Layer();
      stage.add(layer);
      window.layer = layer;
    }
    let rect = new Konva.Rect({
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      width: Math.random() * 50 + 30,
      height: Math.random() * 50 + 30,
      fill: randColor(),
      draggable: true,
    });
    rect.offsetX(rect.width() / 2);
    rect.offsetY(rect.height() / 2);
    // rect.x(rect.x() + rect.width);
    objs = [...objs, rect];
    layer.add(rect);
    layer.batchDraw();
  };
  const logButton = (e) => {
    console.log(objs);
  };
  const rotButton = (e) => {
    for (const obj of objs) {
      obj.to({
        rotation: 360,
        duration: 0.3,
        onFinish: () => obj.rotation(0),
      });
    }
  };
  const resButton = (e) => {
    for (const obj of objs) {
      layer.remove(obj);
    }
    objs = [];
    layer.batchDraw();
  };
  const upButton = (e) => {
    for (const obj of objs) {
      obj.to({
        duration: 0.3,
        y: obj.y() - 30,
      });
    }
  };
  const downButton = (e) => {
    for (const obj of objs) {
      obj.to({
        duration: 0.3,
        y: obj.y() + 30,
      });
    }
  };
  const leftButton = (e) => {
    for (const obj of objs) {
      obj.to({
        duration: 0.3,
        x: obj.x() - 30,
      });
    }
  };
  const rightButton = (e) => {
    for (const obj of objs) {
      obj.to({
        duration: 0.3,
        x: obj.x() + 30,
      });
    }
  };
  const diagButton = (e) => {
    for (const obj of objs) {
      obj.to({
        duration: 1,
        x: obj.x() + 50,
        y: obj.y() + 50,
        innerRadius: 30,
      });
    }
  };
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
        <FlexBox dir="column">
          <FlexBox className="top" dir="row" minHeight="34px"></FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="middle" dir="row">
            <FlexBox className="left" dir="column">
              <button onClick={addButton}>addRect</button>
              <button onClick={logButton}>Log Objs</button>
              <button onClick={rotButton}>Rotate 360</button>
              <button onClick={upButton}>Move Up</button>
              <button onClick={downButton}>Move Down</button>
              <button onClick={leftButton}>Move Left</button>
              <button onClick={rightButton}>Move Right</button>
              <button onClick={diagButton}>Move Diagonal</button>
              <button onClick={resButton}>Reset</button>
              <input type="file" />
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="center" dir="row">
              <div id="container"></div>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="right" dir="column"></FlexBox>
          </FlexBox>
          <Split dir="horizontal"></Split>
          <FlexBox className="bottom" dir="row">
            <FlexBox className="properties" dir="row"></FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="timeline" dir="row"></FlexBox>
          </FlexBox>
        </FlexBox>
      </main>
    </div>
  );
};

export default Home;
