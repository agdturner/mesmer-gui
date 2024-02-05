/**
 * A map of molecule id to energy.
 */
const moleculeEnergy = new Map([]);

/**
 * For storing the maximum molecule energy in a reaction.
 */
var maxMoleculeEnergy = -Infinity;

/**
 * For storing the minimum molecule energy in a reaction.
 */
var minMoleculeEnergy = Infinity;

/**
 * A map of reaction id to a map of reaction information.
 */
const reactionsInformation = new Map([]);

/**
 * A set of inactive molecule ids.
 */
const inactiveMolecules = new Set([]);

/**
 * Load a specific XML File
 */
function load(xmlFile) {
  console.log("xmlFile.toString() = " + xmlFile.toString());
  console.log("typeof(xmlFile) = " + typeof (xmlFile));
  // This works, but not with node!
  let request = new XMLHttpRequest();
  request.open("GET", xmlFile, true);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      /*
      // Get response as text and convert to XML
      // Get response as text
      let text = request.responseText;
      console.log("text = " + text);
      // Convert text to XML
      let parser = new DOMParser();
      let xml = parser.parseFromString(text, "text/xml");
      */
      // Get response as XML and convert to string
      let xml = request.responseXML;
      // Convert XML to string
      let serializer = new XMLSerializer();
      let text = serializer.serializeToString(xml);
      console.log("text = " + text);
      document.getElementById("xml_text").innerHTML = XMLToHTML(text);

      console.log("xml = " + xml);

      parse(xml);
    }
  };
  request.send();
  /*
  fetch(xmlFile)
    .then(response => response.text())
    .then(text => {
      console.log("text = " + text);
      document.getElementById("xml_text").innerHTML = XMLToHTML(text);
      let parser = new DOMParser();
      let xml = parser.parseFromString(text, "text/xml");
      console.log("xml = " + xml);
      parse(xml);
    }
  );
  */
  /*
  fetch(xmlFile)
    .then(function(response) {
      return response.text();
    }).then(function(text) {
      console.log("text = " + text);
      document.getElementById("xml_text").innerHTML = XMLToHTML(text);
      let parser = new DOMParser();
      let xml = parser.parseFromString(text, "text/xml");
      console.log("xml = " + xml);
      parse(xml);
    }
  );
  */
}

/**
 * Parse the XML file.
 * @param {XMLDocument} xml 
 */
function parse(xml) {
  /**
   * Log to console and display me.title.
   * This goes through the entire XML file and writes out log messages to the consol.
   */
  console.log("typeof(xml) = " + typeof (xml));
  console.log("xml.toString() = " + xml.toString());
  let elements = xml.getElementsByTagName('*');
  console.log("Number of elements=" + elements.length);
  for (let i = 0; i < elements.length; i++) {
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
            if (nn === "me:title") {
              document.getElementById("metitle").innerHTML = nv;
            }
            //console.log("elements[" + i + "].childNodes[0].nodeValue = " + nv);
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
   */
  document.getElementById("molecules").innerHTML = getTable(parseMolecules(xml));

  /**
   * Generate reactions table.
   */
  document.getElementById("reactions").innerHTML = getTable(parseReactions(xml));

  /**
   * Generate reactions well diagram.
   */
  document.getElementById("diagram").innerHTML = createDiagram();
}

/**
 * Generate reactions table.
 * Initialise the reactionsInformation Map.
 * @param XMLDocument xml
 * @return String
 */
function parseReactions(xml) {
  var reactions = xml.getElementsByTagName('reaction');
  console.log("" + reactions.length + " = Number of reactions");
  // Report number of reactions with id attributes.
  console.log(count(reactions, "id") + " = Number of reactions with ids");
  // Prepare table headings.
  names = ["ID", "Reactants", "Products", "Transition State", "PreExponential", "Activation Energy", "TInfinity", "NInfinity"];
  var table = getTH(names);
  // Process each reaction.
  for (let i = 0; i < reactions.length; i++) {
    let id = reactions[i].getAttribute("id");
    var treactants = "";
    var tproducts = "";
    var ttransitionState = "";
    var tpreExponential = "";
    var tactivationEnergy = "";
    var ttInfinity = "";
    var tnInfinity = "";
    if (id != null) {
      //console.log("id = " + id);
      let reactionMap = new Map([]);
      let reactants = new Set([]);
      let products = new Set([]);
      let elements = reactions[i].getElementsByTagName("*");
      //console.log("elements.length = " + elements.length);
      for (let j = 0; j < elements.length; j++) {
        //console.log("elements[" + j + "] = " + elements[j]);
        //console.log("elements[" + j + "].length = " + elements[j].length);
        //console.log("elements[" + j + "].nodeName = " + elements[j].nodeName);
        //console.log("elements[" + j + "].nodeValue = " + elements[j].nodeValue);
        if (elements[j].nodeName === "reactant") {
          let molecules = elements[j].getElementsByTagName("molecule");
          //console.log("molecules =" + molecules);
          //console.log("molecules.length =" + molecules.length);
          //if (molecules.length > 0) {
          let moleculeRef = molecules[0].getAttribute("ref");
          //console.log("moleculeRef = " + moleculeRef);
          let moleculeRole = molecules[0].getAttribute("role");
          //console.log("moleculeRole = " + moleculeRole);
          if (treactants === "") {
            treactants += moleculeRef;
          } else {
            treactants += " + " + moleculeRef;
          }
          reactants.add(moleculeRef);
          //}
        } else if (elements[j].nodeName === "product") {
          let molecules = elements[j].getElementsByTagName("molecule");
          //console.log("molecules = " + molecules);
          //console.log("molecules.length = " + molecules.length);
          if (molecules.length > 0) {
            let moleculeRef = molecules[0].getAttribute("ref");
            //console.log("moleculeRef = " + moleculeRef);
            var moleculeRole = molecules[0].getAttribute("role");
            //console.log("moleculeRole = " + moleculeRole);
            if (tproducts === "") {
              tproducts += moleculeRef;
            } else {
              //console.log("tproducts = " + tproducts);
              tproducts += " + " + moleculeRef;
              //console.log("tproducts = " + tproducts);
            }
            products.add(moleculeRef);
          }
        } else if (elements[j].nodeName === "me:MCRCMethod") {
          //console.log("MCRCMethod");
          //console.log("elements[j].getAttribute(\"xsi:type\") = " + elements[j].getAttribute("xsi:type"));
          let els = elements[j].getElementsByTagName("*");
          //console.log("els = " + els);
          //console.log("els.length = " + els.length);
          if (els.length > 0) {
            for (let k = 0; k < els.length; k++) {
              //var moleculeRef = molecules[0].getAttribute("ref");
              //console.log("els[" + k + "] = " + els[k]);
              //console.log("els[" + k + "].nodeName = " + els[k].nodeName);
              //console.log("els[" + k + "].nodeValue = " + els[k].nodeValue);
              if (els[k].nodeName === "me:preExponential") {
                let cn = els[k].childNodes;
                //console.log("cn = " + cn);
                //console.log("cn.length = " + cn.length);
                //console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                if (tpreExponential === "") {
                  tpreExponential += cn[0].nodeValue;
                } else {
                  tpreExponential += " + " + cn[0].nodeValue;
                }
              } else if (els[k].nodeName === "me:activationEnergy") {
                let cn = els[k].childNodes;
                //console.log("cn = " + cn);
                //console.log("cn.length = " + cn.length);
                //console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                if (tactivationEnergy === "") {
                  tactivationEnergy += cn[0].nodeValue;
                } else {
                  tactivationEnergy += " + " + cn[0].nodeValue;
                }
              } else if (els[k].nodeName === "me:TInfinity") {
                let cn = els[k].childNodes;
                //console.log("cn = " + cn);
                //console.log("cn.length = " + cn.length);
                //console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                if (ttInfinity === "") {
                  ttInfinity += cn[0].nodeValue;
                } else {
                  ttInfinity += " + " + cn[0].nodeValue;
                }
              } else if (els[k].nodeName === "me:nInfinity") {
                let cn = els[k].childNodes;
                //console.log("cn = " + cn);
                //console.log("cn.length = " + cn.length);
                //console.log("cn[0].nodeValue = " + cn[0].nodeValue);
                if (tnInfinity === "") {
                  tnInfinity += cn[0].nodeValue;
                } else {
                  tnInfinity += " + " + cn[0].nodeValue;
                }
              } else {
                //console.log("Unrecognised nodeName = " + els[k].nodeName);
                return;
              }
            }
          }
        } else if (elements[j].nodeName === "me:transitionState") {
          let molecules = elements[j].getElementsByTagName("*");
          //console.log("molecules =" + molecules);
          //console.log("molecules.length = " + molecules.length);
          let moleculeRef = molecules[0].getAttribute("ref");
          //console.log("moleculeRef = " + moleculeRef);
          let moleculeRole = molecules[0].getAttribute("role");
          //console.log("moleculeRole = " + moleculeRole);
          if (ttransitionState === "") {
            ttransitionState += moleculeRef;
          } else {
            ttransitionState += " + " + moleculeRef;
          }
        } else {
          //console.log("elements[" + j + "].nodeName = " + elements[j].nodeName);
        }
      }
      reactionMap.set("reactants", reactants);
      reactionMap.set("reactantLabel", treactants);
      reactionMap.set("products", products);
      reactionMap.set("productsLabel", tproducts);
      reactionMap.set("transitionState", ttransitionState);
      reactionMap.set("preExponential", tpreExponential);
      reactionMap.set("activationEnergy", tactivationEnergy);
      reactionMap.set("tInfinity", ttInfinity);
      reactionMap.set("nInfinity", tnInfinity);
      reactionsInformation.set(id, reactionMap);
      //console.log("treactants = " + treactants);
      //console.log("tproducts = " + tproducts);
      //console.log("ttransitionState = " + ttransitionState);
      //console.log("tpreExponential = " + tpreExponential);
      //console.log("tactivationEnergy = " + tactivationEnergy);
      //console.log("ttInfinity = " + ttInfinity);
      //console.log("tnInfinity = " + tnInfinity);
      table += getTR(getTD(id) + getTD(treactants) + getTD(tproducts) + getTD(ttransitionState) + getTD(tpreExponential) + getTD(tactivationEnergy) + getTD(ttInfinity) + getTD(tnInfinity));
      //console.log("table = " + table);
    }
  }
  //console.log("table = " + table);
  console.log("Reactions:");
  reactionsInformation.forEach (function(reactionMap, id) {
    console.log(id);
    reactionMap.forEach (function (v, k) {
      if (v instanceof Set) {
        console.log(k + ' = ' + Array.from(v));
      } else {
        console.log(k + ' = ' + v);
      }
    })
  })
  console.log("Returning table...");
  return table;
}

/**
 * Generate molecules table.
 * Initialise the moleculeEnergy Map.
 * @param XMLDocument xml
 * @return String
 */
function parseMolecules(xml) {
  var molecules = xml.getElementsByTagName('molecule');
  console.log("" + molecules.length + " = Number of molecules");
  // Report number of molecules with id and description attributes.
  console.log(count(molecules, "id") + " = Number of molecules with ids");
  //console.log(count(molecules, "description") + " = Number of molecules with descriptions");
  // Prepare table headings.
  const names = ["Name", "Energy<br>kJ/mol", "Rotational constants<br>cm<sup>-1</sup>", "Vibrational frequencies<br>cm<sup>-1</sup>"];
  var table = getTH(names);
  // Process each molecule.
  for (let i = 0; i < molecules.length; i++) {
    var energy = "";
    var rotationalConstants = "";
    var vibrationalFrequencies = "";
    let id = molecules[i].getAttribute("id");
    if (id != null) {
      let active = molecules[i].getAttribute("active");
      if (active != null) {
        if (active === "false") {
          inactiveMolecules.add(id);
        }
      }
      //console.log("id =" + id);
      let propertyList = molecules[i].getElementsByTagName("propertyList");
      for (let j = 0; j < propertyList.length; j++) {
        let property = propertyList[j].getElementsByTagName("property");
        //console.log("property.length =" + property.length);
        for (let k = 0; k < property.length; k++) {
          let dictRef = property[k].getAttribute("dictRef");
          if (dictRef != null) {
            if (dictRef === "me:ZPE") {
              //console.log("dictRef =" + dictRef);
              let scalar = property[k].getElementsByTagName("scalar");
              //console.log("scalar =" + scalar);
              //console.log("scalar.length =" + scalar.length);
              let cn = scalar[0].childNodes;
              //console.log("cn.length =" + cn.length);
              for (let l = 0; l < cn.length; l++) {
                //console.log("cn[" + l + "]");
                if (cn[l] != null) {
                  //console.log("cn[" + l + "] =" + cn[l]);
                  //console.log("cn[" + l + "].length =" + cn[l].length);
                  //console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                  //console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                  energy = cn[l].nodeValue;
                  let energyFloat = parseFloat(energy);
                  moleculeEnergy.set(id, energyFloat);
                  minMoleculeEnergy = Math.min(minMoleculeEnergy, energyFloat);
                  maxMoleculeEnergy = Math.max(maxMoleculeEnergy, energyFloat);
                  //console.log("energy =" + energy);
                }
              }
            } else if (dictRef === "me:rotConsts") {
              //console.log("dictRef =" + dictRef);
              let array = property[k].getElementsByTagName("array");
              //console.log("array =" + array);
              //console.log("array.length =" + array.length);
              let cn = array[0].childNodes;
              //console.log("cn.length =" + cn.length);
              for (let l = 0; l < cn.length; l++) {
                //console.log("cn[" + l + "]");
                if (cn[l] != null) {
                  //console.log("cn[" + l + "] =" + cn[l]);
                  //console.log("cn[" + l + "].length =" + cn[l].length);
                  //console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                  //console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                  rotationalConstants = cn[l].nodeValue;
                  //console.log("rotationalConstants =" + rotationalConstants);
                }
              }
            } else if (dictRef === "me:vibFreqs") {
              //console.log("dictRef =" + dictRef);
              let array = property[k].getElementsByTagName("array");
              //console.log("array =" + array);
              //console.log("array.length =" + array.length);
              let cn = array[0].childNodes;
              //console.log("cn.length =" + cn.length);
              for (let l = 0; l < cn.length; l++) {
                //console.log("cn[" + l + "]");
                if (cn[l] != null) {
                  //console.log("cn[" + l + "] =" + cn[l]);
                  //console.log("cn[" + l + "].length =" + cn[l].length);
                  //console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
                  //console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
                  vibrationalFrequencies = cn[l].nodeValue;
                  //console.log("vibrationalFrequencies =" + vibrationalFrequencies);
                }
              }
            } else {
              //console.log("dictRef =" + dictRef);
            }
          }
        }
      }
      table += getTR(getTD(id) + getTD(energy) + getTD(rotationalConstants) + getTD(vibrationalFrequencies));
    }
  }
  //console.log("table =" + table);
  console.log("Molecule Energy:");
  moleculeEnergy.forEach (function(value, key) {
    console.log(key + ' = ' + value);
  })
  console.log("minMoleculeEnergy = " + minMoleculeEnergy);
  console.log("maxMoleculeEnergy = " + maxMoleculeEnergy);
  
  console.log("Inactive Molecules:");
  inactiveMolecules.forEach (function(value) {
    console.log(value);
  })

  return table;
}

/**
* Count the number of elements with a specific attribute.
* @param Element[] elements
* @param String attribute_name
* @return int
*/
function count(elements, attribute_name) {
  let r = 0;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(attribute_name) != null) {
      r++;
    }
  }
  return r;
}

/*
* @param headings An array of strings.
* @return String
*/
function getTH(headings) {
  var th = "";
  for (let i = 0; i < headings.length; i++) {
    th += "<th>" + headings[i] + "</th>"
  }
  return getTR(th);
}

/*
* @param String x A cell for a table row.
* @return x wrapped in td tags.
*/
function getTD(x) {
  return "<td>" + x + "</td>";
}

/*
* @param String x A row for a table.
* @return x wrapped in tr tags.
*/
function getTR(x) {
  return "<tr>" + x + "</tr>\n";
}

/*
* @param String x Table rows for a table.
* @return x wrapped in table tags.
*/
function getTable(x) {
  return "<table>" + x + "</table>";
}

/**
 * Convert XML to HTML.
 * @param String text The XML text.
 * @returns String The HTML text.
 */
function XMLToHTML(text) {
  return text.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    .replace(/  /g, "&nbsp;&nbsp;");
}

function createDiagram() {
  console.log("createDiagram");
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  canvas.height = canvas.width;
  console.log("canvas.width = " + canvas.width);
  console.log("canvas.height = " + canvas.height);
  ctx.transform(1, 0, 0, -1, 0, canvas.height)

  let xMax = canvas.height;
  let slope = 0.5;
  let intercept = null;

  //let firstReaction = reactionsInformation.entries().next().key;
  //console.log("firstReaction = " + firstReaction);
  //let intercept = moleculeEnergy.get(firstReaction);

  // Go through reactionInformation and draw lines.
  reactionsInformation.forEach (function(reactionMap, id) {
    //console.log("id = " + id);
    let reactants = reactionMap.get("reactants");
    if (intercept == null) {
      let firstReactant = reactants.values().next().value;
      console.log("firstReactant = " + firstReactant);
      intercept = moleculeEnergy.get(firstReactant);
      console.log("moleculeEnergy = " + intercept);
    }
    //reactionMap.forEach (function (v, k) {
    //    console.log(k + ' = ' + v);
    //})
  })
  console.log(intercept);

  ctx.moveTo(0, intercept);
  ctx.lineTo(xMax, f(xMax));
  ctx.strokeStyle = "black";
  ctx.stroke();

  function f(x) {
    return x * slope + intercept;
  }
  return canvas
}