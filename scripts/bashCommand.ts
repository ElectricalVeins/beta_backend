import { spawn } from 'child_process';

export default async function bashCommand(
  command: string,
  args?: string[],
  errorMessage?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cli = spawn(command, args, { shell: true, stdio: 'inherit' });

    // cli.stdout.on('data', (data) => { console.log(data.toString()) })
    // cli.stderr.on('data', (data) => { console.log(data.toString()) })

    cli.on('exit', (code) => {
      if (code > 0) {
        reject(errorMessage);
      }
      resolve();
    });
    cli.on('error', (error) => {
      reject(error);
    });
  });
}
