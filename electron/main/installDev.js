const {
    default: installExtension,
    VUEJS3_DEVTOOLS
} = require("electron-devtools-installer");

const installExt = async () => {
    await installExtension(VUEJS3_DEVTOOLS)
        .then(() => {
            console.log('Added Extension');
        })
        .catch((err) => {
            console.log('Extension Error: ', err);
        });
}

export default installExt
