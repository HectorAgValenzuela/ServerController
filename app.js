const { Client } = require('ssh2');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Crear servidor HTTP
const server = http.createServer(app);
const io = socketIo(server);

// Conectar a la instancia VM de Oracle
function connectToOracleVM(command) {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Conexión SSH establecida');
      conn.shell((err, stream) => {
        if (err) return reject(err);
  
        stream.on('close', (code, signal) => {
          resolve({ code, signal });
        }).on('data', (data) => {
          // Emitir datos a todos los clientes conectados a través de WebSocket
          io.emit('output', data.toString('utf8'));
        }).stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
  
        // Enviar el comando al shell
        stream.write(command + '\n');
        stream.end('exit\n');
      });
    }).connect({
        host: process.env.host,
        port: process.env.portServer,
        username: process.env.usernameHost,
        privateKey: process.env.privateKey
    });
  });
}

// Rutas para controlar el servidor
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/encender', async (req, res) => {
  try {
    const command = `cd ${process.env.serverDirectory} && sudo screen java -Xmx1024M -Xms1024M -jar server.jar nogui`;
    await connectToOracleVM(command);
    res.send('Servidor encendido correctamente.');
  } catch (error) {
    console.error('Error al encender el servidor:', error);
    res.status(500).send('Error al encender el servidor.');
  }
});

app.post('/apagar', async (req, res) => {
  try {
    const command = `sudo killall screen && cd ..`;
    await connectToOracleVM(command);
    res.send('Servidor apagado correctamente.');
  } catch (error) {
    console.error('Error al apagar el servidor:', error);
    res.status(500).send('Error al apagar el servidor.');
  }
});

app.post('/reiniciar', async (req, res) => {
  try {
    const command = `sudo reboot`;
    await connectToOracleVM(command);
    res.send('Servidor apagado correctamente.');
  } catch (error) {
    console.error('Error al apagar el servidor:', error);
    res.status(500).send('Error al apagar el servidor.');
  }
});

// WebSocket para manejar la salida del servidor en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado');
});

// Iniciar el servidor web
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor web iniciado en el puerto ${PORT}`);
});
