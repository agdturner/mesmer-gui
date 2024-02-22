import {
    mapToString
} from './functions.js';

import {
    Molecule
} from './molecule.js';

import { Attributes, NumberWithAttributes } from './classes.js';

/**
 * A class for representing a Reaction Molecule.
 */
class ReactionMolecule extends Attributes {

    /**
     * A reference to the molecule.
     */
    molecule: Molecule;

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule) {
        super(attributes);
        this.molecule = molecule;
    }
}

/**
 * A class for representing a reactant.
 * This is a molecule often with a role in a reaction.
 */
export class Reactant extends ReactionMolecule {

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule) {
        super(attributes, molecule);
    }
}

/**
 * A class for representing a product.
 * This is a molecule produced in a reaction.
 */
export class Product extends ReactionMolecule {

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule) {
        super(attributes, molecule);
    }
}

/**
 * A class for representing a transition state.
 */
export class TransitionState extends ReactionMolecule {

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule) {
        super(attributes, molecule);
    }

    /**
     * A convenience method to get the name of the transition state.
     * @returns {string} The name of the transition state.
     */
    getName(): string {
        return this.molecule.id;
    }
}


/**
 * A class for representing the Arrhenius pre-exponential factor.
 */
export class PreExponential extends NumberWithAttributes {

    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes. 
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number) {
        super(attributes, value);
    }
}

/**
 * A class for representing the Arrhenius activation energy factor.
 */
export class ActivationEnergy extends NumberWithAttributes {

    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes. 
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number) {
        super(attributes, value);
    }
}

/**
 * A class for representing the modified Arrhenius parameter factor.
 */
export class NInfinity extends NumberWithAttributes {

    /**
     * @param {Map<string, string>} attributes The attributes. 
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number) {
        super(attributes, value);
    }
}

/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 */
export class MCRCMethod extends Attributes {

    /**
     * The name of the method.
     */
    mCRCMethodName: string;

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {string} name The name or xsi:type of the method.
     */
    constructor(attributes: Map<string, string>, name: string) {
        super(attributes);
        this.mCRCMethodName = name;
    }
    toString() {
        return `MCRCMethod(name(${this.mCRCMethodName}))`;
    }
}

/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 */
export class MesmerILT extends MCRCMethod {
    preExponential: PreExponential | undefined;;
    activationEnergy: ActivationEnergy | undefined;
    tInfinity: number | undefined;
    nInfinity: NInfinity | undefined;

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {PreExponential | undefined} preExponential The pre-exponential factor.
     * @param {ActivationEnergy | undefined} activationEnergy The activation energy.
     * @param {number | undefined} tInfinity The TInfinity.
     * @param {NInfinity | undefined} nInfinity The nInfinity.
     */
    constructor(attributes: Map<string, string>, preExponential: PreExponential | undefined,
        activationEnergy: ActivationEnergy | undefined, tInfinity: number | undefined,
        nInfinity: NInfinity | undefined) {
        super(attributes, "MesmerILT");
        this.preExponential = preExponential;
        this.activationEnergy = activationEnergy;
        this.tInfinity = tInfinity;
        this.nInfinity = nInfinity;
    }

    toString() {
        return `MesmerILT(${super.toString()}, ` +
            `preExponential(${this.preExponential}), ` +
            `activationEnergy(${this.activationEnergy}), ` +
            `TInfinity(${this.tInfinity}), ` +
            `nInfinity(${this.nInfinity}))`;
    }
}

/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 */
export class ZhuNakamuraCrossing extends MCRCMethod {
    harmonicReactantDiabat_FC: number;
    harmonicReactantDiabat_XO: number;
    harmonicProductDiabat_DE: number;
    exponentialProductDiabat_A: number;
    exponentialProductDiabat_B: number;
    exponentialProductDiabat_DE: number;

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
     * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
     * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
     * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
     * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
     * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
     */
    constructor(attributes: Map<string, string>,
        harmonicReactantDiabat_FC: number,
        harmonicReactantDiabat_XO: number,
        harmonicProductDiabat_DE: number,
        exponentialProductDiabat_A: number,
        exponentialProductDiabat_B: number,
        exponentialProductDiabat_DE: number) {
        super(attributes, "ZhuNakamuraCrossing");
        this.harmonicReactantDiabat_FC = harmonicReactantDiabat_FC;
        this.harmonicReactantDiabat_XO = harmonicReactantDiabat_XO;
        this.harmonicProductDiabat_DE = harmonicProductDiabat_DE;
        this.exponentialProductDiabat_A = exponentialProductDiabat_A;
        this.exponentialProductDiabat_B = exponentialProductDiabat_B;
        this.exponentialProductDiabat_DE = exponentialProductDiabat_DE;
    }
    toString() {
        return `ZhuNakamuraCrossing(${super.toString()}, ` +
            `harmonicReactantDiabat_FC(${this.harmonicReactantDiabat_FC.toString()}), ` +
            `harmonicReactantDiabat_XO(${this.harmonicReactantDiabat_XO.toString()}), ` +
            `harmonicProductDiabat_DE(${this.harmonicProductDiabat_DE.toString()}), ` +
            `exponentialProductDiabat_A(${this.exponentialProductDiabat_A.toString()}), ` +
            `exponentialProductDiabat_B(${this.exponentialProductDiabat_B.toString()}), ` +
            `exponentialProductDiabat_DE(${this.exponentialProductDiabat_DE.toString()}))`;
    }
}

/**
 * A class for representing the sum of states.
 * @param {string} units The units of energy.
 * @param {boolean} angularMomentum The angular momentum attribute.
 * @param {boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
/*
export class SumOfStates extends NumberWithAttributes {
    units: string;
    angularMomentum: boolean;
    noLogSpline: boolean;
    sumOfStatesPoints: SumOfStatesPoint[];
    constructor(units: string, angularMomentum: boolean, noLogSpline: boolean, sumOfStatesPoints: SumOfStatesPoint[]) {
        this.units = units;
        this.angularMomentum = angularMomentum;
        this.noLogSpline = noLogSpline;
        this.sumOfStatesPoints = sumOfStatesPoints;
    }
    toString() {
        return `SumOfStates(` +
            `units(${this.units}), ` +
            `angularMomentum(${this.angularMomentum.toString()}), ` +
            `noLogSpline(${this.noLogSpline.toString()}), ` +
            `sumOfStatesPoints(${arrayToString(this.sumOfStatesPoints, " ")}))`;
    }
}
*/

/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
/*
export class SumOfStatesPoint {
    value: number;
    energy: number;
    angMomMag: number;
    constructor(value: number, energy: number, angMomMag: number) {
        this.value = value;
        this.energy = energy;
        this.angMomMag = angMomMag;
    }
    toString() {
        return `SumOfStatesPoint(` +
            `value(${this.value}), ` +
            `energy(${this.energy.toString()}), ` +
            `angMomMag(${this.angMomMag.toString()}))`;
    }
}
*/

/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name or xsi:type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
/*
export class DefinedSumOfStates extends MCRCMethod {
    sumOfStates: SumOfStates;

    constructor(name: string, sumOfStates: SumOfStates) {
        super(name);
        this.sumOfStates = sumOfStates;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString()}, ` +
            `sumOfStates(${this.sumOfStates.toString()}))`;
    }
}
*/

/**
 * A class for representing a reaction.
 */
export class Reaction extends Attributes {

    /**
     * The id of the reaction. This is also stored in the attributes, but is hee for convenience...
     */
    id: string;

    /**
     * The reactants in the reaction.
     */
    reactants: Map<string, Reactant>;

    /**
     * The products of the reaction.
     */
    products: Map<string, Product>;

    /**
     * The MCRCMethod.
     */
    mCRCMethod: MCRCMethod | undefined;

    /**
     * The transition state.
     */
    transitionState: TransitionState | undefined;

    /**
     * The tunneling.
     */
    tunneling: Tunneling | undefined;

    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {string} id The id of the reaction.
     * @param {Map<string, Reactant>} reactants The reactants in the reaction.
     * @param {Map<string, Product>} products The products of the reaction.
     * @param {MCRCMethod | undefined} mCRCMethod The MCRCMethod (optional).
     * @param {TransitionState | undefined} transitionState The transition state (optional).
     * @param {Tunneling | undefined} tunneling The tunneling (optional).
     */
    constructor(attributes: Map<string, string>, id: string,
        reactants: Map<string, Reactant>, products: Map<string, Product>,
        mCRCMethod?: MCRCMethod | undefined,
        transitionState?: TransitionState | undefined,
        tunneling?: Tunneling | undefined) {
        super(attributes);
        this.id = id;
        this.reactants = reactants;
        this.products = products;
        this.mCRCMethod = mCRCMethod;
        this.transitionState = transitionState;
        this.tunneling = tunneling;
    }

    /**
     * Convert the product to a string.
     * @returns String representation of the product.
     */
    toString(): string {
        let s: string = super.toString();
        return super.toString() + `id(${this.id}), ` +
            `reactants(${mapToString(this.reactants)}), ` +
            `products(${mapToString(this.products)}), ` +
            `mCRCMethod(${this.mCRCMethod?.toString()}), ` +
            `transitionState(${this.transitionState?.toString()}), ` +
            `tunneling(${this.tunneling?.toString()}))`;
    }

    /**
     * Get the label of the reactants.
     * @returns The label of the reactants.
     */
    getReactantsLabel(): string {
        return Array.from(this.reactants.values()).map(reactant => reactant.molecule.id).join(' + ');
    }

    /**
     * Get the combined energy of the reactants.
     * @returns The combined energy of the reactants.
     */
    getReactantsEnergy(): number {
        return Array.from(this.reactants.values()).map(reactant => reactant.molecule.getEnergy()).reduce((a, b) => a + b, 0);
    }

    /**
     * Returns the label for the products.
     * @returns The label for the products.
     */
    getProductsLabel(): string {
        return Array.from(this.products.values()).map(product => product.molecule.id).join(' + ');
    }

    /**
     * Returns the total energy of all products.
     * @returns The total energy of all products.
     */
    getProductsEnergy(): number {
        return Array.from(this.products.values()).map(product => product.molecule.getEnergy()).reduce((a, b) => a + b, 0);
    }

    /**
     * Get the label of the reaction.
     * @returns The label of the reaction.
     */
    getLabel(): string {
        let label: string = this.getReactantsLabel() + ' -> ' + this.getProductsLabel();
        return label;
    }

    /**
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad?: string, level?: number): string {
        // Padding
        let padding0: string = "";
        let padding1: string = "";
        let padding2: string = "";
        let padding3: string = "";
        if (pad != undefined && level != undefined) {
            padding0 = pad.repeat(level);
            padding1 = padding0 + pad;
            padding2 = padding1 + pad;
            padding3 = padding2 + pad;
        }
        /*
        // Atoms
        let atoms_xml: string = "";
        for (let atom of this.atoms.values()) {
            atoms_xml += atom.toTag(padding2);
        }
        if (this.atoms.size > 1) {
            if (atoms_xml != "") {
                atoms_xml = getTag(atoms_xml, "atomArray", undefined, undefined, undefined, padding1, true);
            }
        }
        // Bonds
        let bonds_xml: string = "";
        for (let bond of this.bonds.values()) {
            bonds_xml += bond.toTag(padding2);
        }
        if (bonds_xml != "") {
            bonds_xml = getTag(bonds_xml, "bondArray", undefined, undefined, undefined, padding1, true);
        }
        // Properties
        let properties_xml: string = "";
        for (let [key, value] of this.properties) {
            let property_xml: string = "";
            if (value instanceof PropertyScalar) {
                property_xml += value.toXML(padding3);
            } else {
                property_xml += (value as PropertyArray).toXML(padding3);
            }
            properties_xml += getTag(property_xml, "property", undefined, undefined, undefined, padding2, true);
        }
        properties_xml = getTag(properties_xml, "propertyList", undefined, undefined, undefined, padding1, true);
        // EnergyTransferModel
        let energyTransferModel_xml: string = "";
        if (this.energyTransferModel) {
            energyTransferModel_xml = this.energyTransferModel.toXML(pad, padding1);
        }
        // DOSCMethod
        let dOSCMethod_xml: string = "";
        if (this.dOSCMethod) {
            dOSCMethod_xml = this.dOSCMethod.toTag(padding1);
        }
        // Molecule
        let attributes: Map<string, string> = new Map();
        attributes.set("id", this.id);
        if (this.description != null) {
            attributes.set("description", this.description);
        }
        return getTag(atoms_xml + bonds_xml + properties_xml + energyTransferModel_xml + dOSCMethod_xml,
            "molecule", attributes, undefined, undefined, padding0, true);
            */
        return "";
    }
}

/**
 * A class for representing a tunneling.
 * @param {string} name The name of the tunneling.
 */
export class Tunneling {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    toString() {
        return `tunneling(name(${this.name}))`;
    }
}