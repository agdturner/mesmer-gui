/**
 * Load a specific XML File
 */ function load(xmlFile) {
    console.log(xmlFile.toString());
    let request = new XMLHttpRequest();
    request.open("GET", xmlFile, false);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) parse(request.responseXML);
    };
    request.send();
}
function parse(xml) {
    /**
     * Log to console and display me.title.
     * This goes through the entire XML file and writes out log messages to the consol.
     */ console.log("typeof xml = " + typeof xml);
    console.log("xml.toString() = " + xml.toString());
    let elements = xml.getElementsByTagName("*");
    console.log("Number of elements=" + elements.length);
    for(let i = 0; i < elements.length; i++){
        let nn = elements[i].nodeName;
        //let tn = elements[i].tagName;
        //let nn = elements[i].getNodeName();
        if (nn != null) {
            //console.log("elements[" + i + "].nodeName = " + nn);
            //console.log("elements[" + i + "].tagName = " + nn);
            let cn = elements[i].childNodes[0];
            if (cn != null) {
                let nv = cn.nodeValue;
                if (nv != null) {
                    nv = nv.trim();
                    if (nv.length > 0) {
                        if (nn === "me:title") document.getElementById("metitle").innerHTML = nv;
                    }
                }
            }
        }
    }
    // The following does not work because of the ":" in the tag.
    //var title = xmlDoc.getElementsByTagName('me:title').nodeValue;
    //console.log("Title=" + title);
    //document.getElementById("metitle").innerHTML = title;
    /**
     * Generate molecules table.
     */ document.getElementById("molecules").innerHTML = getTable(generateMoleculesTable(xml));
    /**
     * Generate reactions table.
     */ document.getElementById("reactions").innerHTML = getTable(generateReactionsTable(xml));
}
/**
 * Generate reactions table.
 * @param XMLDocument xml
 * @return String
 */ function generateReactionsTable(xml) {
    var reactions = xml.getElementsByTagName("reaction");
    console.log("" + reactions.length + " = Number of reactions");
    // Report number of reactions with id attributes.
    console.log(count(reactions, "id") + " = Number of reactions with ids");
    // Prepare table headings.
    names = [
        "ID",
        "Reactants",
        "Products",
        "Transition State",
        "PreExponential",
        "Activation Energy",
        "TInfinity",
        "NInfinity"
    ];
    var table = getTH(names);
    // Process each reaction.
    for(let i = 0; i < reactions.length; i++){
        let id = reactions[i].getAttribute("id");
        var treactants = "";
        var tproducts = "";
        var ttransitionState = "";
        var tpreExponential = "";
        var tactivationEnergy = "";
        var ttInfinity = "";
        var tnInfinity = "";
        if (id != null) {
            console.log("id = " + id);
            let elements = reactions[i].getElementsByTagName("*");
            console.log("elements.length = " + elements.length);
            for(let j = 0; j < elements.length; j++){
                //console.log("elements[" + j + "] = " + elements[j]);
                //console.log("elements[" + j + "].length = " + elements[j].length);
                console.log("elements[" + j + "].nodeName = " + elements[j].nodeName);
                //console.log("elements[" + j + "].nodeValue = " + elements[j].nodeValue);
                if (elements[j].nodeName === "reactant") {
                    let molecules = elements[j].getElementsByTagName("molecule");
                    //console.log("molecules =" + molecules);
                    //console.log("molecules.length =" + molecules.length);
                    //if (molecules.length > 0) {
                    let moleculeRef = molecules[0].getAttribute("ref");
                    console.log("moleculeRef = " + moleculeRef);
                    let moleculeRole = molecules[0].getAttribute("role");
                    console.log("moleculeRole = " + moleculeRole);
                    if (treactants === "") treactants += moleculeRef;
                    else treactants += " + " + moleculeRef;
                //}
                } else if (elements[j].nodeName === "product") {
                    let molecules = elements[j].getElementsByTagName("molecule");
                    console.log("molecules = " + molecules);
                    console.log("molecules.length = " + molecules.length);
                    if (molecules.length > 0) {
                        let moleculeRef = molecules[0].getAttribute("ref");
                        console.log("moleculeRef = " + moleculeRef);
                        var moleculeRole = molecules[0].getAttribute("role");
                        console.log("moleculeRole = " + moleculeRole);
                        if (tproducts === "") tproducts += moleculeRef;
                        else {
                            console.log("tproducts = " + tproducts);
                            tproducts += " + " + moleculeRef;
                            console.log("tproducts = " + tproducts);
                        }
                    }
                } else if (elements[j].nodeName === "me:MCRCMethod") {
                    console.log("MCRCMethod");
                    console.log('elements[j].getAttribute("xsi:type") = ' + elements[j].getAttribute("xsi:type"));
                    let els = elements[j].getElementsByTagName("*");
                    console.log("els = " + els);
                    console.log("els.length = " + els.length);
                    if (els.length > 0) for(let k = 0; k < els.length; k++){
                        //var moleculeRef = molecules[0].getAttribute("ref");
                        console.log("els[" + k + "] = " + els[k]);
                        console.log("els[" + k + "].nodeName = " + els[k].nodeName);
                        console.log("els[" + k + "].nodeValue = " + els[k].nodeValue);
                        if (els[k].nodeName === "me:preExponential") {
                            let cn = els[k].childNodes;
                            console.log("cn = " + cn);
                            console.log("cn.length = " + cn.length);
                            console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                            if (tpreExponential === "") tpreExponential += cn[0].nodeValue;
                            else tpreExponential += " + " + cn[0].nodeValue;
                        } else if (els[k].nodeName === "me:activationEnergy") {
                            let cn = els[k].childNodes;
                            console.log("cn = " + cn);
                            console.log("cn.length = " + cn.length);
                            console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                            if (tactivationEnergy === "") tactivationEnergy += cn[0].nodeValue;
                            else tactivationEnergy += " + " + cn[0].nodeValue;
                        } else if (els[k].nodeName === "me:TInfinity") {
                            let cn = els[k].childNodes;
                            console.log("cn = " + cn);
                            console.log("cn.length = " + cn.length);
                            console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                            if (ttInfinity === "") ttInfinity += cn[0].nodeValue;
                            else ttInfinity += " + " + cn[0].nodeValue;
                        } else if (els[k].nodeName === "me:nInfinity") {
                            let cn = els[k].childNodes;
                            console.log("cn = " + cn);
                            console.log("cn.length = " + cn.length);
                            console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                            if (tnInfinity === "") tnInfinity += cn[0].nodeValue;
                            else tnInfinity += " + " + cn[0].nodeValue;
                        } else {
                            console.log("Unrecognised nodeName = " + els[k].nodeName);
                            return;
                        }
                    }
                } else if (elements[j].nodeName === "me:transitionState") {
                    let molecules = elements[j].getElementsByTagName("*");
                    console.log("molecules =" + molecules);
                    console.log("molecules.length = " + molecules.length);
                    let moleculeRef = molecules[0].getAttribute("ref");
                    console.log("moleculeRef = " + moleculeRef);
                    let moleculeRole = molecules[0].getAttribute("role");
                    console.log("moleculeRole = " + moleculeRole);
                    if (ttransitionState === "") ttransitionState += moleculeRef;
                    else ttransitionState += " + " + moleculeRef;
                }
            }
            console.log("treactants = " + treactants);
            console.log("tproducts = " + tproducts);
            console.log("ttransitionState = " + ttransitionState);
            console.log("tpreExponential = " + tpreExponential);
            console.log("tactivationEnergy = " + tactivationEnergy);
            console.log("ttInfinity = " + ttInfinity);
            console.log("tnInfinity = " + tnInfinity);
            table += getTR(getTD(id) + getTD(treactants) + getTD(tproducts) + getTD(ttransitionState) + getTD(tpreExponential) + getTD(tactivationEnergy) + getTD(ttInfinity) + getTD(tnInfinity));
            console.log("table = " + table);
        }
    }
    return table;
}
/**
   * Generate molecules table.
   * @param XMLDocument xml
   * @return String
   */ function generateMoleculesTable(xml) {
    var molecules = xml.getElementsByTagName("molecule");
    console.log("" + molecules.length + " = Number of molecules");
    // Report number of molecules with id and description attributes.
    console.log(count(molecules, "id") + " = Number of molecules with ids");
    console.log(count(molecules, "description") + " = Number of molecules with descriptions");
    // Prepare table headings.
    const names1 = [
        "Name",
        "Energy<br>kJ/mol",
        "Rotational constants<br>cm<sup>-1</sup>",
        "Vibrational frequencies<br>cm<sup>-1</sup>"
    ];
    var table = getTH(names1);
    // Process each molecule.
    for(let i = 0; i < molecules.length; i++){
        var energy = "";
        var rotationalConstants = "";
        var vibrationalFrequencies = "";
        let id = molecules[i].getAttribute("id");
        if (id != null) {
            console.log("id =" + id);
            let propertyList = molecules[i].getElementsByTagName("propertyList");
            for(let j = 0; j < propertyList.length; j++){
                let property = propertyList[j].getElementsByTagName("property");
                console.log("property.length =" + property.length);
                for(let k = 0; k < property.length; k++){
                    let dictRef = property[k].getAttribute("dictRef");
                    if (dictRef != null) {
                        if (dictRef === "me:ZPE") {
                            console.log("dictRef =" + dictRef);
                            let scalar = property[k].getElementsByTagName("scalar");
                            console.log("scalar =" + scalar);
                            console.log("scalar.length =" + scalar.length);
                            let cn = scalar[0].childNodes;
                            console.log("cn.length =" + cn.length);
                            for(let l = 0; l < cn.length; l++){
                                console.log("cn[" + l + "]");
                                if (cn[l] != null) {
                                    console.log("cn[" + l + "] =" + cn[l]);
                                    console.log("cn[" + l + "].length =" + cn[l].length);
                                    console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                                    console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                                    energy = cn[l].nodeValue;
                                    console.log("energy =" + energy);
                                }
                            }
                        } else if (dictRef === "me:rotConsts") {
                            console.log("dictRef =" + dictRef);
                            let array = property[k].getElementsByTagName("array");
                            console.log("array =" + array);
                            console.log("array.length =" + array.length);
                            let cn = array[0].childNodes;
                            console.log("cn.length =" + cn.length);
                            for(let l = 0; l < cn.length; l++){
                                console.log("cn[" + l + "]");
                                if (cn[l] != null) {
                                    console.log("cn[" + l + "] =" + cn[l]);
                                    console.log("cn[" + l + "].length =" + cn[l].length);
                                    console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                                    console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                                    rotationalConstants = cn[l].nodeValue;
                                    console.log("rotationalConstants =" + rotationalConstants);
                                }
                            }
                        } else if (dictRef === "me:vibFreqs") {
                            console.log("dictRef =" + dictRef);
                            let array = property[k].getElementsByTagName("array");
                            console.log("array =" + array);
                            console.log("array.length =" + array.length);
                            let cn = array[0].childNodes;
                            console.log("cn.length =" + cn.length);
                            for(let l = 0; l < cn.length; l++){
                                console.log("cn[" + l + "]");
                                if (cn[l] != null) {
                                    console.log("cn[" + l + "] =" + cn[l]);
                                    console.log("cn[" + l + "].length =" + cn[l].length);
                                    console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                                    console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                                    vibrationalFrequencies = cn[l].nodeValue;
                                    console.log("vibrationalFrequencies =" + vibrationalFrequencies);
                                }
                            }
                        } else console.log("dictRef =" + dictRef);
                    }
                }
            }
            table += getTR(getTD(id) + getTD(energy) + getTD(rotationalConstants) + getTD(vibrationalFrequencies));
        }
    }
    return table;
}
/**
 * Count the number of elements with a specific attribute.
 * @param Element[] elements
 * @param String attribute_name
 * @return int
 */ function count(elements, attribute_name) {
    let r = 0;
    for(let i = 0; i < elements.length; i++)if (elements[i].getAttribute(attribute_name) != null) r++;
    return r;
}
/*
  * @param headings An array of strings.
  * @return String
  */ function getTH(headings) {
    var th = "";
    for(let i = 0; i < headings.length; i++)th += "<th>" + headings[i] + "</th>";
    return getTR(th);
}
/*
  * @param String x A cell for a table row.
  * @return x wrapped in td tags.
  */ function getTD(x) {
    return "<td>" + x + "</td>";
}
/*
  * @param String x A row for a table.
  * @return x wrapped in tr tags.
  */ function getTR(x) {
    return "<tr>" + x + "</tr>\n";
}
/*
  * @param String x Table rows for a table.
  * @return x wrapped in table tags.
  */ function getTable(x) {
    return "<table>" + x + "</table>";
}

//# sourceMappingURL=DisplayXML.5e178f1f.js.map
