require('@babel/register')({
    presets: ['@babel/preset-env']
});

module.exports = {
    spec: 'tests/**/*.js'
};