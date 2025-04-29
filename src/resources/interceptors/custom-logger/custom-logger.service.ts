import { ConsoleLogger, Injectable } from '@nestjs/common';
import { green, red, white, yellow } from 'colors';
import { appendFileSync } from 'fs';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  customLog(logMessage: string) {
    const message: string = `LOG: ${logMessage} - TIME ${this.getTimestamp()}`;

    this.fileLog(message);
    this.consoleLog(message, 0);
  }

  customError(logMessage: string) {
    const message: string = `ERROR: ${logMessage} - TIME ${this.getTimestamp()}`;

    this.fileLog(message);
    this.consoleLog(message, 1);
  }

  customWarning(logMessage: string) {
    const message: string = `WARNING: ${logMessage} - TIME ${this.getTimestamp()}`;

    this.fileLog(message);
    this.consoleLog(message, 2);
  }

  customDebug(logMessage: string) {
    const message: string = `DEBUG: ${logMessage} - TIME ${this.getTimestamp()}`;

    this.fileLog(message);
    this.consoleLog(message, 3);
  }

  formataLog(nome, quantidade, valor) {
    return `LOCAL: ${this.context} - NOME: ${nome} - QUANTIDADE: {quantidade} - PREÇO: ${valor} - TIMESTAMP ${this.getTimestamp()}`;
  }

  fileLog(message: string) {
    const logPath = './src/resources/loggers/loggerFile.log';
    appendFileSync(logPath, message);
  }

  consoleLog(message: string, type: number) {
    switch (type) {
      case 0:
        console.log(green(message));
        break;
      case 1:
        console.log(red(message));
        break;
      case 2:
        console.log(yellow(message));
        break;
      case 3:
        console.log(white(message));
        break;
      default:
        console.log(green(message));
        break;
    }
  }
}
