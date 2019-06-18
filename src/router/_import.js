/* eslint-disable */
module.exports = (parantfile, file) => r => {
  import('views/' + parantfile + '/' + file + '.vue').then(module => {
    r(module);
  });
};
