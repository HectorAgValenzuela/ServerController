const { Client } = require('ssh2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la instancia VM de Oracle
function connectToOracleVM(command) {
  const conn = new Client();
  
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Conexión SSH establecida');
      conn.shell((err, stream) => {
        if (err) return reject(err);
  
        let output = '';
        stream.on('close', (code, signal) => {
          resolve({ code, signal, output });
        }).on('data', (data) => {
          output += data.toString('utf8');
          console.log(output);
        }).stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
  
        // Enviar el comando al shell
        stream.write(command + '\n');
        stream.end('exit\n');
      });
    }).connect({
        host: process.env.host,
        port: process.env.port,
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
    
    const command = `sudo killall screen`;
    await connectToOracleVM(command);
    res.send('Servidor apagado correctamente.');
  } catch (error) {
    console.error('Error al apagar el servidor:', error);
    res.status(500).send('Error al apagar el servidor.');
  }
});

// Iniciar el servidor web
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor web iniciado en el puerto ${PORT}`);
});
