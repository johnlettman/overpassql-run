import { mkdir, readFile, writeFile } from 'fs';
import { dirname, resolve as fullpath } from 'path';

export async function input(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (path) {
      readFile(path, { encoding: 'utf-8', flag: 'r' }, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    } else {
      try {
        resolve(process.stdin.read());
      } catch (err) {
        reject(err);
      }
    }
  });
}

export async function output(path: string, data: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (path) {
      mkdir(dirname(path), { recursive: true }, (err) => {
        if (err) {
          return reject(err);
        }

        writeFile(path, data, { encoding: 'utf-8', flag: 'w' }, (err) => {
          err ? reject(err) : resolve();
        });
      });
    } else {
      process.stdout.write(data + '/n', 'utf-8', (err) => {
        err ? reject(err) : resolve();
      });
    }
  });
}
