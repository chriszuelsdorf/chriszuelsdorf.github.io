function relLumeHelper(v) {
    if (v <= 0.03928) {
        var rv = v / 12.92;
    } else {
        // ((RsRGB+0.055)/1.055) ^ 2.4
        var rv = Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return rv;
}

function calcRelLume(r, g, b) {
    sR = relLumeHelper(r / 255);
    sG = relLumeHelper(g / 255);
    sB = relLumeHelper(b / 255);
    // L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    let rv = (0.2126 * sR) + (0.7152 * sG) + (0.0722 * sB);
    return rv;
}

function chgBackground(color) {
    let tmd = document.getElementById("themaindiv");
    if (tmd) {
        tmd.style.backgroundColor = color;
        tmd.style.color = color;
    } else {
        console.log("The element was not found!")
    }
}

function chgHexToJson(hexstring) {
    let red = (16 * parseInt(hexstring[1], 16)) + parseInt(hexstring[2], 16);
    let grn = (16 * parseInt(hexstring[3], 16)) + parseInt(hexstring[4], 16);
    let blu = (16 * parseInt(hexstring[5], 16)) + parseInt(hexstring[6], 16);
    return {
        'r': red,
        'g': grn,
        'b': blu,
    };
}

function genList() {
    let lst = [];
    let lets = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    lets.forEach(elem1 => {
        lets.forEach(elem2 => {
            lets.forEach(elem3 => {
                lst[lst.length] = '#' + elem1 + '0' + elem2 + '0' + elem3 + '0';
            });
        });
    });
    return lst;
}

function grcol(rscore) {
    if (rscore <= 2) {
        return "d01010";
    } else if (rscore <= 2.5) {
        return "d06010";
    } else if (rscore < 4) {
        return "d0a010";
    } else if (rscore < 7) {
        return "d0e010";
    } else {
        return "00f000";
    }
}

function removeHashFromStr(tstr) {
    ostr = String(tstr);
    while (ostr[0] == "#") {
        ostr = ostr.substring(1);
    }
    return ostr;
}

function verifyColorValid(where_to_get, where_to_pester) {
    let buttonstringdesc = document.getElementById(where_to_pester);
    buttonstringdesc.innerHTML = "";
    let ncolentry = document.getElementById(where_to_get).value;
    // If there's a hash, remove it.
    ncolentry = removeHashFromStr(ncolentry);
    // Verify
    for (let letter of ncolentry) {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'].indexOf(letter) < 0) {
                buttonstringdesc.innerHTML = "There was a disallowed character `" + String(letter) + "` in the string!";
                throw "There was a disallowed character `" + String(letter) + "` in the hex string";
             }
    }
    if(ncolentry.length > 6) {
        buttonstringdesc.innerHTML = "The value passed was too long!";
        throw "The value was too long!";
    } else if (ncolentry.length < 6) {
        buttonstringdesc.innerHTML = "The value passed was too short!";
        throw "The value was too short!"
    }
    return ncolentry;
}

function setBackground() {
    // Verify the color, and get the string formatted right
    let ncolentry = "#" + verifyColorValid("hex-input-box", "buttonstringdesc");
    console.log("Setting color to " + ncolentry + "!");
    chgBackground(ncolentry);
    // Now, refresh all the ones.
    var tag_names = genList();
    var bkg = chgHexToJson(ncolentry);
    console.log(bkg);
    console.log(ncolentry);
    // Change the values
    tag_names.forEach(elem => {
        let telem = document.getElementById(elem);
        let tva = chgHexToJson(elem);
        let rl1 = calcRelLume(bkg['r'], bkg['g'], bkg['b']) + 0.05;
        let rl2 = calcRelLume(tva['r'], tva['g'], tva['b']) + 0.05;
        console.log(rl1)
        let rsc = Math.max(rl1, rl2) / Math.min(rl1, rl2);
        telem.innerHTML = String(rsc).substring(0,4);
        // grres = grcol(rsc);
        // telem.style.borderLeft = "1px solid #" + grres;
        // telem.style.borderRight = "1px solid #" + grres;
        telem.style.color = "#" + grcol(rsc);
    });
}

