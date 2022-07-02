require('esbuild').build({
    entryPoints: ['./src/sw.js', './src/scripts/popup.js', './src/scripts/scrapper.js', './src/scripts/scrapperProfile.js'],
    bundle: true,
    target: ['chrome58', 'firefox57', 'safari11'],
    outdir: './dist',
    watch: true,
});