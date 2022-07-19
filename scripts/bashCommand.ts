import { spawn, StdioOptions } from 'child_process';

type bashOpts = {
  args?: string[];
  errorMessage?: string;
  io?: StdioOptions | undefined;
};

export default async function bashCommand(command: string, opts?: bashOpts): Promise<void> {
  const { io = 'inherit', errorMessage, args } = opts;
  return new Promise((resolve, reject) => {
    const cli = spawn(command, args, { shell: true, stdio: io });

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
