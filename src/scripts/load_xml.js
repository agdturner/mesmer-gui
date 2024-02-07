import { 
  Atom, 
  Bond, 
  PropertyArray, 
  PropertyScalar, 
  Molecule, 
  Reactant, 
  Product, 
  TransitionState, 
  MCRCType, 
  PreExponential, 
  ActivationEnergy, 
  NInfinity, 
  MesmerILT, 
  MCRCMethod, 
  ZhuNakamuraCrossing, 
  SumOfStates, 
  SumOfStatesPoint, 
  DefinedSumOfStates, 
  Reaction, 
  PTpair, 
  Conditions, 
  GrainSize 
} from "./classes.js";

/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
const molecules = new Map([]);

/**
 * For storing the maximum molecule energy in a reaction.
 */
var maxMoleculeEnergy = -Infinity;

/**
 * For storing the minimum molecule energy in a reaction.
 */
var minMoleculeEnergy = Infinity;

/**
 * A map of reactions with Reaction.id as keys and Reactions as values.
 */
const reactions = new Map([]);

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
      //console.log("xml = " + xml);
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
  console.log("Number of elements ="  + elements.length);
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
  let xml_reactions = xml.getElementsByTagName("reaction");
  let xml_reactions_length = xml_reactions.length);
  console.log("Number of xml reaction elements = " + xml_reactions_length);
  // Report number of reactions with id attributes.
  console.log("Number of xml reaction elements with ids = " + count(xml_reactions, "id"));
  // Prepare table headings.
  names = ["ID", "Reactants", "Products", "Transition State", "PreExponential", "Activation Energy", "TInfinity", "NInfinity"];
  var table = getTH(names);
  // Process each reaction.
  for (let i = 0; i < xml_reactions_length; i++) {
    let id = xml_reactions[i].getAttribute("id");
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
          ttransitionState = moleculeRef;
          transitions.add(ttransitionState);
          if (reactantToTransitionStates.has(treactants)) {
            console.log("Adding transition state " + ttransitionState);
            reactantToTransitionStates.get(treactants).add(ttransitionState);
          } else {
            console.log("Adding transition states and transition " + ttransitionState);
            ts = new Set([]);
            ts.add(ttransitionState);
            reactantToTransitionStates.set(treactants, ts);
          }
        } else {
          //console.log("elements[" + j + "].nodeName = " + elements[j].nodeName);
        }
      }
      productsToTransitionState.set(tproducts, ttransitionState);
      transitions.add(ttransitionState);
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
  reactionsInformation.forEach(function (reactionMap, id) {
    //console.log(id);
    reactionMap.forEach(function (v, k) {
      if (v instanceof Set) {
        //console.log(k + ' = ' + Array.from(v));
      } else {
        //console.log(k + ' = ' + v);
      }
    })
  })
  //console.log("Returning table...");
  return table;
}

/**
 * Generate molecules table.
 * Initialise the moleculeEnergies Map.
 * @param XMLDocument xml
 * @return String
 */
function parseMolecules(xml) {
  let xml_molecules = xml.getElementsByTagName('moleculeList').getElementsByTagName('molecule');
  let xml_molecules_length = xml_molecules.length;
  console.log("Number of molecules = " + xml_molecules_length);
  // Prepare table headings.
  const names = ["Name", "Energy<br>kJ/mol", "Rotational constants<br>cm<sup>-1</sup>", "Vibrational frequencies<br>cm<sup>-1</sup>"];
  var table = getTH(names);
  // Process each molecule.
  for (let i = 0; i < xml_molecules.length; i++) {
    var energy = "";
    var rotationalConstants = "";
    var vibrationalFrequencies = "";
    let id = xml_molecules[i].getAttribute("id");
    //console.log("id =" + id);
    let description = xml_molecules[i].getAttribute("description");
    let active = xml_molecules[i].getAttribute("active");
    // Read atomArray
    let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0].getElementsByTagName("atom");
    const atomArray = [];
    for (let j = 0; j < xml_atomArray.length; j++) {
      let xml_atom = xml_atomArray[j];
      let atom = new Atom(xml_atom.getAttribute("id"), xml_atom.getAttribute("elementType"));
      console.log(atom.toString());
      atomArray.push(atom);
    }
    // Read bondArray
    let xml_bondArray = xml_molecules[i].getElementsByTagName("bondArray")[0].getElementsByTagName("bond");
    const bondArray = [];
    for (let j = 0; j < xml_bondArray.length; j++) {
      let xml_bond = xml_bondArray[j];
      let atomRefs2 = xml_bond.getAttribute("atomRefs2").split(" ");
      let bond = new Atom(atomRefs2[0], atomRefs2[1], xml_bond.getAttribute("order"));
      console.log(bond.toString());
      bondArray.push(bond);
    }
    // Read propertyList        
    let xml_properties = xml_molecules[i].getElementsByTagName("propertyList")[0].getElementsByTagName("property");
    const properties = [];
    for (let j = 0; j < xml_properties.length; j++) {
      let dictRef = xml_properties[j].getAttribute("dictRef");
      if (dictRef != null) {
        if (dictRef === "me:ZPE") {
          //console.log("dictRef =" + dictRef);
          let xml_scalar = xml_properties[j].getElementsByTagName("scalar")[0];
          //console.log("xml_scalar =" + xml_scalar);
          //console.log("scalar.length =" + scalar.length);
          let cn = xml_scalar.childNodes;
          //console.log("cn.length =" + cn.length);
          for (let k = 0; k < cn.length; l++) {
            //console.log("cn[" + l + "]");
            if (cn[l] != null) {
              //console.log("cn[" + l + "] =" + cn[l]);
              //console.log("cn[" + l + "].length =" + cn[l].length);
              //console.log("cn[" + l + "].nodeName =" + cn[l].nodeName);
              //console.log("cn[" + l + "].nodeValue =" + cn[l].nodeValue);
              energy = cn[l].nodeValue;
              let energyFloat = parseFloat(energy);
              moleculeEnergies.set(id, energyFloat);
              minMoleculeEnergy = Math.min(minMoleculeEnergy, energyFloat);
              maxMoleculeEnergy = Math.max(maxMoleculeEnergy, energyFloat);
              //console.log("energy =" + energy);
            }
          }
        } else if (dictRef === "me:rotConsts") {
          //console.log("dictRef =" + dictRef);
          let array = xml_properties[j].getElementsByTagName("array");
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
          let array = xml_properties[j].getElementsByTagName("array");
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
      let property = new Property(atomRefs2[0], atomRefs2[1], xml_bond.getAttribute("order"));
      console.log(bond.toString());
      bondArray.push(bond);

      table += getTR(getTD(id) + getTD(energy) + getTD(rotationalConstants) + getTD(vibrationalFrequencies));
    }
    let molecule = new Molecule(id, description, atomArray, bondArray, properties, DOSCMethod);
  }
  //console.log("table =" + table);
  console.log("Molecule Energies:");
  moleculeEnergies.forEach(function (value, key) {
    console.log(key + ' = ' + value);
  })
  console.log("minMoleculeEnergy = " + minMoleculeEnergy);
  console.log("maxMoleculeEnergy = " + maxMoleculeEnergy);

  console.log("Inactive Molecules:");
  inactiveMolecules.forEach(function (value) {
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

  // Get text height for font size.
  let th = getTextHeight(ctx, "Aj");
  console.log("th = " + th);

  let black = "black";
  let green = "green";

  /**
   * The number of reactions and transitions.
   */
  var nReactionsAndTransitions = reactionsInformation.size + transitions.size;
  console.log("nReactionsAndTransitions = " + nReactionsAndTransitions);

  let xMax = canvas.height;
  let slope = 0.5;

  //let firstReaction = reactionsInformation.entries().next().key;
  //console.log("firstReaction = " + firstReaction);
  //let intercept = moleculeEnergies.get(firstReaction);

  let x00 = 0;
  let y00 = null;

  // Go through reactionInformation and draw lines.
  reactionsInformation.forEach(function (reactionMap, id) {
    console.log("id = " + id);
    let reactants = reactionMap.get("reactants");
    let firstReactant = reactants.values().next().value;
    console.log("firstReactant = " + firstReactant);
    let reactantLabel = reactionMap.get("reactantLabel");
    console.log("reactantLabel = " + reactantLabel);
    let y01 = moleculeEnergies.get(firstReactant);
    console.log("moleculeEnergy = " + y01);
    // Get text width.
    let tw = Math.max(getTextWidth(ctx, y01), getTextWidth(ctx, reactantLabel));
    console.log("tw = " + tw);
    let x01 = x00 + tw;
    if (y00 == null) {
      y00 = y01;
      // Draw horizontal line and add label.
      drawLevel(ctx, green, 4, x00, y00, x01, y01, th, reactantLabel);
      x00 = x01;
      let x0 = x01;
      let y0 = y01;
      // Get Product
      let products = reactionMap.get("products");
      console.log("products = " + products);
      console.log("products.size = " + products.size);
      let i = 0;
      reactionMap.get("products").forEach(function (product) {
        console.log("product = " + product);
        i ++;
        let y1 = moleculeEnergies.get(product);
        if (y1 == null) {
          console.log("y1 = " + y1);
          throw "exit";
        } else {
          let x1 = x0 + (tw * i);
          console.log("moleculeEnergy = " + y1);
          // Draw connector line.
          drawLine(ctx, black, 2, x0, y0, x1, y1);
          x0 = x1;
          x1 = x0 + tw;
          y0 = y1;
          throw "exit";
        }
      });
    } else {
      let tss = reactantToTransitionStates.get(reactantLabel);
      if (tss != null) {
        let x0 = x01;
        let y0 = y01;
        let i = 0;
        // Iterate over each transition state.
        tss.forEach(function (ts) {
          i++;
          console.log("ts = " + ts);
          let y1 = moleculeEnergies.get(ts);
          let x1 = x0 + (tw * i);
          console.log("moleculeEnergy = " + y1);
          tw = Math.max(getTextWidth(ctx, y1), getTextWidth(ctx, ts));
          reactantLabel = ts;
          // Draw connector line.
          drawLine(ctx, black, 2, x0, y0, x1, y1);
          x0 = x1;
          x1 = x0 + tw;
          y0 = y1;
          // Draw horizontal line and add label.
          drawLevel(ctx, green, 4, x0, y0, x1, y1, th, reactantLabel);
          x0 = x1;
        });
      } else {
        // Draw connector line.
        drawLine(ctx, black, 2, x00, y00, x01, y01);
        x00 = x01;
        x01 = x00 + tw;
        y00 = y01;
        // Draw horizontal line and add label.
        drawLevel(ctx, green, 4, x00, y00, x01, y00, th, reactantLabel);
        x00 = x01;
      }
    }
  })
  console.log(intercept);

  function f(x) {
    return x * slope + intercept;
  }
  return canvas
}

function drawLevel(ctx, strokeStyle, strokewidth, x0, y0, x1, y1, th, reactantLabel) {
  writeText(ctx, y1, strokeStyle, x0, y1 + th);
  writeText(ctx, reactantLabel, strokeStyle, x0, y1 - th);
  drawLine(ctx, strokeStyle, strokewidth, x0, y0, x1, y1);
}

/**
 * Draw a line (segment) on the canvas.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} strokeStyle The name of a color or a gradient to use for the lines.
 * @param {Integer} x1 The start x-coordinate of the line.
 * @param {Integer} y1 The start y-coordinate of the line.
 * @param {Integer} x2 The end x-coordinate of the line.
 * @param {Integer} y2 The end y-coordinate of the line.
 */
function drawLine(ctx, strokeStyle, strokewidth, x1, y1, x2, y2) {
  // Save the context (to restore after).
  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = strokewidth;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // Restore the context.
  ctx.restore();
}

/**
 * Writes text to the canvas. (It is probably better to write all the labels in one go.)
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} text
 * @param {Integer} x The position of the text.
 * @returns The height of the text in pixels.
 */
function writeText(ctx, text, colour, x, y) {
  // Save the context (to restore after).
  ctx.save();
  // Translate to the point where text is to be added.
  ctx.translate(x, y);
  // Invert Y-axis.
  ctx.scale(1, -1);
  // Set the text colour.
  ctx.fillStyle = colour;
  // Write the text.
  ctx.fillText(text, 0, 0);
  // Restore the context.
  ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} text 
 * @returns The height of the text in pixels.
 */
function getTextHeight(ctx, text) {
  var fontMetric = ctx.measureText(text);
  return fontMetric.actualBoundingBoxAscent + fontMetric.actualBoundingBoxDescent;
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} text 
 * @returns The width of the text in pixels.
 */
function getTextWidth(ctx, text) {
  return ctx.measureText(text).width;
}