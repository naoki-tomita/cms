const UUID_FMT = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
export function uuid() {
  var chars = UUID_FMT.split('');
  for (var i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }

  return chars.join('');
};
