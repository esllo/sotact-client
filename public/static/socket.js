const io = require('socket.io-client');

const Conn = (() => {
  const reqAddr = "http://localhost";
  function requestAddr(key, cb) {
    fetch(reqAddr).then(r => r.json()).then(j => {
      cb(j);
    }).catch(cb({ addr: 'http://localhost', port: 3002, room: '/' }));
  }
  const Session = ((key) => {
    const data = {
      key: key,
      phase: 0,
      failed: false,
    };
    function requestCallback(json) {
      _failed(false);
      _phase(2);
      if (json === undefined) {
        _failed(true);
        return;
      }
      data.addr = json.addr;
      data.port = json.port;
      data.room = json.room;
      connectSocket();
    }
    function connectSocket() {
      _failed(false);
      addr = data.addr + ':' + data.port + data.room;
      data.socket = io.connect(addr, { timeout: 5000, reconnection: false });
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
      }, 5000);
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
      socket: socket
    };
  });
  return { Session: Session };
})();
