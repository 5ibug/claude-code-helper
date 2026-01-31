import open from 'open';

export async function openBrowser(url) {
  try {
    await open(url);
  } catch (error) {
    console.warn(`Failed to open browser: ${error.message}`);
  }
}
