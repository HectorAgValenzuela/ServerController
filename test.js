// Creación de una conexión FTP con una instancia VM de Oracle
// El objetivo de esto es poder ensender un servidor de minecraft 
// mediante una aplicación web estática.

// Pasos a seguir
// Hacer la conexión a la IP
// Usuario y contraseña del servidor
// Archivo con la Key de acceso

// Moverme a la carpeta del servidor 
// ejecutar java -Xmx1024M -Xms1024M -jar server.jar nogui

const { Client } = require('ssh2');
const SftpClient = require('ssh2-sftp-client');
require('dotenv').config();

let onButton = document.getElementById('on');

onButton.onclick = main().catch(err => {
    console.error('Error en la ejecución: ', err);
  });


// Función para ejecutar comandos remotos
function executeRemoteCommand(conn, command) {
    return new Promise((resolve, reject) => {
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
    });
  }

// Función principal
async function main() {
  const conn = new Client();
  const sftp = new SftpClient();

  conn.on('ready', async () => {
    console.log('Conexión SSH establecida');

    // Conectar SFTP
    try {
      await sftp.connect({
        host: process.env.host,
        port: process.env.port,
        username: process.env.usernameHost,
        privateKey: process.env.privateKey
      });
      console.log('Conexión SFTP establecida');

      // Subir archivos necesarios si es necesario
      // await sftp.put('local_path', 'remote_path');

      // Mover a la carpeta del servidor
      console.log(`Cambiando al directorio del servidor: ${process.env.serverDirectory}`);
      //await executeRemoteCommand(conn, `ls && cd ${process.env.serverDirectory} && ls`);
      const command = `cd ${process.env.serverDirectory} && sudo screen java -Xmx1024M -Xms1024M -jar server.jar nogui`;
      const { output } = await executeRemoteCommand(conn, command);

      if(output) {
        console.log(output);
      }

    } catch (err) {
      console.error('Error en la conexión SFTP: ', err);
    } 
  }).connect({
    host: process.env.host,
    port: process.env.port,
    username: process.env.usernameHost,
    privateKey: process.env.privateKey
  });
}


