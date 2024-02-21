import { attribute } from 'libxmljs/dist/lib/bindings/functions.js';
import {
    arrayToString,
    mapToString
} from './functions.js';

import {
    Molecule
} from './molecule.js';

import {
    getTag
} from './xml.js';
import { Attributes, NumberWithAttributes } from './classes.js';

/**
 * A class for representing a molecule and a role.
 * @param {Molecule} molecule The molecule.
 * @param {string | null} role The role of the molecule.
 */
class MR {
    molecule: Molecule;
    role: string | null;
    constructor(molecule: Molecule, role: string | null) {
        this.molecule = molecule;
        this.role = role;
    }
    toString() {
        return `MR(molecule(${this.molecule}, role(${this.role ? this.role : 'null'}))`;
    }
}

/**
 * A class for representing a reactant in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {string | null} role The role of the molecule.
 */
export class Reactant extends MR {
    constructor(molecule: Molecule, role: string | null) {
        super(molecule, role);
    }
    toString() {
        return `Reactant(${super.toString()})`;
    }
}

/**
 * A class for representing a product in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
export class Product extends MR {
    constructor(molecule: Molecule, role: string) {
        super(molecule, role);
    }

    /**
     * Convert the product to a string.
     * @returns String representation of the product.
     */
    override toString(): string {
        return `Product(${super.toString()})`;
    }
}

/**
 * A class for representing a transition state.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
export class TransitionState extends MR {
    constructor(molecule: Molecule, role: string) {
        super(molecule, role);
    }

    /**
     * Convert the transition state to a string.
     * @returns {string} The string representation of the transition state.
     */
    override toString(): string {
        return `TransitionState(${super.toString()})`;
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
 * A class for representing MCRCTypes - microcanonical rate constant types.
 * @param {string} type The type of the microcanonical rate constant.
 */
export class MCRCType {
    type: string;
    constructor(type: string) {
        this.type = type;
    }

    /**
     * Convert the MCRCType to a string.
     * @returns {string} The string representation of the MCRCType.
     */
    toString(): string {
        return `MCRCType(` +
            `type(${this.type}))`;
    }
}

/**
 * A class for representing a Bounded Stepped Measure.
 * @param {number} value The value of the factor.
 * @param {string | null} units The units.
 * @param {number | undefined} lower The lower bound (optional).
 * @param {number | undefined} upper The upper bound (optional).
 * @param {number | undefined} stepsize The stepsize (optional).
 */
class BSMeasure extends NumberWithAttributes {
    lower: number | undefined;
    upper: number | undefined;
    stepsize: number | undefined;

    constructor(attributes: Map<string, string>, value: number, units: string | null, lower?: number, upper?: number, stepsize?: number) {
        super(attributes, value);
        this.lower = lower ?? undefined; // Use undefined as the default value
        this.upper = upper ?? undefined; // Use undefined as the default value
        this.stepsize = stepsize ?? undefined; // Use undefined as the default value
    }
    toString() {
        return `BSMeasure(${super.toString()}, ` +
            `lower(${this.lower == undefined ? 'undefined' : this.lower.toString()}), ` + // Check if lower is undefined
            `upper(${this.upper == undefined ? 'undefined' : this.upper.toString()}), ` + // Check if upper is undefined
            `stepsize(${this.stepsize == undefined ? 'undefined' : this.stepsize.toString()}))`; // Check if stepsize is undefined
    }
}

/**
 * A class for representing the Arrhenius pre-exponential factor. 
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 * @param {number | undefined} lower The lower bound.
 * @param {number | undefined} upper The upper bound.
 * @param {number | undefined} stepsize The stepsize.
 */
export class PreExponential extends BSMeasure {
    constructor(value: number, units: string, lower?: number | undefined, upper?: number | undefined,
        stepsize?: number | undefined) {
        super(value, units, lower, upper, stepsize);
    }
    toString() {
        return `PreExponential(${super.toString()})`;
    }
}

/**
 * A class for representing the Arrhenius activation energy factor.
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 */
export class ActivationEnergy extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }
    toString() {
        return `ActivationEnergy(${super.toString()})`;
    }
}

/**
 * A class for representing the modified Arrhenius parameter factor. 
 * @param {number} value The value of the factor.
 * @param {string | null} units The units.
 * @param {number | undefined} lower The lower bound.
 * @param {number | undefined} upper The upper bound.
 * @param {number | undefined} stepsize The stepsize.
 */
export class NInfinity extends BSMeasure {
    constructor(value: number, units: string | null, lower: number | undefined, upper: number | undefined,
        stepsize: number | undefined) {
        super(value, units, lower, upper, stepsize);
    }
    toString() {
        return `NInfinity(${super.toString()})`;
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
    constructor(attributes: Map<string,string>, name: string) {
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
     * @param {string} name The name or xsi:type of the method.
     * @param {PreExponential | undefined} preExponential The pre-exponential factor.
     * @param {ActivationEnergy | undefined} activationEnergy The activation energy.
     * @param {number | undefined} tInfinity The TInfinity.
     * @param {NInfinity | undefined} nInfinity The nInfinity.
     */
    constructor(name: string,
        preExponential: PreExponential | undefined,
        activationEnergy: ActivationEnergy | undefined,
        tInfinity: number | undefined,
        nInfinity: NInfinity | undefined) {
        super(name);
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
 * @param {string} name The name or xsi:type of the method.
 * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
 * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
 * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
 * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
 * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
 * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
 */
export class ZhuNakamuraCrossing extends MCRCMethod {
    harmonicReactantDiabat_FC: number;
    harmonicReactantDiabat_XO: number;
    harmonicProductDiabat_DE: number;
    exponentialProductDiabat_A: number;
    exponentialProductDiabat_B: number;
    exponentialProductDiabat_DE: number;
    constructor(name: string,
        harmonicReactantDiabat_FC: number,
        harmonicReactantDiabat_XO: number,
        harmonicProductDiabat_DE: number,
        exponentialProductDiabat_A: number,
        exponentialProductDiabat_B: number,
        exponentialProductDiabat_DE: number) {
        super(name);
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
export class SumOfStates {
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

/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
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

/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name or xsi:type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
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
        transitionState?: TransitionState | undefined, tunneling?: Tunneling | undefined) {
        super(attributes);
        this.id = id;
        this.reactants = reactants;
        this.products = products;
        this.mCRCMethod = mCRCMethod;
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
            `tunneling(${this.tunneling?.toString()}), ` +
            `transitionState(${this.transitionState?.toString()}))`;
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