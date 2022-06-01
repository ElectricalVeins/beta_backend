import { App } from './App';

async function boot() {
  const app = await App.initialize();
  app.start();
}

boot();
