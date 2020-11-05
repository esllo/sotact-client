const io = require('socket.io-client');

const Conn = (() => {
  const reqAddr = "http://13.125.218.2:5500/";
  const map = new Map();
  function requestAddr(key, cb) {
    fetch(reqAddr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; utf-8'
      },
      body: JSON.stringify({ action: "room", key: key })
    }).then(r => r.json()).then(j => {
      console.log(j);
      cb(j);
    }).catch(cb());
  }

  function send(key, pk, data) {
    let session = map.get(key);
    session.send(pk, data);
  }

  const Session = ((key) => {
    map.set(key, this);
    const data = {
      key: key,
      phase: 0,
      failed: false,
    };
    function initListener(socket){
      socket.on('lockDeny', (pk) => {
        // pk = src;
      });
      socket.on('lock', (pk) => {
        // pk.id = src;
        // pk.to = socket.id;
      });
      socket.on('unlock', (pk) => {
        // pk.id = src;
      });
      socket.on('fullData', (pk) => {
        //pk = data;
      });
      socket.on('attrChange', (pk) => {
        Tool.attrChange(pk);
      });
    }
    function send(pk, d) {
      console.log('send packet');
      console.log(`  ${pk} : ${JSON.stringify(d)}`);
      data.socket.emit(pk, d);
    }
    function requestCallback(json) {
      _failed(false);
      _phase(2);
      if (json === undefined || !json.result) {
        _failed(true);
        return;
      }
      json = json.dist;
      data.addr = json.addr;
      data.port = json.port;
      data.room = json.room;
      console.log('json');
      console.log(json);
      addr = data.addr + ':' + data.port + '/' + data.room;
      console.log(addr);
      data.socket = io(addr, { timeout: 5000, reconnection: true, autoConnect: false });
      initListener(data.socket);
      connectSocket();
    }
    function connectSocket() {
      _failed(false);
      data.socket.connect();
      _phase(3);
      console.log(data.socket);
      setTimeout(() => {
        _phase(4);
        if (data.socket.io.readyState == 'closed' || data.socket.disconnected) {
          _failed(true);
          data.socket.disconnect();
          return;
        }
        _phase(5);
      }, 3000);
    }
    function isConnected() {
      return data.socket.connected;
    }
    function disconnect() {
      _phase(3);
      data.socket.disconnect();
    }
    function connect() {
      _phase(1);
      requestAddr(key, requestCallback);
    }
    const _phase = (p) => (data.phase = p || data.phase);
    const _failed = (f) => (data.failed = f || data.failed);
    const socket = () => data.socket;
    return {
      connect: connect,
      reconnect: connectSocket,
      disconnect: disconnect,
      isConnected: isConnected,
      phase: () => _phase(),
      failed: () => _failed(),
      socket: socket,
      send: send
    };
  });
  return { Session: Session, send: send };
})();
