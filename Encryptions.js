function encrypt(text, depth) {
    var len = text.length;
    var encryptedarray = [];
    var encryptedtext = '';
    var rows = depth;
    var columns = len;
    var k = 0;
    var flag1 = false;
    var flag2 = false;
    for (let i = 0; i < rows; i++) {
        encryptedarray[i] = [];
    }
    for (let i = 0, j = 0; i < columns; i++) {
        encryptedarray[j][i] = text.charAt(k++);
        if (j == 0) {
            flag1 = true;
            flag2 = false;
        } else if (j == rows - 1) {
            flag2 = true;
            flag1 = false;
        }
        if (flag1 == true && flag2 == false) j++;
        else if (flag1 == false && flag2 == true) j--;
    }
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            if (encryptedarray[i][j] != undefined)
                encryptedtext += encryptedarray[i][j];
        }
    }
    return encryptedtext;
}

function decrypt(cipher, depth) {
    var len = cipher.length;
    var decryptedarray = [];
    var decrypttext = '';
    var rows = depth;
    var columns = len;
    var k = 0;
    var flag1 = false;
    var flag2 = false;
    for (let i = 0; i < rows; i++) {
        decryptedarray[i] = [];
    }
    let row = 0,
        col = 0;
    for (let i = 0; i < columns; i++) {
        if (row == 0) {
            flag1 = true;
            flag2 = false;
        } else if (row == rows - 1) {
            flag2 = true;
            flag1 = false;
        }
        decryptedarray[row][col++] = '*';
        if (flag1 == true && flag2 == false) row++;
        else if (flag1 == false && flag2 == true) row--;
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (decryptedarray[i][j] == '*' && k < len) {
                decryptedarray[i][j] = cipher[k++];
            }
        }
    }
    (row = 0), (col = 0);
    for (let i = 0; i < columns; i++) {
        if (row == 0) {
            flag1 = true;
            flag2 = false;
        }
        if (row == rows - 1) {
            flag2 = true;
            flag1 = false;
        }
        if (decryptedarray[row][col] != '*')
            decrypttext += decryptedarray[row][col++];
        if (flag1 == true && flag2 == false) row++;
        else if (flag1 == false && flag2 == true) row--;
    }
    return decrypttext;
}

module.exports = { encrypt, decrypt };
