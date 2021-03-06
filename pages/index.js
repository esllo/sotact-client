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
          <FlexBox className="titleHead" dir="row" minHeight="22px" background="#BDBDBD" style={{ color: '#191818', justifyContent: 'center' }}>
            <h2 id="title_head" style={{ fontSize: '15px', lineHeight: '22px' }}>Title Text</h2>
          </FlexBox>
          <FlexBox className="top" dir="row" minHeight="50px" background="#191818">
            <div className="profile_box">
              <img src="./out/static/img/etc/etc_profile.svg" />
              <h4 id="login" className="profile_name" style={{ flex: 1 }}>Login</h4>
              <h4 className="profile_share">-</h4>
            </div>
            <div className="control_box">
              <img id="tb0" src="./out/static/img/etc/etc_play.svg" />
              <img id="tb1" src="./out/static/img/etc/etc_pause.svg" />
              <img id="tb2" src="./out/static/img/etc/etc_stop.svg" />
            </div>
            <input id="selector_hidden" type="file" style={{ display: 'none' }} />
            <div style={{ flex: 1 }}></div>
            <div className="scale_box">
              <img src="./out/static/img/etc/etc_zoom.svg" />
              <input type="range" min="1" max="200" id="scale" />
            </div>
            <div className="exit_box">
              <div>
                <img src="./out/static/img/etc/etc_out.svg" />
              </div>
            </div>
          </FlexBox>
          <Split dir="horizontal"></Split>
          <div style={{ width: '48px', height: '3px', margin: '-3px 283px 0 auto', background: '#232323', zIndex: 1002 }}></div>
          <FlexBox className="bot" dir="row" weight={1}>
            <FlexBox className="left" dir="column" style={{ width: '300px' }}>
              <div className="property">
                <p>Source</p>
              </div>
              <FlexBox className="layers" dir="column" weight={1} style={{ overflowY: "auto", marginRight: '3px' }}>
              </FlexBox>
              <FlexBox
                className="properties"
                dir="column"
                style={{ padding: '8px 0' }}>

                <div className="property">
                  <p>Properties</p>
                </div>
                <div className="prop_name">
                  <p id="nval" style={{ lineHeight: '32px', color: '#efefef', padding: '0 20px' }}></p>
                </div>
                <FlexBox dir="row">
                  <FlexBox dir="column" weight="1">
                    <label className="prop_label">
                      <p>X</p>
                      <input id="xval" />
                    </label>
                    <label className="prop_label">
                      <p>Y</p>
                      <input id="yval" />
                    </label>
                    <label className="prop_label">
                      <img src="./out/static/img/etc/etc_rotation.svg" />
                      <input id="rval" />
                    </label>
                  </FlexBox>
                  <FlexBox dir="column" weight="1">
                    <label className="prop_label">
                      <p>W</p>
                      <input id="sxval" />
                    </label>
                    <label className="prop_label">
                      <p>H</p>
                      <input id="syval" />
                    </label>
                    <label className="prop_label">
                      <img src="./out/static/img/etc/etc_transparent.svg" />
                      <input id="oval" />
                    </label>
                  </FlexBox>
                </FlexBox>
                <label className="prop_label">
                  <p style={{ width: '80px' }}>Operation :&nbsp;</p>
                  <select id="coval" style={{ flex: '1' }}>
                    {compOpers.map((co, i) => <option key={`co-${i}`} value={co}>{co}</option>)}
                  </select>
                </label>
                <label className="prop_label">
                  <p style={{ width: '80px' }}>Visible :&nbsp;</p>
                  <select id="vval" style={{ flex: '1' }}>
                    <option value="true">show</option>
                    <option value="false">hide</option>
                  </select>
                </label>
              </FlexBox>
            </FlexBox>
            <Split dir="vertical"></Split>
            <FlexBox className="centerize" weight={1}>
              <FlexBox className="middle" dir="row" weight={1}>
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
                  style={{ width: '280px', overflowY: 'auto', position: 'relative' }}>
                  <div className="property" style={{ position: 'fixed', zIndex: 999 }}>
                    <p>Presets</p>
                  </div>
                  <FlexBox className="fx_presets" style={{ overflow: 'hidden', marginTop: '31px' }}>

                  </FlexBox>
                </FlexBox>
              </FlexBox>
              <Split dir="horizontal"></Split>
              <FlexBox className="bottom" dir="row" style={{ height: '240px' }}>
                <FlexBox className="timeline" dir="row" weight={1}>
                  <FlexBox className="timeline_head" style={{ width: '220px', position: 'relative' }}>
                    <div id="timehead_head">
                      <label>
                        <input type="checkbox" id="tm_toggle" />
                        ????????????
                      </label>
                    </div>
                    <div id="tl_names" className="nsb"></div>
                  </FlexBox>
                  <Split dir="vertical"></Split>
                  <FlexBox className="timeline_body" weight={1} style={{ position: 'relative' }}>
                    <div className="timebar"></div>
                    <div id="timebody_head">
                      <div className="unit_vals">
                        {(new Array(21).fill(0)).map((e, i) => {
                          if (i % 2 == 0) {
                            return <div className={['val', `val-${i}`].join(' ')}>{parseInt(i / 2) * 10}%</div>
                          } else {
                            return <div className={['val-sp']}></div>
                          }
                        })};
                      </div>
                      <div className="unit_caps">
                        {(new Array(201).fill(0)).map((e, i) => {
                          if (i % 2 == 0) {
                            let cls = ['ucap'];
                            (i % 10 == 0) && cls.push('ucap-high');
                            return <div className={cls.join(' ')}></div>
                          } else {
                            return <div className={"ucap-sp"}></div>
                          }
                        })}
                      </div>
                    </div>
                    <div id="tl_props" className="nsb"></div>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </FlexBox>
        <input style={{ display: 'none' }} type="file" id="folder" webkitdirectory directory />
        <div className="alert_box"></div>
        <div className="wrap_panel">
          <div className="account_info">
            <h2>Account</h2>
            <img src="./out/static/img/account/account_account_profile.svg" />
            <h4>Name</h4>
            <h5>Email</h5>
            <button id="logout">LOGOUT</button>
            <div class="account_exit">
              <img src="./out/static/img/cloud/cloud_X.svg" />
            </div>
          </div>
          <div className="so">
            <h2 className="so_title">Open</h2>
            <div class="so_from">
              <img id="so_local" />
              <img id="so_cloud" />
            </div>
            <div class="so_input off">
              <input id="save_input" placeholder="??????????????? ????????? ???????????????." />
              <button id="save_cloud">??????</button>
            </div>
            <div class="so_exit">
              <img src="./out/static/img/cloud/cloud_X.svg" />
            </div>
          </div>
        </div>
      </main>
    </div >
  );
};

export default Home;
